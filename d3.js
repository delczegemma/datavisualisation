// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.glob); })
    .curve(d3.curveBasis);

// define the 2nd line
var nhemline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.NHem); })
    .curve(d3.curveBasis);

// define the 3nd line
var shemline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.SHem); })
    .curve(d3.curveBasis);



// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select('#grapharea').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "axis")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("ZonAnn.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.year = +d.Year;
      d.glob = +d.Glob;
      d.NHem = +d.NHem;
      d.SHem = +d.SHem;
  });

  //Grouping the data
  var keys = d3.keys(data[0]).slice(1,4);

  var color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeSet1);

  console.log(color.domain);

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([
    d3.min(data, function(d) { 
      return Math.min(d.glob, d.NHem, d.SHem); }), 
    d3.max(data, function(d) { 
      return Math.max(d.glob, d.NHem, d.SHem); })
    ]);

  // Add the Glob valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style('stroke', function(d){ return color(keys[0])})
      .attr("d", valueline);

// Add the NHem path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style('stroke', function(d){ return color(keys[1])})
        .attr("d", nhemline);

// Add the SHem path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style('stroke', function(d){ return color(keys[2])})
        .attr("d", shemline);

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
          .ticks(8));

 // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width) + " ," + 
                           (height - 5) + ")")
      .style("text-anchor", "end")
      .text("Year (1880 - 2014)");     

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", 0)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Deviation from the Mean (Cº)");      

  //Create a legend
  var size = 20
  var legend = svg.selectAll(".legend")
    .data(keys)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

  legend.append("rect")
    .attr("x", width - size)
    .attr('y', height - margin.bottom * 3)
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)});

  legend.append("text")
    .attr("x", width - 24)
    .attr('y', height - margin.bottom * 3 + 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d){ return d})



});