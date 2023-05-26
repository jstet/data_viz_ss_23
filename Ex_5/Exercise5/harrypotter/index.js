/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided and stored as the graphs nodes and links.
 * Check out the console to see the data structure:
 */

const links = data.links
const nodes = data.nodes
console.log("Data Structure", data)

// constants
const width = 1200;
const height = 900;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

// aggregates the data according to the attribute value
// there is NOTHING to do for you here
function aggregateData(unaggregated, attribute) {
    var newData = {}
    //grouping of nodes
    newData.nodes = Array.from(d3.group(unaggregated.nodes, d => d[attribute])).map((d,i) => {
        return {
        name: d[0],
        [attribute]: d[0],
        id: i,
        count: d[1].length
        }
    })

    newData.links = []
    //for each node combination, create a link
    newData.nodes.forEach((n, i) => {
        newData.nodes.slice(i+1).forEach((n2,i2) => {
        newData.links.push({
            source: i,
            target: i+1+i2,
            value: unaggregated.links.filter(d => (
            (d.source[attribute] == n.name && d.target[attribute] == n2.name) || 
            (d.source[attribute] == n2.name && d.target[attribute] == n.name))).map(d => d.value).reduce((curr, acc) => curr+acc, 0)
        })
        })
    })
    
    return newData;
}
 
d3.select('svg#chart').attr('width', width).attr('height', height)
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr("id","viz")
var svg = d3.select('g#vis-g')

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right



// TASK 
//define an ordinal color scale and define a color for each value of the 'house' attribute of the data
var colorScale = d3.scaleOrdinal().domain([...new Set(nodes.map(d => d["house"]))])
.range(d3.schemeCategory10);



// TASK 
//attach an event handler on the checkbox, and call the updateGraph function
    //depending on the checkbox value, the data should be aggregated, or not
d3.select("#house_checkbox").on("input", function () { updateGraph(d3.select(this).property("checked")) })
 


    
 //this function handles the creation of the graph, depending on the passed 'graphData'
 function updateGraph(check) {
    
    d3.select('#viz').selectAll("#graph").remove();

    d3.select('#viz').append("g").attr("id", "graph");
    
    const graph = d3.select("#graph")
    
    console.log(graph)
    let countScale;
    let newData;
    if(check === true){ 
        newData = aggregateData(data,"house");
        const min = d3.min(newData.nodes, d => d["count"])
        const max = d3.max(newData.nodes, d => d["count"])

        countScale = d3.scaleLinear().domain([min, max]).range([3, 7]);
       
    }
    else{
        newData = data;
    }

    
   
    //TASK 
    //draw a line for each link
        //the color of the link should be green when  the value is greater than 0, red when below 0
        //if the value is below 0, add a dash-array to the stroke
   
    
    const link_data = newData.links;
    let node_data=newData.nodes
    node_data = node_data.filter(ar => link_data.find(rm => (rm.source === ar.id || rm.origin === ar.id) ))
   
    console.log(node_data)


    graph.selectAll('.link').data(link_data).enter().append("g").append('line').attr("class","link_line").attr('stroke', d => d.value > 0 ? 'green':'red').attr("stroke-dasharray",d => d.value < 0 ? '1 2 1':'1 1 1')
 
 
    //TASK 
    //create a group element for each node
    //implement the drag ( https://github.com/d3/d3-drag ) behaviour to make the graph interactive
        //add a circle 
            // if aggregated, the radius of the circle should scale according to the count
            // color the circle according to the colorScale
        //add a text label
    
    const drag = d3.drag().on('start',()=>{}).on('drag',() =>{}).on('end', ()=> {}) 
     
    graph.selectAll(".node")
    .data(node_data).enter()
    .append("g")
    .attr("class","node")
    .append("circle")
    .attr("class","node_circle")
    .attr("r", d => d.count ? countScale(d.count) : 5)
    .attr("fill", d => colorScale(d.house))

    d3.selectAll(".node").append("text").attr("class","node_text").text(d => d.name).attr("y",-10).attr("x",0).attr("font-size","0.7rem")


    // TASK
    // create a force Simulation ( https://github.com/d3/d3-force ) using the nodes and links
        //make sure the force is centered at the middle of your visualization 
        //and the nodes do not overlap 
 
    const simulation = d3.forceSimulation().force("center", d3.forceCenter(visWidth/2, visHeight/2))                  
    .force("charge", d3.forceManyBody().strength(-1))
    .force("link", d3.forceLink().id(d => d.id))


    simulation.nodes(node_data)
    simulation.force("link").links(link_data)

    simulation.on("tick",function(d){
        
        //position links
        d3.selectAll(".link_line")
          .attr("x1", d => d.source.x)
          .attr("x2", d => d.target.x)
          .attr("y1", d => d.source.y)
          .attr("y2", d => d.target.y)
       
        //position nodes
        d3.selectAll(".node_circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
        
          d3.selectAll(".node_text")
          .attr("x", d => d.x)
          .attr("y", d => d.y)
      })
      
      simulation.alpha(1).restart()
}
 
 
//initialize the graph with ungrouped data
updateGraph(false)
 
 
 
 