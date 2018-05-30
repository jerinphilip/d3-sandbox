var update_text = function(bins){
    var universal = d3.select("#content")
        .selectAll("div")
        .remove()
        .exit()
        .data(bins)
        .enter()

    var bin = universal.selectAll("div")
        .data(d => d)
        .enter()

    var tr = bin.append("div")
        .attr("class", "row translation")


    var text = tr.append("div")
        .attr("class", "col-8")

    var add = function(root, name, fn){
        var group = root.append("div").attr("class", "input-group mb-0")
        group.append("span")
            .attr("class", "form-control")
            .text(fn)
        group.append("div")
            .attr("class", "input-group-append")
            .append("span")
            .attr("class", "input-group-text" + " " + name)
            .text(name)

    }

    tr.append("div")
        .attr("class", "col-2")
        .text(d => "bleu: " + d.bleu);

    add(text, 'source', d => d.x);
    add(text, 'target', d => d.z);
    add(text, 'prediction', d => d.y);
}

var update_histogram = function(bins) {
    var x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
    var _translate = (_x, _y) => 'translate(' + x(_x) + ',' + y(_y) + ")"
    var _dx = d => x(d.x1) - x(d.x0)
    var binwidth = width/bins.length;

    var _debug = function(d){
        return d.x0;
    }

    var odd_even = function(d, i){
        if (i%2 == 0){ return "steelblue"; }
        else { return "coral"; }
    }

    var bar = g.selectAll(".bar")
        .remove()
        .exit()
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", d => _translate(d.x0, d.length))

    bar.append("rect")
        .attr("x", _debug) 
        .attr("width", binwidth)
        .attr("height", d => height - y(d.length))
        .attr("fill", odd_even);
        //.attr("fill", "steelblue")

    bar.append("text")
        .attr("dy", "-0.5em")
        .attr("x", (_dx(bins[0])/2))
        .attr("text-anchor", "middle")
        .text( d => d.length )

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", _translate(0, 0))
        .call(d3.axisBottom(x))
}

var load_summary = function(dataset){
    var path = 'csvs/translation-'+ dataset + '.csv'
    console.log(path);

    d3.csv(path, function(data){
        var hist_fn = d3.histogram().value(d => d.bleu).thresholds(20);
        data.forEach(function(d){
            d.bleu = + d.bleu;
        });
        var bins = hist_fn(data);
        console.log(bins);
        var avg_bleu = d3.sum(data, d => d.bleu)/data.length;
        console.log(avg_bleu);
        bins.reverse();

        update_text(bins);
        update_histogram(bins);

        d3.select("#avg-bleu")
            .text(avg_bleu);

    });
}


load_summary("ipl");
