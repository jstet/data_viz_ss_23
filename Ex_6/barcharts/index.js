console.log("D3 Version:", d3.version)

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



// Stacked
let svg_st = d3.select("#vis-container-stacked").append("svg").attr("width", width).attr("height", height)
let viewport_st = svg_st.append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")").attr("id", "viewport_st")
// Grouped
let svg_gr = d3.select("#vis-container-grouped").append("svg").attr("width", width).attr("height", height)
let viewport_gr = svg_gr.append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")").attr("id", "viewport_gr")


// Stuff for both graphs
const subgroups = Object.keys(data[0]).filter(key => key !== "name")
var groups = data.map(obj => obj.name);
const xScale = d3.scaleBand().domain(groups).range([0, visWidth]).padding(0.2)

const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeCategory10)

const legendContainer = d3.selectAll(".legend");

const legend = legendContainer.selectAll(".legend-item")
    .data(subgroups)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("display", "inline-block");

legend.append("span")
    .text(d => d)
    .style("color", d => color(d));

// Stacked   ////////////////////
const min_y = d3.min(data, d => (d.clothing + d.equipment + d.accessories))
const max_y = d3.max(data, d => (d.clothing + d.equipment + d.accessories))
var yStacked = d3.scaleLinear()
    .domain([max_y, 0])
    .range([0, visHeight]);

viewport_st.append("g").attr("transform", "translate(0," + visHeight + ")").call(d3.axisBottom(xScale).tickSizeOuter(0)).append('text')
    .attr('x', visWidth / 2)
    .attr('y', 40)
    .style('font-weight', 'bold')
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text('Store');


viewport_st.append("g").call(d3.axisLeft(yStacked)).append('text')
    .attr('x', 0)
    .attr('y', -12)
    .style('font-weight', 'bold')
    .attr('fill', 'black')
    .attr('text-anchor', 'bottom')
    .text('Revenue');

const stackedData = d3.stack().keys(subgroups)(data)

const tooltip = d3.select("#vis-container-stacked").append("div").attr("id", "tooltip").style("visibility", "hidden").style("position", "absolute").style("z-index", "100").style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", "200px");

const mouseover = function (event, d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    d3.select('#tooltip').style("visibility", "visible").html(`Store: ${d.data.name}<br /> Departement:  ${subgroupName}<br /> Revenue: ${subgroupValue}`)
}


viewport_st.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) { return color(d.key); })
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d) { return xScale(d.data.name); })
    .attr("y", function (d) { return yStacked(d[1]); })
    .attr("height", function (d) { return yStacked(d[0]) - yStacked(d[1]); })
    .attr("width", xScale.bandwidth())
    .on("mouseover", mouseover)
    .on('mousemove', (event, d) => {
        d3.select('#tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px')
    })
    .on("mouseout", () => { tooltip.style("visibility", "hidden") });

//////////////////////

// Grouped  ////////////////////
viewport_gr.append("g").attr("transform", "translate(0," + visHeight + ")").call(d3.axisBottom(xScale).tickSizeOuter(0)).append('text')
    .attr('x', visWidth / 2)
    .attr('y', 40)
    .style('font-weight', 'bold')
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text('Store');

const min_y_gr = d3.min(data, d => (d3.min([d.clothing, d.equipment, d.accessories])))
const max_y_gr = d3.max(data, d => (d3.max([d.clothing, d.equipment, d.accessories])))
console.log(min_y_gr, max_y_gr)
var yGrouped = d3.scaleLinear()
.domain([max_y_gr, 0])
.range([0, visHeight]);


viewport_gr.append("g").call(d3.axisLeft(yGrouped)).append('text')
    .attr('x', 0)
    .attr('y', -12)
    .style('font-weight', 'bold')
    .attr('fill', 'black')
    .attr('text-anchor', 'bottom')
    .text('Revenue');

var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()])
    .padding([0.05])


    

viewport_gr.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) { return "translate(" + xScale(d.name) + ",0)"; })
    .selectAll("rect")
    .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key], store: d.name }; }); })
    .enter().append("rect")
    .attr("x", function (d) { return xSubgroup(d.key); })
    .attr("y", function (d) { return yGrouped(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function (d) { return visHeight - yGrouped(d.value); })
    .attr("fill", function (d) { return color(d.key); })
    .on("mouseover", function(event,d) {d3.select('#tooltip').style("visibility", "visible").html(`Store: ${d.store}<br /> Departement:  ${d.key}<br /> Revenue: ${d.value}`)})
    .on('mousemove', (event, d) => {
        d3.select('#tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px')
    })
    .on("mouseout", () => { tooltip.style("visibility", "hidden") });



////////////////////// 

