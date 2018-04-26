d3.json("2016_happiness_westerneurope.json", function(data) {
  d3.select("head").append("title").text("Happiness score 1 till 10 country's Western Europe");
  d3.select("body").append("h1").text("Jacob Jasper, 10650385, Building your first visualization in D3.js");
  d3.select("body").append("p").text(" The World Happiness Report is a landmark survey of the state of global \
  happiness. The first report was published in 2012, the second in 2013, the third in 2015, and the fourth in \
  the 2016 Update. The World Happiness 2017, which ranks 155 countries by their happiness levels, was released \
  at the United Nations at an event celebrating International Day of Happiness on March 20th. The report continues \
  to gain global recognition as governments, organizations and civil society increasingly use happiness indicators \
  to inform their policy-making decisions. Leading experts across fields – economics, psychology, survey analysis, \
  national statistics, health, public policy and more – describe how measurements of well-being can be used effectively \
  to assess the progress of nations. The reports review the state of happiness in the world today and show how the new \
  science of happiness explains personal and national variations in happiness. The bargraph here shows the data of 2016.");
});
