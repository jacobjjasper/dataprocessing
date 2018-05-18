/**
* This script loads a API's from a dataset and converts its data (GDP per capita
* index, labour utilization and unemploymentrate) into a scatterplot. Besides that,
* it will create a linked visualisation from the scatterplot to a grouped barchart
* to represent the employmentrate, the personal earnings and the long term unemploymentrate
* of a clicked country.
*....
*
* Dataprocessing: D3 Linked visualisations
*
* Jacob Jasper (10650385)
*/

window.onload = function() {

  //load API
  var gdp_unemployment_labour_2015 = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
  var gdp_unemployment_labour_2016 = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.RGDP_INDEX+UNEMPRATE+LAB_UR6.A/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"
  var jobs_2015 = "https://stats.oecd.org/SDMX-JSON/data/BLI2015/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.JE_EMPL+JE_LTUR+JE_PEARN.L.TOT+MN+WMN/all?&dimensionAtObservation=allDimensions"
  var jobs_2016 = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.JE_EMPL+JE_LTUR+JE_PEARN.L.TOT+MN+WMN/all?&dimensionAtObservation=allDimensions"


  d3.queue()
  .defer(d3.request, gdp_unemployment_labour_2015)
  .defer(d3.request, gdp_unemployment_labour_2016)
  .defer(d3.request, jobs_2015)
  .defer(d3.request, jobs_2016)
  .awaitAll(page_transition);

function page_transition(error, response) {
  if (error) throw error;

  //store parsed API in JSON in variable
  var data__gdp_2015 = JSON.parse(response[0].responseText);
  var data_gdp_2016 = JSON.parse(response[1].responseText);
  var data_jobs_2015 = JSON.parse(response[2].responseText);
  var data_jobs_2016 = JSON.parse(response[3].responseText);

  //make sure there is a visualisation at start
  d3.select("body").transition(make_scatter(data__gdp_2015, data_jobs_2015))

  //update graph between 2015 and 2016
  d3.select("#data_2015").on("click", function() {
    d3.selectAll("svg").remove();
    d3.select("body").transition(make_scatter(data__gdp_2015, data_jobs_2015))
    });
  d3.select("#data_2016").on("click", function() {
    d3.selectAll("svg").remove();
    d3.select("body").transition(make_scatter(data_gdp_2016, data_jobs_2016))
    });

  };
};

