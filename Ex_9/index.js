const width = 600;
const height = 600;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

const chart = d3.select('svg#chart')
d3.select('svg#chart').attr('width', width).attr('height', height)

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right
