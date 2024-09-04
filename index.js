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
let timeSpent = 0;

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
document.addEventListener("mousemove", (event) => {
  const currMouseMoveTime = Date.now();

  // Record the current mouse position and the time delay since the last movement
  mouseMovements.push({
    x: event.clientX, // X-coordinate of the mouse pointer
    y: event.clientY, // Y-coordinate of the mouse pointer
    timeDelay: currMouseMoveTime - lastMouseMoveTime, // Time since last movement
    timestamp: currMouseMoveTime, // Timestamp of the mouse movement
  });

  // Update the last mouse move time
  lastMouseMoveTime = currMouseMoveTime;
});

// Function to capture mouse clicks
document.addEventListener("click", (event) => {
  // Record the click position and the timestamp of the click
  mouseClicks.push({
    x: event.clientX, // X-coordinate of the click
    y: event.clientY, // Y-coordinate of the click
    timestamp: Date.now(), // Timestamp of the click
  });
});

// Runs when the body loads
function init() {
  console.log("Starting");
  console.log(lastPressedTime);
}

// Function to log time spent on the page
function logTimeSpent() {
  let endTime = Date.now();
  timeSpent = endTime - startTime;
}

// Function to submit the collected data
function submit() {
  logTimeSpent();

  // Remove the first entry in timeDelay since it doesn't correspond to a keypress
  timeDelay.shift();

  // Prepare the data to be sent to the backend
  const postData = {
    key_count: counter,
    key_sequence: sequence,
    time_delay: timeDelay,
    mouse_movements: mouseMovements,
    mouse_clicks: mouseClicks,
    total_time: timeSpent,
    environment: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      cpu: navigator.hardwareConcurrency,
      browser: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      os: navigator.platform,
      deviceType: /Mobi|Tablet/.test(navigator.userAgent)
        ? "Mobile/Tablet"
        : "Desktop",
    },
  };

  // Make a POST request to the backend
  fetch('http://localhost:3000/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);

    /*
    //  webpage pe result dikhane ke liye (optional)
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `Server response: ${result.message}`;
    document.body.appendChild(resultDiv);
    */


    // prediction result alert karke dikhane ke liye (comment/uncomment as needed)
    alert(result.predictionResult); 

  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Initialize the start time when the page loads
window.onload = function () {
  startTime = Date.now();

  // Browser Inspector - Collect environmental data
  data["environment"] = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    cpu: navigator.hardwareConcurrency,
    browser: navigator.userAgent,
    cookiesEnabled: navigator.cookieEnabled,
    os: navigator.platform,
    deviceType: /Mobi|Tablet/.test(navigator.userAgent)
      ? "Mobile/Tablet"
      : "Desktop",
  };
};