function convert_into_json(dataset1, dataset2) {

  //make arrays to store data and names
  var labour_underutilisation_rate = [];
  var unemployment_rate = [];
  var gdp_per_capita_index = [];
  var countrys_gdp = [];
  var countrys_jobs = [];
  var employmentrate = [];
  var employmentrate_men = [];
  var employmentrate_women = [];
  var lt_unem = [];
  var lt_unem_men = [];
  var lt_unem_women = [];
  var per_earnings = [];
  var per_earnings_men = [];
  var per_earnings_women = [];

  var json_gdp = [];
  var json_jobs = [];
  var json_final = [];


    //iterate in the data
  for (let i =0; i < 24; i ++) {
    for (let j = 0; j < 3; j++) {
      for (let a = 0; a < 3; a++) {

        var iets = i + ":" + j + ":0:" + a;

        //store the three variables from unemployment rate
        if (dataset2.dataSets[0].observations[iets] && j === 0 && a === 0) {
          employmentrate.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 0 && a === 1) {
          employmentrate_men.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 0 && a === 2) {
          employmentrate_women.push(dataset2.dataSets[0].observations[iets][0]);
          }

        //store the three variables from longtime inemployed
        if (dataset2.dataSets[0].observations[iets] && j === 1 && a === 0) {
          lt_unem.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 1 && a === 1) {
          lt_unem_men.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 1 && a === 2) {
          lt_unem_women.push(dataset2.dataSets[0].observations[iets][0]);
          }

        //store the three variables from personal earnings
        if (dataset2.dataSets[0].observations[iets] && j === 2 && a === 0) {
          per_earnings.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 2 && a === 1) {
          per_earnings_men.push(dataset2.dataSets[0].observations[iets][0]);
          }
        if (dataset2.dataSets[0].observations[iets] && j === 2 && a === 2) {
          per_earnings_women.push(dataset2.dataSets[0].observations[iets][0]);
          }

      }

      //make variable to index observations
      var iets = i + ":" + j + ":0:0";

      //store the three 2015 variables in separated arrays
      if (dataset1.dataSets[0].observations[iets] && j === 0) {
        labour_underutilisation_rate.push(dataset1.dataSets[0].observations[iets][0]);
        }
      if (dataset1.dataSets[0].observations[iets] && j === 1) {
        gdp_per_capita_index.push(dataset1.dataSets[0].observations[iets][0]);
        }
      if (dataset1.dataSets[0].observations[iets] && j === 2) {
        unemployment_rate.push(dataset1.dataSets[0].observations[iets][0]);
        }

      }
      //store countrys in array
      countrys_gdp.push(dataset1.structure.dimensions.observation[0].values[i].name);
      countrys_jobs.push(dataset2.structure.dimensions.observation[0].values[i].name);

      //make array of objects for GDP
      var my_obj_gdp = {"country": countrys_gdp[i], "gdp": gdp_per_capita_index[i],
                "labour uti": labour_underutilisation_rate[i], "unemployment":
                unemployment_rate[i]};
      json_gdp.push(my_obj_gdp);

      //make array of objects for Jobs
      var my_obj_jobs = {"country": countrys_jobs[i], "employment": employmentrate[i],
      "employment men": employmentrate_men[i], "employment women":
      employmentrate_women[i], "longterm unemployment": lt_unem[i],
      "longterm unemployment men": lt_unem_men[i],
      "longterm unemployment women": lt_unem_women[i],
      "personal earnings": per_earnings[i], "personal earnings men":
      per_earnings_men[i], "personal earnings women": per_earnings_women[i]};
    json_jobs.push(my_obj_jobs);
  }

  //Fuse both arrays of objects to one array of dicts
  for (let i =0; i < 24; i ++) {
    for (let j = 0; j < 24; j++) {
      if (json_gdp[i]["country"] === json_jobs[j]["country"]) {
        var final_obj = Object.assign(json_gdp[i], json_jobs[j]);
        json_final.push(final_obj);
      }
    }
  }
  var employmentrate = [];
  var employmentrate_men = [];
  var employmentrate_women = [];
  var lt_unem = [];
  var lt_unem_men = [];
  var lt_unem_women = [];
  var per_earnings = [];
  var per_earnings_men = [];
  var per_earnings_women = [];

  var per_earnings_adjusted = [];

  for (var i = 0; i < 24; i++) {
    (per_earnings[i]/10000)
  }

  //make scale values for scatterplot
  var scale_values = {"labour_max": Math.max(...labour_underutilisation_rate),
  "labour_min": 0, "unemployment_max":
  Math.max(...unemployment_rate), "unemployment_min": 0,
  "gdp_max": Math.max(...gdp_per_capita_index), "gdp_min":
  Math.min(...gdp_per_capita_index)}
  return [json_final, scale_values];
};

