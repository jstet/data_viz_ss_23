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

//Call fuction based on bin slider value  
d3.select("#bins-slider").on("input", (e) => {
    const val = e.srcElement.valueAsNumber;
    d3.select("#bins-counter").text(e.srcElement.valueAsNumber);
    visualIlusion(val);
  });

//Create SVG 
let svg = d3.select("#vis-container").append("svg").attr("width", width).attr("height", height);

//Fuction for creating Visual Ilusion 
function visualIlusion(offsetMulti){

//Remove old chart 
svg.selectAll("g").remove();

//Append group for visualization and intialize constants
let viewport = svg.append("g")    
const Xsize=25;
const Ysize=15;
var offset=0;
const data=[]

//create the data for defining the squares location and color 
for (let y= 0; y<=visHeight; y += Ysize){
    for (let x= -2*Xsize; x<=width; x += Xsize) {
        if ((x/Xsize) % 2 ==0){
            data.push({'x':x-offset, 'y': y, 'color': 'white'}) 
        } else {
            data.push({'x':x-offset, 'y': y, 'color': 'black'})
        }  
    }
    offset = Math.sin(y+Ysize)*offsetMulti;
}

//Append the rectangles
viewport.selectAll('rect').data(data).enter()
    .append('rect')
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("height", Ysize)
    .attr("width", Xsize)
    .attr("fill",d=> d.color)
const ylines= [...new Set(data.map(d => d.y))];

//Append the lines between the squares 
viewport.selectAll('line').data(ylines).enter().append('line').style("stroke", "black").attr("x1", 0).attr("y1",d => d).attr("x2", width).attr("y2",d => d)
}

visualIlusion(0);
