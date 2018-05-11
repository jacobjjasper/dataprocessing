/**
* This script loads a API's from a dataset and converts its data (GDP per capita
* index, labour utilization and unemploymentrate) into a scatterplot.
*....
*
* Dataprocessing: D3 Scatterplot
*
* Jacob Jasper (10650385)
*/

window.onload = function() {

  var gdp_unemployment_labour = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
  var gdp_unemployment_labour_2016 = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"

  d3.queue()
  .defer(d3.request, gdp_unemployment_labour)
  .defer(d3.request, gdp_unemployment_labour_2016)
  .awaitAll(doFunction);

function doFunction(error, response) {
  if (error) throw error;

  //store parsed JSON in variable
  var data_2015 = JSON.parse(response[0].responseText);
  var data_2016 = JSON.parse(response[1].responseText);

  //update graph between 2015 and 2016
  d3.select("#data_2015 button").on("click", function() {
    d3.select("svg").remove();
    d3.select("body").transition(make_scatter(data_2015))
  });
  d3.select("#data_2016 button").on("click", function() {
    d3.select("svg").remove();
    d3.select("body").transition(make_scatter(data_2016))
  });

  };
};

function make_scatter(dataset) {

  //make arrays to store data and names
  var labour_underutilisation_rate = [];
  var unemployment_rate = [];
  var gdp_per_capita_index = [];
  var countrys = [];

  var json = [];


    //iterate in the data
  for (let i =0; i < 25; i ++) {
    for (let j = 0; j < 3; j++) {

      //make variable to index observations
      var iets = i + ":" + j + ":0:0";

      //store the three 2015 variables in separated arrays
      if (dataset.dataSets[0].observations[iets] && j === 0) {
        labour_underutilisation_rate.push(dataset.dataSets[0].observations[iets][0]);
        }
      if (dataset.dataSets[0].observations[iets] && j === 1) {
        gdp_per_capita_index.push(dataset.dataSets[0].observations[iets][0]);
        }
      if (dataset.dataSets[0].observations[iets] && j === 2) {
        unemployment_rate.push(dataset.dataSets[0].observations[iets][0]);
        }

      }
      //store countrys in array
      countrys.push(dataset.structure.dimensions.observation[0].values[i].name);
      console.log(countrys[i]);
      //make array of dicts
      my_obj = {"country": countrys[i], "gdp": gdp_per_capita_index[i],
                "labour uti": labour_underutilisation_rate[i], "unemployment":
                unemployment_rate[i]};
      json.push(my_obj);
    };


    //make variable for max and min of your arrays for the scales
    var labour_max = Math.max(...labour_underutilisation_rate);
    var labour_min = Math.min(...labour_underutilisation_rate);
    var unemployment_max = Math.max(...unemployment_rate);
    var unemployment_min = Math.min(...unemployment_rate);
    var gdp_max = Math.max(...gdp_per_capita_index);
    var gdp_min = Math.min(...gdp_per_capita_index);

    //width and height
    var w = 800;
    var h = 600;
    var margin = { top: 100, right: 350, bottom: 100, left: 250};

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
              + "</strong>" + "<br>" + "GDP per capita index: " + d["gdp"] + "<br>" +
          "Labour underutilization rate (%): " + d["labour uti"] + "<br>" + "Unemployment rate (%):"
          + d["unemployment"]});

    svg.call(tip);

    //creating scale for 2015
    var x_scale = d3.scaleLinear()
                    .domain([unemployment_min, unemployment_max])
                    .range([0, w]);

    var y_scale = d3.scaleLinear()
                    .domain([labour_min, labour_max])
                    .range([h, 0]);

    var r_scale = d3.scaleLinear()
                    .domain([gdp_min, gdp_max])
                    .range([4, 20]);

    //creating variable for x axis
    var x_axis = d3.axisBottom()
                  .scale(x_scale);


    //append x axis to canvas and class
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h) + ")")
      .call(x_axis);

      //append label for x axis
      svg.append("text")
        .attr("class", "label")
        .attr("transform", "translate(0," + (h) + ")")
        .attr("x", w)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("Unemployment rate (%)");

    //creating variable for y axis
    var y_axis = d3.axisLeft()
                  .scale(y_scale);


    //append y axis to canvas and class
    svg.append("g")
      .attr("class", "y axis")
      .call(y_axis);

      //append label for y axis
      svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Labour underutilization rate (%)");



    //make a circle for each data point
    var dot =  svg.selectAll("circle")
                 .data(json)
                 .enter();


       dot.append("circle")

       //specifying the circle attributes of cx, cy, r
       .attr("cx", function(d) {
          return x_scale(d["unemployment"]);
        })
        .attr("cy", function(d) {
          return y_scale(d["labour uti"]);
        })
        .attr("r", function(d) {
          return r_scale(d["gdp"])
        })

        //defining the style of each datapoint
        .style("fill", function(d) {
          if (d["gdp"] <= 80) {
            return "red"
          }
          else if (d["gdp"] <= 90 && d["gdp"] > 80) {
            return "orange"
          }
          else if (d["gdp"] < 100 && d["gdp"] > 90) {
            return "yellow"
          }
          else if (d["gdp"] >= 100 && d["gdp"] < 110) {
            return "green"
          }
          else if (d["gdp"] >= 110 && d["gdp"] < 120) {
            return "purple"
          }
          else {
            return "blue"
          }
        })
        .style("stroke-width", 1)
        .style("stroke", "black")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    //make array for colors and names of bars of legend
    var colors = [{"name": "<= 80", "color": "red"}, {"name": "81 - 90", "color": "orange"},
    {"name": "91 - 99", "color": "yellow"}, {"name": "100 - 109", "color": "green"},
    {"name": "110 - 119", "color": "purple"}, {"name": ">120", "color": "blue"}];

    //append legend bars
    var legend = svg.selectAll("legend")
                    .data(colors)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + (250 + i * 20) + ")"; })

    svg.append("text")
      .attr("class", "legend_title")
      .attr("x", w + 40)
      .attr("y", 245)
      .text("GDP per capita index (2007 = 100)")
      .style("text-anchor", "start")
      .style("font-weight", "bold");


    legend.append("text")
          .attr("class", "legend_text")
          .attr("x", w + 100)
          .attr("y", 15)
          .text(function(d){
            return d["name"]
          })
          .style("text-anchor", "start");


    legend.append("rect")
          .attr("class", "legend_bars")
          .attr("x", w + 40)
          .attr("width", 60)
          .attr("height", 18)
          .style("fill", function(d){
            return d["color"]
          });
};