function make_scatter(dataset1, dataset2) {

  //get converted data and store in variable
  var values = convert_into_json(dataset1, dataset2);
  var complete_json = values[0];
  var scale_values = values[1];


  //width and height
  var w = 600;
  var h = 600;
  var margin = { top: 100, right: 250, bottom: 100, left: 400};

  //create SVG element
  var svg = d3.select("#visualisations")
            .append("svg")
            .attr("class", "scatter")
            .attr("width", (w + margin.left + margin.right))
            .attr("height", (h + margin.top + margin.bottom))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // creating tip box to show data
  var tool_tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-20, 0])
              .html(function(d) {
                console.log(d);
                return  "<strong>Country:</strong> <strong>" + d["country"]
            + "</strong>" + "<br>" + "GDP per capita index: " + d["gdp"] + "<br>" +
        "Labour underutilization rate (%): " + d["labour uti"] + "<br>" + "Unemployment rate (%):"
        + d["unemployment"]})
              .style("background-color", "white");

  //call tip box
  svg.call(tool_tip);

  //creating scale for 2015
  var x_scale = d3.scaleLinear()
                  .domain([scale_values["unemployment_min"], scale_values["unemployment_max"]])
                  .range([0, w]);

  var y_scale = d3.scaleLinear()
                  .domain([scale_values["labour_min"], scale_values["labour_max"]])
                  .range([h, 0]);

  var r_scale = d3.scaleLinear()
                  .domain([scale_values["gdp_min"], scale_values["gdp_max"]])
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
               .data(complete_json)
               .enter();

    //make scatterplot datapoints
     dot.append("circle")
     .attr("class", "dot")


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
      .on("mouseover", tool_tip.show)
      .on("mouseout", tool_tip.hide)
      .on("click", function(d) {
        d3.selectAll(".bar_svg")
          .remove();
        return make_bar(d);
      });

    //append title to scatterplot
    svg.append("text")
      .attr("class", "scatter_title")
      .attr("x", -400)
      .attr("y", -50)
      .text("Scatterplot of the unemployment rate, labour \
      underutilization rate and GDP per capita index (2007 = 100) of the \
      years 2015 and 2016 of European countries ")
      .style("text-anchor", "start")
      .style("text-decoration", "underline")
      .style("font-weight", "bold");

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
                  .attr("transform", function(d, i) { return "translate(0," + (60 + i * 20) + ")"; })

  //append title to legend
  svg.append("text")
    .attr("class", "legend_title")
    .attr("x", -300)
    .attr("y", 50)
    .text("GDP per capita index (2007 = 100)")
    .style("text-anchor", "start")
    .style("font-weight", "bold");

  //append description of the visualisation of legend
  legend.append("text")
        .attr("class", "legend_text")
        .attr("x", -240)
        .attr("y", 15)
        .text(function(d){
          return d["name"]
        })
        .style("text-anchor", "start");

  //append color bars legend
  legend.append("rect")
        .attr("class", "legend_bars")
        .attr("x", -300)
        .attr("width", 60)
        .attr("height", 18)
        .style("fill", function(d){
          return d["color"]
        });
};

