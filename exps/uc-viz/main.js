
function random_sample(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}


var accessor = function(x, key_sequence){
    for(var i=0; i < key_sequence.length; i++){
        key = key_sequence[i]
        x = x[key];
    }
    return x;
}

var transform = function(json, invert, key_sequence){
    var src  = json["src"].split(" ");
    var tgt  = json["tgt"].split(" ")
    var hyp  = json["hyp"].split(" ")

    var scores = accessor(json, key_sequence);
    var scale = (invert)? -1: 1;

    ucs = [];
    for(var i=0; i < hyp.length; i++){
        uc = {
            "hyp": hyp[i],
            "score": scale*scores[i]
        }
        ucs.push(uc);
    }

    data = {
        "keys": key_sequence.join("_"),
        "src": src,
        "tgt": tgt,
        "ucs": ucs
    }

    return data;
};

var operate = function(root, json, invert, score_f){
    var _min, _max;
    data = transform(json, invert, score_f);
    _min = d3.min(data.ucs, d => d.score);
    _max = d3.max(data.ucs, d => d.score);
    color = d3.scaleSequential(d3.interpolateRdYlGn).domain([_min, _max]);
    ucdiv = root.append("div").attr("class", "uc")


    ucdiv
      .selectAll(".bar")
      .data(data.ucs)
      .enter()
      .append("span")
      .text(d => d.hyp)
      .style("background-color", d => d3.color(color(d.score)).copy({"opacity": 0.2}));

    ucdiv.append("span").text(" (" +data.keys + ")");
}

var f = function(d){
    console.log(d["vanilla"]["word"]["max_prob"]);
    return g(d);
}

var display = function(root, data){
    var div = root.append("div").attr("class", "example");
    var invert = true;
    var dont_invert = false;
    div.append("div").text("[src] " + data["src"]);
    div.append("div").text("[tgt] " + data["tgt"]);
    var ucs = div.append("div").attr("class", "ucs");
    operate(ucs, data, dont_invert, ["vanilla", "word", "max_prob"]);
    operate(ucs, data, dont_invert, ["epistemic", "word", "expectation"]);
    operate(ucs, data, invert, ["vanilla", "word", "entropy"]);
    operate(ucs, data, invert, ["aleatoric", "word"]);
    operate(ucs, data, invert, ["epistemic", "word", "variance"]);
}

d3.json("./output.json").then(function(json) {
    var root = d3.select("#space");
    var n = Math.min(json.length, 20);
    var sample = random_sample(json, n);
    for(var i=0; i<sample.length; i++){
        display(root, sample[i]);
    }
});
