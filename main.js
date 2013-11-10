
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
var svg = d3.select("#chart").append("svg")
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
  d.categories = color.domain().map(function(name, k) { 
    return {
      name: name, 
      y0: y0, 
      y1: y0 += d.Category[k].NumOfTotalVideoViewCount,
    }; 
  });
  categoryTotal[i] = y0;

  d.categories.forEach(function(d) { 
    d.y0 /= categoryTotal[i]; 
    d.y1 /= categoryTotal[i]; 
  });
});

var rect = country.selectAll("rect")
    .data(function(d) { return d.categories; })
  .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name); });


// Add legend
var legendGroup = svg.append("g")
  .attr("transform", "translate(840,0)")
  .attr("width", 50);

var legend = legendGroup.selectAll(".legend")
  .data(originalCategory)
  .enter().append("rect")
  .attr({
    "class": "legend",
    "x": 0,
    "y": function(d,i) {
      return 50 + i*30;
    },
    "width": 20,
    "height": 20,
    "rx": 2,
    "ry": 2,
    "fill": function(d,i) {
      return color(d);
    }
  });

legendGroup.selectAll("text")
  .data(originalCategory)
  .enter().append("text")
  .attr({
    "x": 25,
    "y": function(d,i) {
      return 65 + i*30;
    }
  })
  .text(function(d) { return d; });



// Add button event listener

// for (var c=0; c<originalCategory.length; c++) {
//   // console.log($("li#"+originalCategory[c]));
//   var cc = $("li#"+originalCategory[c]);
//   console.log(cc);
//   cc.click(function(){
//     selectedCategory[c] = selectedCategory[c]==1 ? 0 : 1;
//     filterChanged();
//   });
// }


$("li#Comedians").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[0] = selectedCategory[0]==1 ? 0 : 1;
  filterChanged();
});
$("li#Directors").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[1] = selectedCategory[1]==1 ? 0 : 1;
  filterChanged();
});
$("li#Gurus").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[2] = selectedCategory[2]==1 ? 0 : 1;
  filterChanged();
});
$("li#Musicians").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[3] = selectedCategory[3]==1 ? 0 : 1;
  filterChanged();
});
$("li#Partners").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[4] = selectedCategory[4]==1 ? 0 : 1;
  filterChanged();
});
$("li#Reporters").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[5] = selectedCategory[5]==1 ? 0 : 1;
  filterChanged();
});
$("li#Sponsors").click(function(){
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected").addClass("unselected");
  }
  else {
    $(this).removeClass("unselected").addClass("selected");
  }
  selectedCategory[6] = selectedCategory[6]==1 ? 0 : 1;
  filterChanged();
});


// When filtering the category, redraw the rects and add transition

function filterChanged() {

  data.forEach(function(d, i) {
    y0 = 0;
    d.categories = color.domain().map(function(name, k) { 
      
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

    d.categories.forEach(function(d) { 
      d.y0 /= categoryTotal[i]; 
      d.y1 /= categoryTotal[i]; 
    });
  });

  rect.data(function(d) { return d.categories; })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name); });

  rect.transition()
    .duration(400)
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); });
}

