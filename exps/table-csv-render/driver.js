
d3.csv('table.csv', function(data){

    var hist_fn = d3.histogram().value(d => d.bleu).thresholds(20);
    var bins = hist_fn(data);
    bins.reverse();

    var universal = d3.select("#content")
        .selectAll("div")
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

    var x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);


    var _translate = (_x, _y) => 'translate(' + x(_x) + ',' + y(_y) + ")"

    var bar = g.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", d => _translate(d.x0, d.length))

    var _dx = d => x(d.x1) - x(d.x0)

    var debug = function(d){
        console.log(d)
    }

    bar.append("rect")
        .attr("x", 1)
        .attr("width", _dx(bins[0]) - 1)
        .attr("height", d => height - y(d.length))
        .attr("fill", "steelblue")

    bar.append("text")
        .attr("dy", "-0.5em")
        .attr("x", (_dx(bins[0])/2))
        .attr("text-anchor", "middle")
        .text( d => d.length )

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", _translate(0, 0))
        .call(d3.axisBottom(x))


});
