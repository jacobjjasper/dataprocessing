function make_bar(object) {

var bar_object =  [{"total": {"employmentrate":
    object["employment"], "lt unemployment": object["longterm unemployment"],
    "personal earnings": object["personal earnings"]}}, {"men": {"employmentrate_men":
        object["employment men"], "lt unemployment": object["longterm unemployment men"],
        "personal earnings": object["personal earnings men"]}}, {"women":
        {"employmentrate_men": object["employment women"], "lt unemployment":
        object["longterm unemployment women"], "personal earnings":
        object["personal earnings women"]}}];

  //width and height
  var w = 800;
  var h = 600;
  var margin = { top: 100, right: 100, bottom: 100, left: 250};

  //create SVG element
  var svg = d3.select("body")
            .append("svg")
            .attr("width", (w + margin.left + margin.right))
            .attr("height", (h + margin.top + margin.bottom))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // creating tip box to show data
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-20, 0])
              .html(function(d) {
                console.log(d);
                return  "<strong>Country:</strong> <strong>" + d["country"]
            + "</strong>" + "<br>" + "Employment rate (%): " + d["employmentrate"] + "<br>" +
        "Labour underutilization rate (%): " + d["labour uti"] + "<br>" + "Unemployment rate (%):"
        + d["unemployment"]});

  svg.call(tip);


};
