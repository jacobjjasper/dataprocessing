d3.json("2016_hardcoded.json", function(data){

  // creating information elements of barchart
  d3.select("head")
    .append("title")
    .text("Happiness score 1 till 10 country's Western Europe");

  d3.select("body")
    .append("h1")
    .text("Jacob Jasper, 10650385, Building your first visualization in D3.js");

  d3.select("body")
    .append("p")
    .html("The bargraph here shows the happiness scores of West-European \
    country's of 2016. The data was retrieved from \
    <a href='https://www.kaggle.com/datasets?sortBy=hottest&group=public&page=1&pageSize=20&size=small&filetype=json&license=all'>Kaggle.</a>");

  //Width and height of margin
  var w = 800;
  var h = 800;

  // make margins
  var margin = { top: 20, right: 20, bottom: 20, left: 20};

  //make the graph variables
  var graphWidth = w - margin.right - margin.leftl;
  var graphHeigth = h - margin.top - margin.bottom;
  var bars = data.length;
  var barPadding = 2;
  var barWidth = ((graphWidth - barPadding * bars) / bars);

  //define SVG
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  //define rect
  svg.selectAll("rect")
      .data(data)  // <-- The answer is here!
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
      return i * barWidth + margin.left
      })
      .attr("y", function (d) {
      return h - d["Happiness Score"] - margin.top
      })
      .attr("height", d["Happiness Score"])
      .attr("width", barWidth)
      .attr("fill", "teal");

  //define scale and axis of chart
  var xScale = d3.scale.ordinal()
                  .domain([0, d3.max(data, function(d) { return d[0]; })])
                  .range([0, w]);

  var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

  var yScale = d3.scale.linear()
                  .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                  .range([0, h]);

  var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(20);

  //Create x axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(xAxis);

  //Create Y axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

  //add text to axis
  svg.selectAll("text")
     .data(dataset)
     .enter()
     .append("text")
     .attr("x", function(d, i) {
           return d["Country"];
      })
      .attr("y", function(d) {
           return "Rating on scale of 1-10";
      });

  //creating interactivity
  svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d['Country']); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d["Happiness Score"]); })
    .attr("height", function(d) { return height - y(d["Happiness Score"]); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
});
