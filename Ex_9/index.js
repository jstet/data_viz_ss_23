

const width = 600;
const height = 600;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

console.log("hz")

const chart = d3.select('svg#chart')

// Dimension of the whole chart. Only one size since it has to be square
const marginWhole = {top: 10, right: 10, bottom: 10, left: 10}
const sizeWhole = 640 - marginWhole.left - marginWhole.right

// Create the svg area
const svg = chart.attr("width", sizeWhole  + marginWhole.left + marginWhole.right)
    .attr("height", sizeWhole  + marginWhole.top + marginWhole.bottom)
  .append("g")
    .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

const csv = fs.readFileSync("./data/imports-95.data", "utf8");
const data =d3.csvParse(csv);
console.log(data);
