//Names: 
//  - Jonas Stettner
//  - Ana Sanchez Acosta 

// Task 1 b): Verify that D3 is loaded correctly by printing the version number to the console
console.log("D3 Version:", d3.version)

/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file which is added in the index.html file. 
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
        {
            "tas": 1.96318,
            "pr": 37.2661,
            "Year": 1991,
            "Month": 1,
            "Country": "DEU"
        }
        ....
 */

// console.log("Raw Data:", data);

/* TASK 1 c): Retrieve (select) the visualization container node of the div element declared within the index.html by its identifier. */

//d3.select("#vis-container")
//We comented this out beacuse it done later (line 50)

// Specify margins such that the visualization is clearly visible and no elements are invisible due to the svg border
let margins = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
};

// Specify the width and height of the svg as well as the width height of the viewport of the visualization.
let width = 800;
let height = 400;
let visWidth = width - margins.left - margins.right;
let visHeight = height - margins.top - margins.bottom;


/* TASK 1 d): Append an svg element to the vis-container, set its width and height (in pixels), add it to the vis-container, 
and save the element to variable called 'svg' */

let svg = d3.select("#vis-container").append("svg").attr("width",width).attr("height",height)
// Task 2 Data Preparation: For each year we want the average rain and temperature. We first need to process the raw data to get the desired format.

let dataByYears = d3.group(data, (d) => d.Year);
// Task 2 a) Describe what is happening in the code above? 
// Answer: It takes the data and groups it using the column (attribute) Year.

console.log(typeof(dataByYears))

let dataByYearsArray = Array.from(dataByYears);
// Task 2 b) Describe what is happening in the code above?
// Answer: Is turning the grouped data into an Array so it can be iterarted over.
console.log(dataByYearsArray)

let avgData = [];
dataByYearsArray.forEach(year => {

    avgData.push({
        year: year[0],
        rain: d3.mean(year[1], d => d.pr),
        temp: d3.mean(year[1], d => d.tas),
    })
})
// Task 2 c) Describe what is happening in the code above?
// Answer: First initialize avgData Array. Then go over the years and fill the avgArray object with the attributed year, rain and temp.
// year is the year of the group
// rain takes the group(year) average of the attribute pr
// temp takes the group(year) average of the attribute tas

console.log("Average Data per Year:", avgData);


/* TASK 3 a) : Append a group element to the svg to realize the margin by translating the group, and save the element to variable called 'viewport'. */
let viewport = svg.append("g")
                    .attr("transform","translate(" + margins.left + "," + margins.top +")")


// TASK 3 b): Initialize Scales using d3.linearScale function (see https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales)
// You can make use of the d3.extent and d3.max function to calculate the domains. (see https://github.com/d3/d3-array/blob/master/README.md#statistics)
// Create separate scales for the x axis (time scale), the temperature and the rainfall.
// x axis
const min_x = d3.min(avgData, d => d.year)
const max_x = d3.max(avgData, d => d.year)
var timeScale = d3.scaleLinear()
    .domain([min_x, max_x])
    .range([0, visWidth]);

console.log(min_x,max_x, visWidth)
// y axis temperature
const min_y_temp = d3.min(avgData, d => d.temp)
const max_y_temp = d3.max(avgData, d => d.temp)
var temperatureScale = d3.scaleLinear()
    .domain([max_y_temp, 0])
    .range([0, visHeight]);

// y axis rainfall
const min_y_rain = d3.min(avgData, d => d.rain)
const max_y_rain = d3.max(avgData, d => d.rain)
var rainfallScale = d3.scaleLinear()
    .domain([max_y_rain, 0])
    .range([0, visHeight]);

// In order to organize our code, we add another group which will hold all elements (circles and paths) of the visualization
let visualization = viewport.append("g");




// TASK 3 c): Append one blue circle for each rain data point. Make use of the previously initialized scales and anonymous functions.
let circles_rain = visualization.append("g").selectAll("circle")
    .data(avgData).enter().append("circle").attr("cx", (d) => timeScale(d.year))
    .attr("cy", (d) => rainfallScale(d.rain))
    .attr("r", 3).attr("fill", "blue");





// TASK 3 d): Append one red circle for each temperature data point. Make use of the previously initialized scales and anonymous functions.
let circles_temp = visualization.append("g").selectAll("circle")
    .data(avgData).enter().append("circle").attr("cx", (d) => timeScale(d.year))
    .attr("cy", (d) => temperatureScale(d.temp))
    .attr("r", 3).attr("fill", "red");



// TASK 3 e): Initialize a line generator for each line (rain and temperature) and define the generators x and y value.
// Save the line-generators to variable

let lineGenerator_rain = d3.line()
  .x((d) =>  timeScale(d.year))
  .y((d) => rainfallScale(d.rain))


let lineGenerator_temp = d3.line()
    .x((d) => timeScale(d.year))
    .y((d) => temperatureScale(d.temp))


// TASK 3 f): Append two path elements to the 'visualization' group. Set its 'd' attribute respectively using the linegenerators from above
// Do not forget to set the correct class attributes in order to have the stylesheet applied (.line-temp, .line-rain, .line)

visualization.append("g").append("path").attr("d", lineGenerator_rain(avgData)).attr("class","line line-rain");

visualization.append("g").append("path").attr("d", lineGenerator_temp(avgData)).attr("class","line line-temp");


// Task 4
// Lets add some axis (check https://github.com/d3/d3-axis for an example)
let axisG = viewport.append("g");
axisG.append('text').attr('class', 'axis-text').text('Temperature').attr('x', -50).attr('y', -3).style('fill','red');
axisG.append('text').attr('class', 'axis-text').text('Rain').attr('x', visWidth-15).attr('y', -3).style('fill','blue');
axisG.append('text').attr('class', 'axis-text').text('Year').attr('x', visWidth/2).attr('y', visHeight+margins.bottom);

// Add X Axis for years
axisG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(timeScale).tickFormat(d3.format("d"))); // Create an axis component with d3.axisBottom

// TASK 4 a): append a group for the axis of the temperature on the left side (d3.axisLeft)
axisG.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(temperatureScale)); 



// TASK 4 b): append a group for the axis of the rain on the right side (d3.axisRight)
axisG.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + visWidth  + ",0)")
    .call(d3.axisRight(rainfallScale)); 


