const width = 800;
const height = 500;
const margins = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};
const visWidth = width - margins.left - margins.right;
const visHeight = height - margins.top - margins.bottom;

const svg = d3.select('#viz')
    .append("svg")
    .attr('width', width)
    .attr('height', height)
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

// Format date
const formattedData = data.map(item => {
    const jsDate = new Date(item.date);
    return { ...item, date: jsDate };
});

// Group data by date
const groupedData = Array.from(d3.group(formattedData, d => d.date), ([date, values]) => {
    const obj = { date };
    values.forEach(d => {
        obj[d.Name] = d.close;
    });
    return obj;
});

console.log(groupedData);

const names = Object.keys(groupedData[0]).slice(1)
console.log(names)

// const stack = d3.stack().keys(Object.keys(groupedData[0]).slice(1));
// const stackedData = stack(groupedData);

const xScale = d3.scaleTime()
    .domain(d3.extent(formattedData, function (d) { return d.date; }))
    .range([0, visWidth]);

svg.append("g")
    .attr("transform", `translate(0, ${visHeight})`)
    .call(d3.axisBottom(xScale));

const yMax = d3.max(data, d => d.close);
const yMin = d3.min(data, d => d.close);

const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([visHeight, 0]);

svg.append("g")
    .call(d3.axisLeft(yScale));

const color = d3.scaleOrdinal()
    .domain(Object.keys(groupedData[0]).slice(1))
    .range(d3.schemeCategory10);

const paths = svg.append("g")

const groups = paths.selectAll("g")
    .data(groupedData)
    .enter()
    .append("g")

groups.each(function (d, i) {
    const g = d3.select(this)

    const sortedKeys = Object.keys(d)
        .filter(key => key !== 'date')
        .sort((a, b) => d[a] - d[b]).reverse();

    const sortedArray = sortedKeys.map(key => ({ key, value: d[key] }));

    sortedArray.forEach((stock, j) => {
        const nextG = groups._groups[0][i + 1]
        if (nextG) {
            const nextValue = nextG.__data__[stock.key];
            const nextDate = nextG.__data__["date"];
            g.append("path")
                .attr("fill", color(stock.key))
                .attr("d", `M ${xScale(d.date)} ${visHeight} L ${xScale(d.date)} ${yScale(stock.value)} L ${xScale(nextDate)} ${yScale(nextValue)} L ${xScale(nextDate)} ${visHeight}`
                ).attr("style", "shape-rendering: crispEdges");
        }
    })


})


// gElements.each(function (dayData, i) {
//     const stocks = Object.keys(dayData).slice(1); // Exclude 'date' key
//     stocks.forEach((stock, j) => {
//         const nextStock = stocks[j + 1];
//         if (nextStock) {
//             const higherStock = dayData[stock] > dayData[nextStock] ? stock : nextStock;
//             const smallerStock = dayData[stock] > dayData[nextStock] ? nextStock : stock;
// 
//             // Plot the higher value first
//             d3.select(this)
//                 .append("path")
//                 .datum([dayData[higherStock], dayData[smallerStock]])
//                 .attr("fill", "none")
//                 .attr("stroke", "black")
//                 .attr("d", d3.line()
//                     .x((d, i) => xScale(i))
//                     .y((d, i) => yScale(d))
//                 );
//         }
//     });
// });

