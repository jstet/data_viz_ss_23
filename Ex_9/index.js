const width = 600;
const height = 600;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

const chart = d3.select('svg#chart')

// Dimension of the whole chart. Only one size since it has to be square
const marginWhole = { top: 10, right: 10, bottom: 10, left: 10 }
const sizeWhole = 640 - marginWhole.left - marginWhole.right

// Create the svg area
const svg = chart.attr("width", sizeWhole + marginWhole.left + marginWhole.right)
    .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
    .append("g")
    .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);


d3.csv("https://raw.githubusercontent.com/jstet/data_viz_ss_23/main/Ex_9/data/imports-85.data")
    .then(function (data) {
        // Process the data here
        console.log(data); // Print the parsed CSV data to the console
    })
    .catch(function (error) {
        // Handle any errors that occur during loading/parsing
        console.log("Error occurred while loading/parsing the CSV file:");
        console.log(error);
    });
