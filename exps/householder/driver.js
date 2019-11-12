
var origin = [width/2, height/2];


var drawLine = function(s, t, attrs){
    var line = svg.append("line")
        .attr("x1", origin[0] + s[0])
        .attr("y1", origin[1] - s[1])
        .attr("x2", origin[0] + t[0])
        .attr("y2", origin[1] - t[1]);

    for (var key in attrs){
        line.attr(key, attrs[key])
    };
};


var defs = svg.append("defs")
var arrowHead = defs.append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");

var arrowTail = defs.append("marker")
    .attr("id", "arrowtail")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("circle")
        .attr("r", 5)
        .attr("cx", 5)
        .attr("cy", 5)

var drawArrow = function(s, t){
    var arrowStyle = {
        "width": 10, 
        "stroke": "black",
        "marker-end": "url(#arrow)",
        "marker-start": "url(#arrowtail)",
        "class": "arrow"
    };
    drawLine(s, t, arrowStyle);

};


var drawAxes = function(origin){
    var axisStyle = {
        "width": 10,
        "stroke": "grey"
    };
    var x0 = origin[0];
    var y0 = origin[1];

    drawLine([-x0, 0], [x0, 0], axisStyle);
    drawLine([0, -y0], [0, y0], axisStyle);
};


// drawArrow([0, 0], [width/4, height/4]);
drawAxes(origin)


var houseReflect = function(x, e){
    var alpha = math.norm(x);
    var ae = math.multiply(alpha, e);
    var u = math.add(x, ae);
    var v = math.multiply(1/math.norm(u), u)
    var I = math.eye(x.length, x.length);

    v = math.matrix([v]);
    v = math.transpose(v);
    var vvt = math.multiply(v, math.transpose(v));
    var H = math.add(I, math.multiply(-2, vvt));

    // Hyperplane is defined by 
    drawArrow([0, 0], ae);
    drawArrow(ae, x); 
    drawArrow([0, 0], x);

    console.log(v);
};

r = [200, 100];
houseReflect(r, [1, 0]);

// drawArrow([0, 0], r);

