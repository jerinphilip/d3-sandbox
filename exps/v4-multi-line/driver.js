

// Define margins, dimensions, and some line colors
const margin = {top: 40, right: 120, bottom: 30, left: 40};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

var create_options = function(){
    var options = {
        "language": new Set(),
        "ngrams": new Set(),
        "dataset": new Set()
    };
    return options;
}


var extract = function(data){
    var options = create_options()
    data.forEach(function(datum){
        for(key in options){
            options[key].add(datum[key]);
        }
    });
    return options;
}

var toList = function(dict){
    _dict = []
    for(key in dict){
        _d = {"key": key, "values": dict[key]};
        _dict.push(_d)
    }
    return _dict;
}


// Load the data and draw a chart
let states, tipBox;
d3.json('bouncer.analysis', d => {
    states = d;
    original = d;
    mx = {
        "y": 1e6,
        "x": 8e4
    }

    var options = extract(d);
    var selected = options;

    const x = d3.scaleLinear().domain([0, mx.x]).range([0, width]);     
    const y = d3.scaleLinear().domain([0, mx.y]).range([height, 0]);

    const chart = d3.select('svg').append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const tooltip = d3.select('#tooltip');
    const tooltipLine = chart.append('line');

    // Add the axes and a title

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    var line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
    var inSelect = function(d){
        var n = selected["ngrams"].has(d.ngrams)
        var l = selected["language"].has(d.language);
        var ds = selected["dataset"].has(d.dataset);
        return n && l && ds
    }

    var line_or_null = function(d){
        if (inSelect(d)){
            return line(d.data);
        }
        return null;
    }

    var findMax = function(samples){
        var xs = [],
            ys = [];
        var samples = samples.filter(inSelect);
        samples.forEach(function(e){
            xs.push(d3.max(e.data.map( element => element[0])));
            ys.push(d3.max(e.data.map( element => element[1])));
        })
        _d = { "x": d3.max(xs), "y": d3.max(ys) };
        return _d;
    }

    var updateAxis = function(v){
        x.domain([0, v.x]);
        y.domain([0, v.y]);
    }

    _key = d => d["ngrams"]+ '-' + d["dataset"] + '-' + d["language"];

    const _color = function(d){
        return color(_key(d));
    }


    const xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
    const yAxis = d3.axisLeft(y).tickFormat(d3.format('.2s'));
    chart.append('g').call(yAxis); 
    chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
    chart.append('text').html('ngram stats').attr('x', 200);

    var issue = chart.selectAll().data(d).enter()

    var paths = issue.append('path')
        .attr('fill', 'none')
        .attr('stroke', _color)
        .attr('stroke-width', 2)
        .datum( d => d)

    paths.attr('d', line_or_null);

    chart.selectAll()
        .data(d.filter(inSelect)).enter()
        .append('text')
        .html(_key)
        .attr('fill', _color)
        .attr('alignment-baseline', 'middle')
        .attr('x', width)
        .attr('dx', '.5em')
        .attr('y', d => y(d.data[d.data.length-1][1])); 

    tipBox = chart.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);

    /*
    var categories = d.length;
    var legendSpace = 300/categories;

    issue.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr("x", width + (margin.right/3) - 15) 
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
        .attr("fill", _color)
        .attr("class", "legend-box")

    issue.append("text")
        .attr("x", width + (margin.right/3))
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625)
        .text(_key);
    */


    var control = d3.select("#controls");
    var controls = control.selectAll("div")
        .data(toList(options)).enter()
        .append("div")
        .attr('class', 'col-4')

    var siftDown = function(d){
        xs = []
        ls = Array.from(d.values)
        ls.forEach(function(e){
            _d = {"key": d.key, "value": e};
            xs.push(_d);
        });
        return xs;
    }

    controls.append('h4').text(d => d.key);
    var boxes = controls.append('div')
        .attr('id', d => d.key)
        .selectAll('div')
        .data(siftDown)
        .enter()
        .append('div')

    boxes
        .append('input')
        .attr('type', 'checkbox')
        .attr('data-value', d => d.value)
        .attr('data-key', d => d.key)
        .property('checked', true)
        .on('change', function(wtf, i){
            var e = d3.event.target;
            var key = e.dataset.key,
                value = e.dataset.value;

            if(key == "ngrams")
                value = +(value);

            if(e.checked){
                state = selected[key].add(value);
            }
            else{
                state = selected[key].delete(value);
            }


            var v =  findMax(original);
            console.log("v:", v);
            updateAxis(v);
            paths
                .transition()
                .attr("d", line_or_null);
        });

    boxes
        .append('span')
        .text(d => d.value);



    function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }

    function drawTooltip() {
        var step = 10;
        const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / step) * step;

        states.sort((a, b) => {
            left = b.data.find(h => h[0] == year);
            right = a.data.find(h => h[0] == year);
            return left[0] - right[0];
        })  

        tooltipLine.attr('stroke', 'black')
            .attr('x1', x(year))
            .attr('x2', x(year))
            .attr('y1', 0)
            .attr('y2', height);

        tooltip.html(year)
            .style('display', 'block')
            .style('left', d3.event.pageX + 20)
            .style('top', d3.event.pageY - 20)
            .selectAll()
            .data(states.filter(inSelect)).enter()
            .append('div')
            .style('color', color)
            .html(d => _key(d) + ': ' + d.data.find(h => h[0] == year)[1]);
    }
})

