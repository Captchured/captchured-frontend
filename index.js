// Global environmental data
var data = {};

// Counter to track the number of key presses
var counter = 0;
// Array to store the sequence of keys pressed by the user
var sequence = [];
// Array to store the time delay between consecutive key presses
var timeDelay = [];

// Variable to store the timestamp of the last key press
var lastPressedTime = Date.now();

document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;
    currTime = Date.now();

    counter++;
    sequence.push(keyName);
    // Calculate the time delay since the last key press and store it
    timeDelay.push(currTime - lastPressedTime);
    lastPressedTime = currTime;
  },
  false
);

// Runs when the body loads
function init() {
  console.log("Starting");
  console.log(lastPressedTime);
}

// Add all parameters to the global data object and log it
function submit() {
  timeDelay.shift();
  data["key_count"] = counter;
  data["key_sequence"] = sequence;
  data["time_delay"] = timeDelay;
  console.log(data);
}
