/**
* This script loads a local .json file ....
*....
*
* Dataprocessing: D3 Scatterplot
*
* Jacob Jasper (10650385)
*/

window.onload = function() {

  var gdp_unemployment_labour_2015 = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
  var gdp_unemployment_labour_2016 = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"

  d3.queue()
  .defer(d3.request, gdp_unemployment_labour_2015)
  .defer(d3.request, gdp_unemployment_labour_2016)
  .awaitAll(doFunction);

function doFunction(error, response) {
  if (error) throw error;

  //store parsed JSON in variable
  var data_2015 = JSON.parse(response[0].responseText);
  var data_2016 = JSON.parse(response[1].responseText);

  //make arrays to store data and names of 2015
  var labour_underutilisation_rate_2015 = [];
  var unemployment_rate_2015 = [];
  var gdp_per_capita_index_2015 = [];
  var countrys_2015 = [];

  //make arrays to store data and names of 2016
  var labour_underutilisation_rate_2016 = [];
  var unemployment_rate_2016 = [];
  var gdp_per_capita_index_2016 = [];
  var countrys_2016 = [];

  var json_2015 = [];
  var json_2016 = [];

    //iterate in the data
  for (let i =0; i < 25; i ++) {
    for (let j = 0; j < 3; j++) {

      //make variable to index observations
      var iets = i + ":" + j + ":0:0";

      //store the three 2015 variables in separated arrays
      if (data_2015.dataSets[0].observations[iets] && j === 0) {
        labour_underutilisation_rate_2015.push(data_2015.dataSets[0].observations[iets][0]);
        }
      if (data_2015.dataSets[0].observations[iets] && j === 1) {
        gdp_per_capita_index_2015.push(data_2015.dataSets[0].observations[iets][0]);
        }
      if (data_2015.dataSets[0].observations[iets] && j === 2) {
        unemployment_rate_2015.push(data_2015.dataSets[0].observations[iets][0]);
        }

        //store the three 2016 variables in separated arrays
        if (data_2016.dataSets[0].observations[iets] && j === 0) {
          labour_underutilisation_rate_2016.push(data_2016.dataSets[0].observations[iets][0]);
          }
        if (data_2016.dataSets[0].observations[iets] && j === 1) {
          gdp_per_capita_index_2016.push(data_2016.dataSets[0].observations[iets][0]);
          }
        if (data_2016.dataSets[0].observations[iets] && j === 2) {
          unemployment_rate_2016.push(data_2016.dataSets[0].observations[iets][0]);
          }
      }
      //store countrys in array
      countrys_2015.push(data_2015.structure.dimensions.observation[0].values[i].name);
      countrys_2016.push(data_2016.structure.dimensions.observation[0].values[i].name);

      //make array of dicts for 2015
      my_obj_2015 = {"country": countrys_2015[i], "gdp": gdp_per_capita_index_2015[i],
                "labour uti": labour_underutilisation_rate_2015[i], "unemployment":
                unemployment_rate_2015[i]};
      json_2015.push(my_obj_2015);

      //make array of dicts for 2016
      my_obj_2016 = {"country": countrys_2016[i], "gdp": gdp_per_capita_index_2016[i],
                "labour uti": labour_underutilisation_rate_2016[i], "unemployment":
                unemployment_rate_2016[i]};
      json_2016.push(my_obj_2016);
    }

    //Width and height
    var w = 800;
    var h = 800;
    var margin = { top: 20, right: 20, bottom: 20, left: 20};

    //Create SVG element
    var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

    //Make a circle for each data point
    svg.selectAll("circle")
       .data(json_2015)
       .enter()
       .append("circle")

       //Specifying the circle attributes of cx, cy, r
       .attr("cx", function(d) {
          return d["unemployment"];
        })
        .attr("cy", function(d) {
          return d["labour uti"];
        })
        .attr("r", 5);


  };
};
