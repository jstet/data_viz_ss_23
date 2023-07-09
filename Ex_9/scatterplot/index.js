function calculatePearsonCorrelation(X, Y) {
    var meanX = d3.mean(X);
    var meanY = d3.mean(Y);
    var deviationsX = X.map(function (d) {
        return d - meanX;
    });

    var deviationsY = Y.map(function (d) {
        return d - meanY;
    });

    var sumProductDeviations = d3.sum(deviationsX.map(function (d, i) {
        return d * deviationsY[i];
    }));

    var sumSquaredDeviationsX = d3.sum(deviationsX.map(function (d) {
        return d * d;
    }));

    var sumSquaredDeviationsY = d3.sum(deviationsY.map(function (d) {
        return d * d;
    }));

    var r = sumProductDeviations / Math.sqrt(sumSquaredDeviationsX * sumSquaredDeviationsY);

    return r.toFixed(2);
}

function calculateSpearmanCorrelation(X, Y) {
    var rankX = d3.rank(X);
    var rankY = d3.rank(Y);

    var diffSquared = X.map(function (d, i) {
        return Math.pow(rankX[i] - rankY[i], 2);
    });

    var sumDiffSquared = d3.sum(diffSquared);

    var n = X.length;
    var spearmanRho = 1 - (6 * sumDiffSquared) / (n * (n * n - 1));

    return spearmanRho.toFixed(2);
}

function calculateCorrelation(X, Y, correlationType) {
    if (correlationType === 'pearson') {
        return calculatePearsonCorrelation(X, Y);
    } else if (correlationType === 'spearman') {
        return calculateSpearmanCorrelation(X, Y);
    }
}


// Dimension of the whole chart. Only one size since it has to be square
const marginWhole = { top: 10, right: 10, bottom: 10, left: 10 }
const innerMargin = 10
const sizeWhole = 800 - marginWhole.left - marginWhole.right


const rButton = d3.select("#rButton")
const spearButton = d3.select("#spearButton")

rButton.on('click', function () {
    drawGraph("pearson")
});

spearButton.on('click', function () {
    drawGraph("spearman")
});

