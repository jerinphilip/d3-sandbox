// svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var width = 640,
    height = 500;

// could use transparent gradient overlay to vary raindrop color
function draw(count, size){
    var svg = d3.select("#svg").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var gradient = svg.append("defs").append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "20%")
        .attr("x2", "20%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#ccf");

    gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#1C425C");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#19162B");
    
    svg.selectAll("path") .data(d3.range(count))
        .enter().append("path")
        .attr("fill", "url(#gradient)")
        .attr("d", function() { return raindrop(size + Math.random() * 2); })
        .attr("transform", function(d) {
            return "rotate(" + d + ")"
                + "translate(" + (height / 4 + Math.random() * height / 6) + ",0)"
                + "rotate(90)";
        });
}

// size is linearly proportional to square pixels (not exact, yet)
function raindrop(size) {
    var r = Math.sqrt(size / Math.PI);
    return "M" + r + ",0"
        + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
        + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
        + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
        + "Z";
}


var count = 100, size = 10;
draw(count, size);


$('#raindrop_count').on("change", function(){
    count = $(this).val()
    console.log(count);
    d3.select("#svg").selectAll("*").remove(); 
    draw(count, size);
})

$('#raindrop_size').on("change", function(){
    size = $(this).val()
    console.log(size);
    d3.select("#svg").selectAll("*").remove(); 
    draw(count, size);
})
