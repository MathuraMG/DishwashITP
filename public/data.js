var result_graph;
$(document).ready(function(){
  // console.log("test1");
  $.ajax({
    url:"/login",
    success: function(result){
      // console.log('there should be nice data here. SHOULD');
      // console.log(result);
      drawGraph(result);
    }
  });
 $(".coffeeButton").click(function(){
  //  console.log("test2");
    $.ajax({
      url:"/atITP",
      success: function(result) {
        //console.log("test3");
        drawGraph(result);
      }
    });
  });
});

function drawGraph(allLineData)
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

      if(totalEnergy < 0.0001 ){

      }
      else if(allLineData[i].name.localeCompare("x") == 0){
        console.log('garbegeish');
      }
      else
      {
        console.log('drawing graph for -- ' + allLineData[i].name );
        var className = 'class-'+allLineData[i].name;
        var color = d3.hsl(i*15, 0.5,0.5);
        var classNamePath = className + ' graphPath';
        vis.append('svg:path')
        .attr('d', lineFunc(allLineData[i].value))
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('class',classNamePath);

        var classNameText = className + ' graphText';
        vis.append('svg:text')
    		.attr('transform', 'translate(' + (910) + ',' + (500-allLineData[i].value[22].y)+ ')')
    		.attr('dy', '0')
    		.attr('text-anchor', 'start')
    		.style('fill', color)
        .attr('class',classNameText)
    		.text(allLineData[i].name);

        indexContent(allLineData[i].name,className, allIndexDiv);
      }
    }
}

function indexContent(text,className,allIndexDiv)
{
  console.log('drawing button for -- ' + text);
  var a = document.createElement('button');
  a.innerHTML = text;
  a.classList.add('indexElements');
  allIndexDiv.appendChild(a);
  a.onclick = function(){
    var line = document.getElementsByClassName(className)[0];
    var lineName = document.getElementsByClassName(className)[1];
    if(line.style.display.localeCompare('none') == 0)
    {
      line.style.display = 'block';
      lineName.style.display = 'block';
      a.style.background = '#ffffff';
    }
    else
    {
      line.style.display = 'none';
      lineName.style.display = 'none';
      a.style.background = '#aaaaaa';
    }

  }
}
