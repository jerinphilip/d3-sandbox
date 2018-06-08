var tabulate = function (data) {
    var table = d3.select('#content').append('table')
        .attr("class", "table")
    var thead = table.append('thead')
    var tbody = table.append('tbody')


}

var active_trained_on = new Set();
var active_splits = new Set();
var active_tranfer_to = new Set();

var grid = function(data){

}

d3.json('transfer-bleu.json',function (data) {
    console.log(data);
});
