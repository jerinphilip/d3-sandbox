
var update_text = function(bins){
    bins = [bins];
    var universal = d3.select("#sample-content")
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
        .attr("class", "col-8 i-trans")

    var add = function(root, name, fn){
        var group = root.append("div").attr("class", "input-group mb-0")
        group.append("div")
            .attr("class", "input-group-append")
            .append("span")
            .attr("class", "input-group-text constw" + " " + name)
            .text(name)
        group.append("span")
            .attr("class", "form-control")
            .text(fn)

    }

    tr.append("div")
        .attr("class", "col-2")
        .text(d => "dbleu:" + Math.round(d.dblue*1000)/1000);

    add(text, 'source', d => d.x);
    add(text, 'target', d => d.z);
    add(text, 'i-pred', d => d.iy);
    add(text, 'a-pred', d => d.ay);
}

var key = d3.descending;
var ascending = true;
var _data;

var toggle = function(){
    if(ascending){
        key = d3.descending;
        d3.select("#order").text("Descending");
    }
    else{
        key = d3.ascending;
        d3.select("#order").text("Ascending");
    }
    _data.sort((x, y) => key(+x.dblue, +y.dblue));
    update(_data);
    ascending = !ascending;

}

var current = 0;
var per_page = 3;

var delta = function(sgn){
    current += sgn*per_page;
    current = Math.min(_data.length, current);
    current = Math.max(current, 0);
    update(_data);
}

var update = function(data){
    end = Math.min(current+per_page, data.length);
    vals = data.splice(current, end);
    update_text(vals);
}

var load = function(dataset){
    console.log(dataset);
    var fpath = "csvs/" + dataset + ".csv";
    d3.csv(fpath, function (data) {
        data.sort((x, y) => key(+x.dblue, +y.dblue));
        update(data);
        _data = data;
    });
}

load("ipl");
