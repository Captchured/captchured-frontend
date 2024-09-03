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

// Arrays to store mouse movements and clicks
var mouseMovements = [];
var mouseClicks = [];
var lastMouseMoveTime = Date.now();
let startTime;
let timeSpent=0;

// Function to capture keypress events
document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    const currTime = Date.now();

    counter++;
    sequence.push(keyName);
    // Calculate the time delay since the last key press and store it
    timeDelay.push(currTime - lastPressedTime);
    lastPressedTime = currTime;
}, false);

// Function to capture mouse movements
document.addEventListener('mousemove', (event) => {
    const currMouseMoveTime = Date.now();
    
    // Record the current mouse position and the time delay since the last movement
    mouseMovements.push({
        x: event.clientX,           // X-coordinate of the mouse pointer
        y: event.clientY,           // Y-coordinate of the mouse pointer
        timeDelay: currMouseMoveTime - lastMouseMoveTime,  // Time since last movement
        timestamp: currMouseMoveTime  // Timestamp of the mouse movement
    });
    
    // Update the last mouse move time
    lastMouseMoveTime = currMouseMoveTime;
});

// Function to capture mouse clicks
document.addEventListener('click', (event) => {
    // Record the click position and the timestamp of the click
    mouseClicks.push({
        x: event.clientX,           // X-coordinate of the click
        y: event.clientY,           // Y-coordinate of the click
        timestamp: Date.now()       // Timestamp of the click
    });
});

// Runs when the body loads
function init() {
    console.log("Starting");
    console.log(lastPressedTime);
}

// Add all parameters to the global data object and log it


window.onload = function() {
    startTime = Date.now();
}

function logTimeSpent() {
    let endTime = Date.now();
    timeSpent = (endTime - startTime);
}
function submit() {

    logTimeSpent();

    timeDelay.shift();
    data["key_count"] = counter;
    data["key_sequence"] = sequence;
    data["time_delay"] = timeDelay;
    data["mouse_movements"] = mouseMovements;
    data["mouse_clicks"] = mouseClicks;
    data["total_time"] = timeSpent;
    console.log(data);
}
