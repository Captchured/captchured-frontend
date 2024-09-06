var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

var sliderMouseMovements = [];
var sliderKeyPresses = [];
var sliderTimeSpent = 0;
var sliderStartTime;
var sliderActive = false;  // Added this flag to manage slider interaction

// Record mouse movements while interacting with the slider
slider.addEventListener("mousemove", (event) => {
    if (sliderActive) {
        sliderMouseMovements.push({
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now(),
        });
    }
});

// Capture key presses during slider interaction (if relevant)
document.addEventListener("keydown", (event) => {
    if (sliderActive) {
        sliderKeyPresses.push({
            key: event.key,
            timestamp: Date.now(),
        });
    }
});

// When the slider value changes (user interaction with the slider)
slider.oninput = function() {
    output.innerHTML = this.value;
};

// Start tracking time when the user starts interacting with the slider
slider.addEventListener("mousedown", () => {
    sliderStartTime = Date.now(); 
    sliderActive = true; 
});

// When the slider interaction ends (user releases the mouse button)
slider.addEventListener("mouseup", () => {
    // Calculate total time spent on the slider interaction
    sliderTimeSpent = Date.now() - sliderStartTime;

    // Prepare the data collected during the slider interaction
    const postData = {
        key_count: sliderKeyPresses.length, 
        key_sequence: sliderKeyPresses.map(press => press.key), 
        mouse_movements: sliderMouseMovements, 
        total_time: sliderTimeSpent, 
        environment: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            cpu: navigator.hardwareConcurrency,
            browser: navigator.userAgent,
            os: navigator.platform,
            deviceType: /Mobi|Tablet/.test(navigator.userAgent) ? "Mobile/Tablet" : "Desktop",
        },
    };

    // Send the captured data to the backend (to '/capture' endpoint)
    fetch('http://localhost:3000/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Slider Data Sent:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        sliderActive = false; 
    });
});
