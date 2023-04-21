//TASK 4a
//let the console tell that the script is loaded

window.addEventListener("load", async (event) => {

  console.log("hi")

  const div = document.getElementById("eyedee");
  console.log(div)


// TASK 4b
// Select the polyline element on the page
const el = document.getElementById("pth");
// Define an array of colors to loop through
const arr = ["green","red", "blue", "black", "yellow"]
// Initialize a variable to keep track of the current color index
let current;
// Create a loop (for example a for loop) that iterates through the color array using the index 
for(var i = 0; i < arr.length; i++){
	current = arr[i]
  el.style.stroke = arr[i];
  console.log(current)
  await new Promise(resolve => setTimeout(resolve, 1000));
}
});

  // set the new color to the selected line
  // for ecah iteration enter 1 second delay to see the fox partying