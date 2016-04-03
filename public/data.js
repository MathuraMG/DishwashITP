var result_graph;
$(document).ready(function(){
  console.log("test1");
  $.ajax({
    url:"/login",
    success: function(result){
      console.log("test3");
    }
  });
 $(".coffeeButton").click(function(){
   console.log("test2");
    $.ajax({
      url:"/atITP",
      success: function(result) {
        console.log("test3");
        drawGraph(result);
      }
    });
  });
});

function drawGraph(allLineData)
{
  lineData = allLineData[0];
  lineData1 = allLineData[1];
  console.log(lineData.length);

  var vis = d3.select('#visualisation'),
      WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
        return d.x;
      }), d3.max(lineData, function(d) {
        return d.x;
      })]),
      yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
        return d.y1;
      }), d3.max(lineData, function(d) {
        return d.y1;
      })]),
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
      return yRange(d.y1);
    })
    .interpolate('basis');

    vis.append('svg:path')
  .attr('d', lineFunc(lineData))
  .attr('stroke', '#888888')
  .attr('stroke-width', 1)
  .attr('fill', '#eeeeee');

  vis.append('svg:path')
  .attr('d', lineFunc(lineData1))
  .attr('stroke', 'red')
  .attr('stroke-width', 1)
  .attr('fill', 'none');
}
