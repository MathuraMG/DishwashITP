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
        right: 0.1*screen.width,
        bottom: 20,
        left: 0.1*screen.width
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0,24]),
      yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,500]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(2)
        .tickSubdivide(true),
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

    for(var i=0;i<noOfGraphs;i++){
      var totalEnergy = 0;
      //console.log(allLineData[i].value);

      totalEnergy = allLineData[i].totalEnergy;
      //console.log('total energy is of -- ' + allLineData[i].name + ' is -- ' + totalEnergy );

      if(totalEnergy < -0.0001 ){

      }
      else if(allLineData[i].name.localeCompare("x") == 0){
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
        var color = d3.hsl(i*15, 0.5,0.5);
        var classNamePath = className + ' graphPath';

        if(lineStyle == 0)
        {
          vis.append('svg:path')
          .attr('d', lineFunc(allLineData[i].value))
          .attr('stroke', color)
          .attr('stroke-width', 1)
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
    		.attr('transform', 'translate(' + (910) + ',' + (500-allLineData[i].value[22].y)+ ')')
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
