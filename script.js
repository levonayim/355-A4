//SETS BOUNDS for the chart (axis)
var margin = {top: 30, right: 50, bottom: 50, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// SET RANGES OF SCALE
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

//COLOUR RANGE
var color = d3.scale.category10();

// DEFINES AXIS DETAILS
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);


// ADD SVG TO BODY OF HTML TO DISPLAY
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// group that will contain all of the plots
    var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");


// IMPORTING DATA (CSV FILE)
d3.csv("data2.csv", function(error, data) {
    data.forEach(function(d) {
        d.income = +d.income;
        d.owner = +d.owner;
    });
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.income; }));
    y.domain([0, d3.max(data, function(d) { return d.owner; })]);


    // PRINT IN CONSOLE ALL THE DATA
    // sort data alphabetically
    data.sort(function(a, b) { return d3.ascending(a.cities, b.cities); })
    console.log(data) 

    // Add the scatterplot
    var circles =
    groups.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 8) // how big the circles will be
        .attr("cx", function(d) { return x(+d.income); })
        .attr("cy", function(d) { return y(+d.owner); })
        .attr("id", function(d) { return d.cities;})
    .style("fill", function(d) { return color(d.cities); })


//INTERACTIONS

    // Add the tooltip container to the vis container
              // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("#vis-container").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
    // mouse over functionality
    var mouseOn = function() { 
        var circle = d3.select(this);
        //increase size/opacity of bubble
        circle.transition()
        .duration(800).style("opacity", 1)
        .attr("r", 16).ease("elastic");

    };
    // mouse out functionality
    var mouseOff = function() {
        var circle = d3.select(this);

        // go back to original size and opacity
        circle.transition()
        .duration(800).style("opacity", 1)
        .attr("r", 8).ease("elastic");

        tooltip.transition()
        .duration(300) // ms
        .style("opacity", 0);

    };

    // run the mouseon/out functions
    circles.on("mouseover", mouseOn);
    circles.on("mouseout", mouseOff);



//CREATE AXIS
    // X-AXIS
    // appends 'g' element to the SVG. g is used to group SVG shapes together
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call((xAxis)   
            .ticks(20) // set details on their ticks on x-axis
            .tickSubdivide(true)
            .tickSize(10, 10, 0)
            .orient("bottom")) 

        .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -8) //how far away the small text should be from the axis line
            .style("text-anchor", "end")
            .text("Income");
    
    // Y-AXIS
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)") //rotate text to y-axis to read
            .attr("y", 16) //how far away the small text should be from the axis line
            .style("text-anchor", "end")
            .text("Shelter Cost");





});