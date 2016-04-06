var result_graph;
var pastFlag = 0;
var pastFlagDisplay = 0;
$(document).ready(function(){
  // console.log("test1");
  $.ajax({
    url:"/login",
    success: function(result){
      // console.log('there should be nice data here. SHOULD');
      // console.log(result);
      drawGraph(result,0);
      drawPieCharts(result);
    }
  });
 $(".pastEnergyDataButton").click(function(){
    if(pastFlag == 0)
    {
      pastFlag = 1;
      $.ajax({
        url:"/pastDataAtITP",
        success: function(result) {
          drawGraph(result,1);
        }
      });
    }
    else
    {
      if(pastFlagDisplay == 0)
      {
          $('.pastGraphIndex').attr('style','display:none');
          pastFlagDisplay = 1;
      }
      else if(pastFlagDisplay == 1)
      {
          $('.pastGraphIndex').attr('style','display:block');
          pastFlagDisplay = 0;
      }

    }
  });
});

function drawGraph(allLineData,lineStyle)
{
  var vis = d3.select('#visualisation'),
      WIDTH = 0.8*screen.width,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 100,
        bottom: 20,
        left: 100
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0,24*7]),
      yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,2500]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(2)
        .ticks(7)
        //.tickValues(["3 Feb","4 Feb","5 Feb","6 Feb","7 Feb","8 Feb","9 Feb"]);
      y1Axis = d3.svg.axis()
        .scale(yRange)
        .tickSize(2)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(y1Axis);
var i =1;
var scale = ((0.8*screen.width-200)/168);
  //vis.append("rect").attr("x", scale*24*i).attr("y", 20).attr("width",  scale*10).attr("fill","#888888").attr("height", 460);

  for(var i=0;i<7;i++)
  {
    console.log('drawing rectangle no. -- ' + i);
    vis.append("rect").attr("x", scale*24*i + 100).attr("y", 20).attr("width",  scale*10).attr("fill","#888888").attr("height", 460).attr("opacity",0.5);
  }

  var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(d.x);
    })
    .y(function(d) {
      return yRange(d.y);
    })
    .interpolate('basis');

    var noOfGraphs = allLineData.length;
    //console.log('no of graphs -- ' + noOfGraphs);

    var allIndexDiv = document.getElementsByClassName('allIndexButtons')[0];
    var colorIndex =0;
    for(var i=0;i<noOfGraphs;i++){


      //console.log(allLineData[i].value);

      if(allLineData[i].name.localeCompare("x") == 0){
        console.log('garbegeish');
      }
      else if(allLineData[i].name.localeCompare("Outlet") == 0){
        console.log('garbegeish');
      }
      else if(allLineData[i].name.localeCompare("Laser Cutter") == 0){
        console.log('garbegeish');
      }
      else if(allLineData[i].name.localeCompare("Emergency Power Switch") == 0){
        console.log('garbegeish');
      }
      else
      {
        console.log('drawing graph for -- ' + allLineData[i].name );
        var className = 'class-'+allLineData[i].name;
        var color = d3.hsl(colorIndex*30, 0.5,0.5);
        colorIndex++;
        var classNamePath = className + ' graphPath';

        if(lineStyle == 0)
        {
          vis.append('svg:path')
          .attr('d', lineFunc(allLineData[i].value))
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('class',classNamePath);
        }
        else if(lineStyle == 1)
        {
          var classNamePastPath = classNamePath + ' pastGraphIndex';
          vis.append('svg:path')
          .attr('d', lineFunc(allLineData[i].value))
          .attr('stroke', color)
          .attr('stroke-width', 1)
          .attr('fill', 'none')
          .attr('stroke-dasharray','5,5')
          .attr('class',classNamePastPath);
        }

        var classNameText = className + ' graphText';
        vis.append('svg:text')
    		.attr('transform', 'translate(' + (910) + ',' + (2500-allLineData[i].value[22*7].y)+ ')')
    		.attr('dy', '0')
    		.attr('text-anchor', 'start')
    		.style('fill', color)
        .attr('class',classNameText)
    		.text(allLineData[i].name);

        if(lineStyle == 0)
        {
          indexContent(allLineData[i].name,className, allIndexDiv,color);
        }
      }
    }
}

function indexContent(text,className,allIndexDiv,color)
{
  console.log('drawing button for -- ' + text);

  var a = document.createElement('button');
  a.innerHTML = text;
  a.classList.add('indexElements');
  allIndexDiv.appendChild(a);
  a.onclick = function(){
    var line = document.getElementsByClassName(className);
    for(var i=0;i<line.length;i++){
      if(line[i].style.display.localeCompare('none') == 0)
      {
        line[i].style.display = 'block';
        a.style.background = '#ffffff';
      }
      else
      {
        line[i].style.display = 'none';
        a.style.background = '#aaaaaa';
      }
    }


  }
}
  
function drawPieCharts(energyData)
{
  var totalEnergyOffPeakData = [];
  var totalEnergyPeakData = [];

  var width = 0.3*screen.width;
  var height = 0.3*screen.width;
  var radius = 0.15*screen.width;


  /****************************************************************
  FOR PEAK ENERGY
  ****************************************************************/
  for(var i =0;i<energyData.length;i++)
  {
    if(energyData[i].name.localeCompare("x") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Outlet") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Laser Cutter") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Emergency Power Switch") == 0){
      console.log('garbegeish');
    }
    else
    {
    totalEnergyPeakData.push(
      {"label":energyData[i].name,
      "value":energyData[i].totalEnergyPeak});
    totalEnergyOffPeakData.push(
      {"label":energyData[i].name,
      "value":energyData[i].totalEnergyOffPeak});
    }
  }

    getPieChart(totalEnergyPeakData, width, height,radius,'#chartPeakData');
    getPieChart(totalEnergyOffPeakData, width, height,radius,'#chartOffPeakData');

}
function getPieChart(data,width,height,radius,id)
{
  var vis = d3.select(id).append("svg:svg").data([data]).attr("width", width).attr("height", height).append("svg:g").attr("transform", "translate(" +(radius ) + "," + radius + ")");
  var pie = d3.layout.pie().value(function(d){return d.value;});

  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(radius);

  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
  arcs.append("svg:path")
      .attr("fill", function(d, i){
        console.log('the color is -- ' + i)
          return d3.hsl(i*30, 0.5,0.5);
      })
      .attr("d", function (d) {
          // log the result of the arc generator to show how cool it is :)
          console.log(arc(d));
          return arc(d);
      });

  // add the text
  arcs.append("svg:text").attr("transform", function(d){
  			d.innerRadius = 0;
  			d.outerRadius = 100;
      return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
      return data[i].label;}
  		);

}

/******************

------------------
PIE CHART EXAMPLE
------------------

var w = 400;
var h = 400;
var r = h/2;
var color = d3.scale.category20c();

var data = [{"label":"Category A", "value":20},
		          {"label":"Category B", "value":20},
		          {"label":"Category C", "value":30}];


var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
var pie = d3.layout.pie().value(function(d){return d.value;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        console.log(arc(d));
        return arc(d);
    });

// add the text
arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
		);


******************/
