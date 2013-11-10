
// Set svg size and margin
var margin = {top: 20, right: 100, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// Initial variables for storing categories
var originalCategory = ["Comedians", "Directors", "Gurus", "Musicians", "Partners", "Reporters", "Sponsors"];
var selectedCategory = [1,1,1,1,1,1,1];
var categoryTotal = [];


// Initial variables for drawing svg
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(data.map(function(d, i) {
      return d.Country;
    }));

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]) //TODO: choose meaningful colors
    .domain(originalCategory);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));


// Start drawing
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


// Add category rect for each country
var country = svg.selectAll(".country")
    .data(data)
  .enter().append("g")
    .attr("class", "country")
    .attr("transform", function(d) { return "translate(" + x(d.Country) + ",0)"; });


// Add category rects
var y0 = 0;
data.forEach(function(d, i) {
  y0 = 0;
  d.ages = color.domain().map(function(name, k) { 
    return {
      name: name, 
      y0: y0, 
      y1: y0 += d.Category[k].NumOfTotalVideoViewCount,
    }; 
  });
  categoryTotal[i] = y0;

  d.ages.forEach(function(d) { 
    d.y0 /= categoryTotal[i]; 
    d.y1 /= categoryTotal[i]; 
  });
});

// data.sort(function(a, b) { return b.ages[0].y1 - a.ages[0].y1; });

var rect = country.selectAll("rect")
    .data(function(d) { return d.ages; })
  .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name); });


// Add legend
var legend = svg.select(".country:last-child").selectAll(".legend")
    .data(function(d) { return d.ages; })
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d) { return "translate(" + x.rangeBand() / 2 + "," + y((d.y0 + d.y1) / 2) + ")"; });

legend.append("line")
    .attr("x2", 10);

legend.append("text")
    .attr("x", 13)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });



// Add button event listener

$("#bkj0").click(function(){
  selectedCategory = [1,1,1,1,1,1,1];
  filterChanged();
});

$("#bkj2").click(function(){
  selectedCategory = [1,0,1,1,1,1,1];
  filterChanged();
});

$("#bkj5").click(function(){
  selectedCategory = [1,1,1,1,0,1,1];
  filterChanged();
});


// When filtering the category, redraw the rects and add transition

function filterChanged() {

  data.forEach(function(d, i) {
    y0 = 0;
    d.ages = color.domain().map(function(name, k) { 
      
      if (selectedCategory[k]==1) {
        return {
          name: name, 
          y0: y0, 
          y1: y0 += +d.Category[k].NumOfTotalVideoViewCount,
        }; 
      }
      else {
        return {
          name: name, 
          y0: y0, 
          y1: y0
        }
      }
    });

    d.ages.forEach(function(d) { 
      d.y0 /= categoryTotal[i]; 
      d.y1 /= categoryTotal[i]; 
    });
  });


  // data.sort(function(a, b) { return b.ages[0].y1 - a.ages[0].y1; });

  rect.data(function(d) { return d.ages; })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name); });

  rect.transition()
    .duration(400)
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); });
    // .style("fill", function(d) { return color(d.name); });

  // rect.exit().remove();
}

