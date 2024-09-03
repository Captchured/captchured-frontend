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

// Array to store mouse movement data
var mouseData = [];
var lastMouseMoveTime = Date.now();

// Function to capture keypress events
document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    currTime = Date.now();

    counter++;
    sequence.push(keyName);
    // Calculate the time delay since the last key press and store it
    timeDelay.push(currTime - lastPressedTime);
    lastPressedTime = currTime;
}, false);

// Function to capture mouse movement events
document.addEventListener('mousemove', (event) => {
    const currMouseMoveTime = Date.now();
    
    // Record the current mouse position and the time delay since the last movement
    mouseData.push({
        type: 'mousemove',
        x: event.clientX,           // X-coordinate of the mouse pointer
        y: event.clientY,           // Y-coordinate of the mouse pointer
        timeDelay: currMouseMoveTime - lastMouseMoveTime  // Time since last movement
    });
    
    // Update the last mouse move time
    lastMouseMoveTime = currMouseMoveTime;
});

// Function to capture mouse clicks
document.addEventListener('click', (event) => {
    // Record the click position and the time of the click
    mouseData.push({
        type: 'click',
        x: event.clientX,           // X-coordinate of the click
        y: event.clientY,           // Y-coordinate of the click
        timestamp: Date.now()       // Time of the click
    });
});

// Function to capture mouse hover over specific elements
const hoverElements = document.querySelectorAll('.hover-track');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', (event) => {
        // Record when the user hovers over an element
        mouseData.push({
            type: 'hover',
            elementId: event.target.id || event.target.className,  // Element ID or class
            timestamp: Date.now()       // Time of the hover
        });
    });
});

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
    data["mouse_movements"] = mouseData;
    console.log(data);
}