function drawGraph(correlType) {
    let viz = d3.select('#viz')
    d3.selectAll("svg").remove()
    const svg = d3.select('#viz').append("svg").attr("width", sizeWhole + marginWhole.left + marginWhole.right)
        .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
        .append("g")
        .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

    d3.csv("https://raw.githubusercontent.com/jstet/data_viz_ss_23/main/Ex_9/data/data.csv")
        .then(function (data) {
            // Process the data here
            console.log(data)
            var tokeep = ['engine-size', 'horsepower', 'peak-rpm', 'city-mpg', 'highway-mpg', "price"];
            data = data.map(function (d) {
                var filteredObj = {};
                Object.entries(d).forEach(function ([key, value]) {
                    if (tokeep.includes(key)) {
                        filteredObj[key] = value;
                    }
                });
                return filteredObj;
            });
            console.log(data)
            const allVar = tokeep
            const numVar = allVar.length

            // Now I can compute the size of a single chart
            const size = sizeWhole / numVar
            const realSize = size - 2 * innerMargin
            // Create a scale: gives the position of each pair each variable
            const position = d3.scalePoint()
                .domain(allVar)
                .range([0, sizeWhole - size])

            for (i in allVar) {
                let rowIndex = allVar[i]
                for (j in allVar) {
                    // Get current variable name
                    let colIndex = allVar[j]
                    // DIAGONAL
                    if (i === j) {

                        // create X Scale
                        const extent = d3.extent(data, function (d) { return +d[rowIndex] })

                        const x = d3.scaleLinear()
                            .domain(extent).nice()
                            .range([0, realSize]);

                        // Add a 'g' at the right position
                        const tmp = svg
                            .append('g')
                            .attr("transform", `translate(${position(rowIndex) + innerMargin},${position(colIndex) + innerMargin})`);

                        // set the parameters for the histogram
                        const histogram = d3.histogram()
                            .value(function (d) { return +d[rowIndex]; })   // I need to give the vector of value
                            .domain(x.domain())  // then the domain of the graphic

                        // And apply this function to data to get the bins
                        const bins = histogram(data);

                        // Y axis: scale and draw:
                        const y = d3.scaleLinear()
                            .range([realSize, 0])
                            .domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

                        if (i == 0) {

                            tmp.append("text")
                                .attr("class", "y label")
                                .attr("text-anchor", "middle")
                                .attr("x",-realSize/2)
                                .attr("y", -marginWhole.left - innerMargin)
                                .attr("dy", ".75em")
                                .attr("transform", "rotate(-90)")
                                .text(rowIndex);

                            tmp.append("text")
                                .attr("class", "x label")
                                .attr("text-anchor", "middle")
                                .attr("x",realSize/2)
                                .attr("y", -marginWhole.left - innerMargin)
                                .attr("dy", ".75em")
                                .text(colIndex);
                        }

                        // append the bar rectangles to the svg element
                        tmp.append('g')
                            .attr("class", "cell")
                            .selectAll("rect")
                            .data(bins)
                            .join("rect")
                            .attr("x", 1)
                            .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
                            .attr("width", function (d) { return x(d.x1) - x(d.x0); })
                            .attr("height", function (d) { return (realSize) - y(d.length); })
                            .style("fill", "steelblue")
                            .attr("stroke", "white")
                    }
                    // LEFT BOTTOM
                    else if (i < j) {
                        // Add X Scale of each graph
                        const xextent = d3.extent(data, function (d) { return +d[rowIndex] })
                        const x = d3.scaleLinear()
                            .domain(xextent).nice()
                            .range([0, realSize]);

                        // Add Y Scale of each graph
                        const yextent = d3.extent(data, function (d) { return +d[colIndex] })
                        const y = d3.scaleLinear()
                            .domain(yextent).nice()
                            .range([realSize, 0]);
                       
                        // Add a 'g' at the right position
                        const tmp = svg
                            .append('g')
                            .attr("transform", `translate(${position(rowIndex) + innerMargin},${position(colIndex) + innerMargin})`)
                           ;

                        if (i == 0) {
                            tmp.append("text")
                                .attr("class", "y label")
                                .attr("text-anchor", "middle")
                                .attr("x",-realSize/2)
                                .attr("y", -marginWhole.left - innerMargin)
                                .attr("dy", ".75em")
                                .attr("transform", "rotate(-90)")
                                .text(colIndex);
                        }
                        
                        // Add circle
                                                    //Define fuctions 
                        let mouseover_funct= function(d) {

                        tmp.append("text")
                        .attr("class", "y-m-label")
                        .attr("text-anchor", "middle")
                        .attr("x",-realSize/2)
                        .attr("y", -marginWhole.left - innerMargin)
                        .attr("dy", ".75em")
                        .attr("transform", "rotate(-90)")
                        .text(colIndex)
                    
                        tmp.append("text")
                            .attr("class", "x-m-label")
                            .attr("text-anchor", "middle")
                            .attr("x",realSize/2)
                            .attr("y", realSize)
                            .attr("dy", ".75em")
                            .text(rowIndex)


                        }
                        let mouse_leave_funct= function(d) {
                            d3.selectAll(".x-m-label").remove()
                            d3.selectAll(".y-m-label").remove()
                            console.log("works")
                        }

                        tmp.append("g")
                        .attr("class", "cell")
                        //I thought this way one append the event litener to the parent class
                        .on("mouseover", mouseover_funct)
                        .on("mouseleave", mouse_leave_funct)
                        .selectAll("myCircles")
                        .data(data)
                        .join("circle")
                        //.attr("class", "scatterplot-circle")
                        .attr("cx", function (d) { return x(+d[rowIndex]); })
                        .attr("cy", function (d) { return y(+d[colIndex]); })
                        .attr("r", 3)
;
                       
                        

                    }
                    else {
                        // Add a 'g' at the right position
                        const tmp = svg
                            .append('g')
                            .attr('transform', `translate(${position(rowIndex) + innerMargin},${position(colIndex) + innerMargin})`);
                        // Calculate the correlation coefficient
                        const correlation = calculateCorrelation(
                            data.map(d => d[rowIndex]),
                            data.map(d => d[colIndex]),
                            correlType
                        );


                        if (j == 0) {
                            tmp.append("text")
                                .attr("class", "x label")
                                .attr("text-anchor", "middle")
                                .attr("x",realSize/2)
                                .attr("y", -marginWhole.left - innerMargin)
                                .attr("dy", ".75em")
                                .text(rowIndex);
                        }


                        tmp.append("g").attr("class", "cell").append('rect')
                            .attr('width', realSize)  // Set the desired width of the rectangle
                            .attr('height', realSize)  // Set the desired height of the rectangle
                            .style('fill', 'none')
                            

                        tmp
                            .append('text')
                            .attr('text-anchor', 'middle')
                            .attr('x', realSize / 2) // Position the text horizontally at the center of the rectangle
                            .attr('y', realSize / 2) // Position the text vertically at the center of the rectangle
                            .attr('dy', '0.35em') // Adjust the dy attribute to vertically center the text
                            .text(correlation);
                    }
                }
            }

        })
        .catch(function (error) {
            // Handle any errors that occur during loading/parsing
            console.log("Error occurred while loading/parsing the CSV file:");
            console.log(error);
        });

}
window.addEventListener("load", (event) => {
    drawGraph("pearson")
});