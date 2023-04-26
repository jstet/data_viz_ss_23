// Task 1 b): Verify that D3 is loaded correctly by printing the version number to the console


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

console.log("Raw Data:", data);

/* TASK 1 c): Retrieve (select) the visualization container node of the div element declared within the index.html by its identifier. */

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


// Task 2 Data Preparation: For each year we want the average rain and temperature. We first need to process the raw data to get the desired format.

let dataByYears = d3.group(data, (d) => d.Year);
// Task 2 a) Describe what is happening in the code above? 
// Answer:

let dataByYearsArray = Array.from(dataByYears);
// Task 2 b) Describe what is happening in the code above?
// Answer:

let avgData = [];
dataByYearsArray.forEach(year => {

    avgData.push({
        year: year[0],
        rain: d3.mean(year[1], d => d.pr),
        temp: d3.mean(year[1], d => d.tas),
    })
})
// Task 2 c) Describe what is happening in the code above?
// Answer:

console.log("Average Data per Year:", avgData);


/* TASK 3 a) : Append a group element to the svg to realize the margin by translating the group, and save the element to variable called 'viewport'. */



// TASK 3 b): Initialize Scales using d3.linearScale function (see https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales)
// You can make use of the d3.extent and d3.max function to calculate the domains. (see https://github.com/d3/d3-array/blob/master/README.md#statistics)
// Create separate scales for the x axis (time scale), the temperature and the rainfall.



// In order to organize our code, we add another group which will hold all elements (circles and paths) of the visualization
let visualization = viewport.append("g");
let circles = visualization.selectAll("circle")
    .data(avgData).enter();

console.log("Entered Data:", circles);

// TASK 3 c): Append one blue circle for each rain data point. Make use of the previously initialized scales and anonymous functions.








// TASK 3 d): Append one red circle for each temperature data point. Make use of the previously initialized scales and anonymous functions.








// TASK 3 e): Initialize a line generator for each line (rain and temperature) and define the generators x and y value.
// Save the line-generators to variable




// TASK 3 f): Append two path elements to the 'visualization' group. Set its 'd' attribute respectively using the linegenerators from above
// Do not forget to set the correct class attributes in order to have the stylesheet applied (.line-temp, .line-rain, .line)




// Task 4
// Lets add some axis (check https://github.com/d3/d3-axis for an example)
let axisG = viewport.append("g");
axisG.append('text').attr('class', 'axis-text').text('Temp').attr('x', 0).attr('y', 0);
axisG.append('text').attr('class', 'axis-text').text('Rain').attr('x', visWidth).attr('y', 0);
axisG.append('text').attr('class', 'axis-text').text('Year').attr('x', visWidth/2).attr('y', visHeight+margins.bottom);

// Add X Axis for years
axisG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(timeScale)); // Create an axis component with d3.axisBottom

// TASK 4 a): append a group for the axis of the temperature on the left side (d3.axisLeft)




// TASK 4 b): append a group for the axis of the rain on the right side (d3.axisRight)



