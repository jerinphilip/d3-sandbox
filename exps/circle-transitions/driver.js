var x = d3.scaleTime()
    .range([0, width]);

var xAxis = d3.axisBottom(x);

var xAxisG = g.append("g")
    .attr("transform", "translate(0, " + height + ")");

var timeWindow = 1000;

d3.timer(function() {
  var now = Date.now();
  x.domain([now - timeWindow, now]);
  xAxisG.call(xAxis);
});

d3.select("button").on("click", function() {
  var time = Date.now();

  var circle = g.append("circle")
      .attr("r", 80)
      .attr("stroke-opacity", 0)
      .attr("cy", Math.random() * height);

  circle.transition("time")
      .duration(timeWindow)
      .ease(d3.easeLinear)
      .attrTween("cx", function(d) { return function(t) { return x(time); }; })

  circle.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr("r", 3.5)
      .attr("stroke-opacity", 1)
    .transition()
      .delay(timeWindow - 750 * 2)
      .ease(d3.easeCubicIn)
      .attr("r", 80)
      .attr("stroke-opacity", 0)
      .remove();
});

$("#time-window").on("change", function(d){
    val = $(this).val();
    timeWindow = 5000 - val;
    console.log(val)
})