function make_bar(object) {

  //adjust object to use for the group bar graph
  var bar_object =  [{"name": "total", "employmentrate":
      (object["employment"]/10), "lt unemployment": object["longterm unemployment"],
      "personal earnings": (object["personal earnings"]/10000)}, {"name": "men", "employmentrate":
          (object["employment men"]/10), "lt unemployment": object["longterm unemployment men"],
          "personal earnings": (object["personal earnings men"]/10000)}, {"name": "women",
          "employmentrate": (object["employment women"]/10), "lt unemployment":
          object["longterm unemployment women"], "personal earnings":
          (object["personal earnings women"]/10000)}];

  //width and height
  var w = 600;
  var h = 600;
  var margin = { top: 100, right: 250, bottom: 100, left: 400};

  //create SVG element
  var svg1 = d3.select("#visualisations")
            .append("svg")
            .attr("class", "bar_svg")
            .attr("width", (w + margin.left + margin.right))
            .attr("height", (h + margin.top + margin.bottom))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //append grouped barchart title
  svg1.append("text")
    .attr("class", "bar_title")
    .attr("x", -400)
    .attr("y", -50)
    .text("Grouped bar graph of the employmentrate (red), \
    the personal earnings (blue) and the long term unemploymentrate (green) \
    of " + object["country"])
    .style("text-anchor", "start")
    .style("text-decoration", "underline")
    .style("font-weight", "bold");

  //make scale values grouped barchart
  var scale_values = [bar_object[0]["employmentrate"], bar_object[1]["employmentrate"],
      bar_object[2]["employmentrate"], bar_object[0]["lt unemployment"],
      bar_object[1]["lt unemployment"], bar_object[2]["lt unemployment"],
      bar_object[0]["personal earnings"], bar_object[1]["personal earnings"],
      bar_object[2]["personal earnings"]];

  // var y_min = Math.min(...scale_values);
  var y_min = 0;
  var y_max = Math.max(...scale_values);

  //creating scale for 2015
  var x_scale = d3.scaleLinear()
                  .domain(bar_object)
                  .range([0, w+ 180]);

  var y_scale = d3.scaleLinear()
                  .domain([y_min, y_max])
                  .range([h, 0]);

  //creating variable for x axis
  var x_axis = d3.axisBottom()
                .scale(x_scale);


  //append x axis to canvas and class
  svg1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h) + ")")
    .call(x_axis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(40)")
    .style("text-anchor", "start");

    //append label for x axis
    svg1.append("text")
      .attr("class", "label")
      .attr("transform", "translate(0," + (h) + ")")
      .attr("x", w + 175)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Inequality");

  //creating variable for y axis
  var y_axis = d3.axisLeft()
                .scale(y_scale);


  //append y axis to canvas and class
  svg1.append("g")
    .attr("class", "y axis")
    .call(y_axis);

  //create grouped bar charts by means of iteration
  for (var i = 0; i < 3; i++) {

    // creating tip box to show data
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-20, 0])
                .html("<strong>Inequality:</strong> <strong>" + bar_object[i]["name"]
              + "</strong>" + "<br>" + "Employment rate (/10%): " + bar_object[i]["employmentrate"] + "<br>" +
          "Long term unemployment rate (%): " + bar_object[i]["lt unemployment"] + "<br>" +
          "Personal earnings (/10.000$):" + bar_object[i]["personal earnings"]);

    //call tip box
    svg1.call(tip);

      //make bars for each variable
      svg1.append("rect")
          .data(bar_object)
          .attr("class", "bar")
          .attr("x",(50+ (i * 250)))
          .attr("y", y_scale(bar_object[i]["employmentrate"]))
          .attr("width", 50) // determine bar width
          .attr("height", h - y_scale(bar_object[i]["employmentrate"]))
          .style("fill", "red")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);


      svg1.append("rect")
          .data(bar_object)
          .attr("class", "bar")
          .attr("x", (100 + (i * 250)))
          .attr("y", y_scale(bar_object[i]["personal earnings"]))
          .attr("width", 50) // determine bar width
          .attr("height", h - y_scale(bar_object[i]["personal earnings"]))
          .style("fill", "blue")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

      svg1.append("rect")
          .data(bar_object)
          .attr("class", "bar")
          .attr("x", (150 + (i * 250)))
          .attr("y", y_scale(bar_object[i]["lt unemployment"]))
          .attr("width", 50) // determine bar width
          .attr("height", h - y_scale(bar_object[i]["lt unemployment"]))
          .style("fill", "green")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

      //append description group x-axis
      svg1.append("text")
          .attr("x", (125 + (i * 250)))
          .attr("y", h + 25)
          .style("text-anchor", "middle")
          .style("font-size", 20)
          .text(bar_object[i]["name"]);
    };

    //make array for colors and names of bars of legend
    var colors = [{"name": "Employmentrate (/10%)", "color": "red"}, {"name": "Personal earnings (/10.000 $)", "color": "blue"},
    {"name": "Long time unemploymentrate (%)", "color": "green"}];

    //append legend bars
    var legend = svg1.selectAll("legend")
                    .data(colors)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + (60 + i * 20) + ")"; })

    //append legend title
    svg1.append("text")
      .attr("class", "legend_title")
      .attr("x", -400)
      .attr("y", 50)
      .text("Legend grouped bar graph")
      .style("text-anchor", "start")
      .style("font-weight", "bold");

    //append information representation each color
    legend.append("text")
          .attr("class", "legend_text")
          .attr("x", -340)
          .attr("y", 15)
          .text(function(d){
            return d["name"]
          })
          .style("text-anchor", "start");

    //append bar with each color variable
    legend.append("rect")
          .attr("class", "legend_bars")
          .attr("x", -400)
          .attr("width", 60)
          .attr("height", 18)
          .style("fill", function(d){
            return d["color"]
          });
  };
