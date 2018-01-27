var dataset = [150, 80, 42, 40, 22, 102, 33, 10, 90, 8, 70],
    maxHeight = 200;

var barWidth = 30;

// Updates the visualization 
function update() {


    // Update selection: Resize and position existing 
    // DOM elements with data bound to them.
    var selection = d3.select("#chart")
        .selectAll(".bar").data(dataset)
        .style("height", function(d){ 
            return d; 
        })
        .style("margin-top", function(d){ 
            return maxHeight - d; 
        });


    // Enter selection: Create new DOM elements for added 
    // data items, resize and position them and attach a 
    // mouse click handler.
    selection.enter()
        .append("div").attr("class", "bar")
        .style("width", barWidth)
        //.text(function(d){ return d; })
        .style("height", function(d){ 
            return d + "px"; 
        })
        .style("margin-top", function(d){ 
            return (maxHeight - d) + "px"; 
            //return 0;
        })
        //.style("background", "#f00")
        .on("click", function(e, i){
            dataset.splice(i, 1);
            update();
        });


    // Exit selection: Remove elements without data from the DOM
    selection.exit().remove();

    // Print underlying data array
    d3.select("#dataset").text(dataset);

};





// Add a new datum to the set
d3.select("#add-btn").on("click", function(e){
    if (dataset.length < 10) 
        dataset.push(Math.round(Math.random() * maxHeight));
    update();

});



// Fire when DOM is available
var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function() {
    update();
});





