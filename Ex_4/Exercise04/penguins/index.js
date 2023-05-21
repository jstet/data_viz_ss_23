/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
  {
    "species": "Adelie",
    "island": "Torgersen",
    "culmen_length_mm": 39.1,
    "culmen_depth_mm": 18.7,
    "flipper_length_mm": 181,
    "body_mass_g": 3750,
    "sex": "MALE"
  } ....
 */

console.log("Initial Data", data)

// constants
const width = 600;
const height = 600;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height)
const viz = d3.select('g#vis-g')
viz.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right

//TASK: get all dimensions in the dataset
var allDimensions = Object.keys(data[0]);

console.log("Dimensions of the dataset: ", allDimensions)

//TASK: Data cleaning
// filter out any datapoints where a value is undefined
// 334 datapoints should remain
var cleanData = data.filter(d => !Object.values(d).some(val => val == undefined));

console.log("cleaned Data:", cleanData.map(d => d.sex))

//TASK: seperate numeric and ordinal dimensions
var numerics = ["culmen_length_mm", "culmen_depth_mm", "flipper_length_mm", "body_mass_g"];
var categoricals = ["species", "island", "sex"];
console.log("numerical dimensions", numerics)
console.log("categorical dimensions", categoricals)

const numericalData = data.map(obj => {
  const numericalObj = {};
  numerics.forEach(dim => { numericalObj[dim] = obj[dim]; }); return numericalObj;
});

const ordinalData = data.map(obj => {
  const ordinalObj = {};
  categoricals.forEach(dim => { ordinalObj[dim] = obj[dim]; }); return ordinalObj;
});


//append a circle for each datapoint
// for cx, cy, fill and r we set dummy values for now 
const points = d3.select('g#scatter-points').selectAll('circle').data(cleanData)
  .enter().append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 3)
  .attr('fill', 'black')

//add labels for x and y axis
var yLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label').text(' ')
var xLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
  .attr('transform', 'translate(' + visWidth + ', ' + visHeight + ')')
  .text(' ')


//TASK: add options to the select tags:
// for all <select>'s we have to add <options> for each data dimension
// the select for the x-axis, y-axis and size should only have numeric dimensions as options
// the select for the color should only have categorical dimensions as options
// add an event listener to the <select> tag
//    call the appropriate change function (xAxisChange(newDim), yAxisChange(newDim), colorChange(newDim) or sizeChange(newDim))
const xSelect = d3.select('#x-axis-select');
xSelect.on('change', function () { xAxisChange(d3.select(this).property("value")) })
xSelect.selectAll('option').data(numerics).enter().append('option').text(function (d) { return d; });

const ySelect = d3.select('#y-axis-select')
ySelect.on('change', function () { yAxisChange(d3.select(this).property("value")) })
ySelect.selectAll('option').data(numerics).enter().append('option').text(function (d) { return d; });

const sizeSelect = d3.select('#size-select')
sizeSelect.on('change', function () { sizeChange(d3.select(this).property("value")) })
sizeSelect.selectAll('option').data(numerics).enter().append('option').text(function (d) { return d; });

const colorSelect = d3.select('#color-select')
colorSelect.selectAll('option').data(categoricals).enter().append('option').text(function (d) { return d; });
colorSelect.on("change", function () { colorChange(d3.select(this).property("value")) })
// TASK: x axis update:
// Change the x Axis according to the passed dimension
// update the cx value of all circles  
// update the x Axis label 
function xAxisChange(newDim) {


  viz.select("#xAxis").remove();

  const min_x = d3.min(cleanData, d => d[newDim])
  const max_x = d3.max(cleanData, d => d[newDim])
  const xScale = d3.scaleLinear()
    .domain([min_x, max_x])
    .range([0, visWidth]).nice();

  points.attr("cx", (d) => xScale(d[newDim])).attr("r", 3)

  const xAxis = d3.axisBottom().scale(xScale);
  viz.append("g").call(xAxis).attr("transform", "translate(0," + visHeight + ")").attr("id", "xAxis");
  xLabel.text(newDim)


}

// TASK: y axis update:
// Change the y Axis according to the passed dimension
// update the cy value of all circles  
// update the y Axis label 
function yAxisChange(newDim) {
  viz.selectAll("#yAxis").remove();
  const min_y = d3.min(cleanData, d => d[newDim])
  const max_y = d3.max(cleanData, d => d[newDim])
  const yScale = d3.scaleLinear()
    .domain([min_y, max_y])
    .range([0, visWidth]);

  points.attr("cy", (d) => yScale(d[newDim]))

  const yAxis = d3.axisLeft().scale(yScale);
  viz.append("g").call(yAxis).attr("id", "yAxis")
  yLabel.text(newDim)


}

// TASK: size update:
// Change the size according to the passed dimension
//    if the dimension contains numbers, use ScaleLinear
//    if the dimension contains strings, use ScaleOrdinal 
// update the r value of all circles  
function sizeChange(newDim) {

  const min_size = d3.min(cleanData, d => d[newDim])
  const max_size = d3.max(cleanData, d => d[newDim])

  sizeScale = d3.scaleLinear()
    .domain([min_size, max_size])
    .range([3, 7]).nice();

  points.attr("r", (d) => sizeScale(d[newDim]))

}


// TASK: color update:
// Change the color (fill) according to the passed dimension
// update the fill value of all circles  
//
// add a <span> for each categorical value to the legend div 
// (see #color-select-legend in the html file)
// the value text should be colored according to the color scale 
function colorChange(newDim) {
  const legend = d3.select("#color-select-legend")
  legend.selectAll("span").remove();

  var colorScale = d3.scaleOrdinal().domain([...new Set(cleanData.map(d => d[newDim]))])
    .range(d3.schemeCategory10);

  console.log([...new Set(cleanData.map(d => d[newDim]))])

  legend.selectAll("span").data([...new Set(cleanData.map(d => d[newDim]))]).enter().append("span").style("color", function (d) { return colorScale(d) }).text(d => d);

  points.attr("fill", d => colorScale(d[newDim]))

}











//initialize the scales
xAxisChange('culmen_length_mm')
yAxisChange('culmen_depth_mm')
colorChange('species')
sizeChange('body_mass_g')