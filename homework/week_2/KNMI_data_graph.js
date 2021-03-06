
/**
* This script loads a local .csv file of the weather of jan 1 1993 till
* jan 1 1994. The data is represented by a graph
*
* Dataprocessing: Line graph with Javascript
*
* Jacob Jasper (10650385)
*/


// Dit werkt niet dus heb ik het uitgecommend, wel geprobeerd maar hij geeft graphXcurrent
// error die ik niet snap

// var xhr = new XMLHttpRequest(),
//     method = "GET",
//     url = "https://github.com/jacobjjasper/dataprocessing/blob/master/homework/week_2/KNMI_19931231.txt";
//
// xhr.open(method, url, true);
// xhr.onreadystatechange = function () {
//   if(xhr.readyState === 4 && xhr.status === 200) {
//     drawGraph(xhr.responseText);
//   }
// };
// xhr.send();
//
// function drawGraph(xhr){
  let knmi = document.getElementById("rawdata").value;
  knmi = knmi.split("\n");
  let dates = [];
  let temps = [];
  for (var i = 1; i < knmi.length; i++){
    knmi[i] = knmi[i].split(",");
    dates[i] = knmi[i][0].trim(" ");
    dates[i] = [dates[i].slice(0, 4), "-", dates[i].slice(4)].join('');
    dates[i] = [dates[i].slice(0, 7), "-", dates[i].slice(7)].join('');
    dates[i] = new Date(dates[i]);
    temps[i] = Number(knmi[i][1]);
  }

  var canvas = document.getElementsByClassName("my_canvas");
  var ctx = my_canvas.getContext("2d");

  //text
  ctx.font = '48px serif';
  ctx.fillText('Average temperature in the Bilt in the year 1993', 100, 100);

  var tempsMin = 0;
  var tempsMax = 0;
  for (var i = 1; i < 366; i++){
    if (temps[i] > tempsMax){
      tempsMax = temps[i];
    }
    if (temps[i] < tempsMin){
      tempsMin = temps[i];
    }
  }

  //text x -and Y-axis
  ctx.font = '20px red';
  ctx.fillText('X-axis: Months of the year; Y-axis: Temperature in 0.1 degrees Celsius', 200, 750);

  //variables and array of names needed to add to the x-axis
  var plusX = 800/12;
  var currentX = 200 + plusX;
  let months = ['months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec']

  //x-axis
  ctx.beginPath();
  ctx.moveTo(200, 550);
  ctx.lineTo(1000, 550);
  ctx.stroke();

  //iterating for each month
  for (var i = 1; i < months.length; i++){
    ctx.beginPath();
    ctx.moveTo(currentX, 550);
    ctx.lineTo(currentX, 560);
    ctx.stroke();
    ctx.font = '10px red';
    ctx.fillText(months[i], currentX, 570);
    currentX += plusX;
  }

  //variables and array of values needed to add to the y-axis
  var plusY = 50;
  var currentY = 700;
  let tempsY = ['-150', '-100', '-50', '0', '50', '100', '150', '200',
                '250', '300', '350']
  //y-axis
  ctx.beginPath();
  ctx.moveTo(200, 700);
  ctx.lineTo(200, 200);
  ctx.stroke();

  //iterating for each value
  for (var i = 0; i < tempsY.length; i++){
    ctx.beginPath();
    ctx.moveTo(200, currentY);
    ctx.lineTo(190, currentY);
    ctx.stroke();
    ctx.font = '10px red';
    ctx.fillText(tempsY[i], 165, currentY);
    currentY -= 50;
  }

  //variables needed for drawing line
  var graphX = 200;
  var graphXcurrent = 200;
  var graphXplus = 800/365;
  var graphYcurrent = 550 - temps[1];

  //iterating for each day
  for (var i = 2; i < temps.length-1; i++){
    if (temps[i] === 0){
      graphY = 550;
    }
    else if (temps[i] === -150){
      graphY = 700;
    }
    else if (temps[i] === 350){
      graphY = 200;
    }
    else {
      graphY = 550 - temps[i];
    }

    //drawing line from day i-1 to day i
    ctx.beginPath();
    ctx.moveTo(graphXcurrent, graphYcurrent);
    ctx.lineTo(graphX, graphY);
    ctx.stroke();
    graphXcurrent = graphX;
    graphYcurrent = graphY;
    graphX = graphX + graphXplus;
  }
//}
