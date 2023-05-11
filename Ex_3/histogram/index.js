/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
    { id: 1001, state: "Alabama", county: "Autauga County", rate: 5.1 },
        ....
 */

// constants
const width = 700;
const height = 500;
const margin = {
  left: 50,
  right: 20,
  bottom: 50,
};
const visWidth = width - margin.left - margin.right;
const visHeight = height - margin.bottom;


// We select the slider #bins-slider and add a input listener that adjusts
// the value of the <span> #bins-counter to the currently selected value and calls the method update()
// For more details, see https://github.com/d3/d3-selection#selection_on
d3.select("#bins-slider").on("input", (e) => {
  const val = e.srcElement.valueAsNumber;
  d3.select("#bins-counter").text(e.srcElement.valueAsNumber);
  update(val);
});

// TASK 2: Write a function 'update', that realizes the general update pattern of d3 to create a histogram of the data using the currently selected number of bins.
// The update function has one parameter 'numbins' that describes how many bins are currently selected in the #bins-slider <input> element.
// The update function should create a bar chart in the <svg> element with the id #chart
// Use the methods enter() to create new bars, exit() to remove no longer needed bars and merge() to update existing bars
function update(numbins) {

  // TASK 2.1, create an linear x scale given the extent of the data to the width of the svg. Be careful to consider the left and right margins.
  const min_x = d3.min(data, d => d.rate)
  const max_x = d3.max(data, d => d.rate)
  const xScale = d3.scaleLinear()
    .domain([min_x, max_x])
    .range([0, visWidth]).nice();


  // TASK 2.2: Bin the data using https://github.com/d3/d3-array/blob/main/README.md#bin (Examples: https://observablehq.com/@d3/d3-bin )
  // Make sure to specify the following attributes: domain and threshold, threshold is the approximate number of bins.
  // Afterwards bin the input data
  const bin_function = d3.bin().domain(xScale.domain()).thresholds(numbins).value(d => d.rate)
  const bins = bin_function(data);

  // Task 2.3 Create a linear y scale to given the number of elements in the bins [0, max(elements in bin)]
  const yScale = d3.scaleLinear().domain([0, d3.max(bins, function (d) { return d.length })]).range([visHeight, 0]);

  // TASK 2.4. Select the #chart <svg> element.
  const svg = d3.select("#chart")
  svg.selectAll("g").remove();

  const viz = svg.append("g").attr("transform", "translate(" + margin.left + ")")

  // TASK 2.5 Remove old rectangles that are no longer needed using either selection.remove() or exit()

  // TASK 2.6. Connect all <rect> children (using data and enter) of the svg with the bins (be careful to use the length of the bins, not the bin elements)
  const rects = viz.selectAll("rect").data(bins, function (d) { return d.length }).enter();

  // Task 3 Add a tooltip to the visualization
  // Hint:
  // 1. Add an empty <div> element with id "tooltip" to the body of the document and make it invisible
  const tooltip = d3.select("body").append("div").attr("id", "tooltip").style("visibility", "hidden").style("margin-top","200px");

  // 3.2. Add a mouseover event listener to the <rect> elements and make the <div> element visible and set the text of the <div> element to the data of the hovered <rect> element
  // Rember that the data is accessible via the second parameter of the event listener function
  // 3.3. On mousemove, set the text of the <div> element to the data of the hovered <rect> element
  // 3.4. On mouseout, hide the <div> element
  // 3.5. Position the <div> element using absolute positioning and the pageX and pageY properties of the mousemove event
  // Task 2.7 Append a rectangle for every newly added rect to the visualization, update their position (x, y, width, height)
  // Do not forget to add the tooltip event listeners to the new rectangles (see Task 3)
  //Define the bar width 

  rects.append("rect")
    .attr("x", function (d) { return xScale(d.x0); })
    .attr("transform", function (d) { return `translate(0, ${yScale(d.length)})`; })
    .attr("width", function (d) { return xScale(d.x1) - xScale(d.x0); })
    .attr("height", function (d) { return visHeight - yScale(d.length); })
    .on("mouseover", (event,d) => {tooltip.style("visibility", "visible").html(`Number of Counties: ${d.length}`) })
    .on("mousemove", (event,d) => {tooltip.style("visibility", "visible").html(`Number of Counties: ${d.length}`) })
    .on("mouseout", () => {tooltip.style("visibility", "hidden")});
  // ...

  // Task 2.8 add an x axis to the visualization
  // Hint: https://github.com/d3/d3-axis
  // Add X Axis for years
  // Add scales to axis
  var xAxis = d3.axisBottom().scale(xScale);

  viz.append("g").call(xAxis).attr("transform", "translate(0," + visHeight + ")")

  // Task 2.9 add a y axis to the visualization
  var yAxis = d3.axisLeft().scale(yScale);

  viz.append("g").call(yAxis)
  console.log(data)
}

// call update function with initial value to create visualization on first site visit
update(20);
