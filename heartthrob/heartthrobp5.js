let lovePercentage = 100; // Default love percentage
let pulseSize = 300; // Default size of the heart
let pulseSpeed = 0.8; // Speed at which the heart pulses
let pulseDirection = 2; // Direction of the pulse (growing or shrinking)

let stars = [];
let blink = 0;
let blinkdir = 3;

let numStars = 200; // Number of stars for the twinkling effect
let showWelcome = true; // Flag to control the welcome screen
let showSecondPage = false; // Flag for second page
let showThirdPage = false; // Flag for third page

let name1 = "";
let name2 = "";

let input1, input2; // For storing the input elements
let typingTimeout = null; // For debouncing the typing event
let namesFilled = false; // To check if both names are typed

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    // Create input boxes for names on the second page
    input1 = createInput();
    input1.position(width / 3 - 100, height / 2 + 20); // Position for "Your Name"
    input1.size(200);
    input1.attribute("placeholder", "Your Name");
    input1.input(updateNames); // When the user types in input1
    styleInput(input1); // Apply style to input box 1

    input2 = createInput();
    input2.position(2 * width / 3 - 100, height / 2 + 20); // Position for "Crush's Name"
    input2.size(200);
    input2.attribute("placeholder", "Crush's Name");
    input2.input(updateNames); // When the user types in input2
    styleInput(input2); // Apply style to input box 2

    // Initially hide the input boxes
    input1.hide();
    input2.hide();
}

function draw() {
    background(0);

    // Display twinkling stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].show();
    }

    // If the welcome screen is showing, display it
    if (showWelcome) {
        welcomeScreen();
    } 
    // Show the second page with input boxes only
    else if (showSecondPage) {
        displaySecondPage();
    } 
    // Display pulsating heart and percentage on the 3rd page
    else if (showThirdPage) {
        showThirdPageContent();
    }
}

// Function to draw the heart shape at (x, y) with the given size
function heart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

// Class to handle stars for twinkling effect
class Star {
    constructor() {
        this.x = random(width, width * 2);
        this.y = random(height);
        this.size = random(1, 5);
        this.speed = random(1, 3);
        this.brightness = random(100, 255);
    }

    show() {
        fill(255, this.brightness);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }

    update() {
        this.x -= this.speed;
        if (this.x < -this.size) {
            this.x = random(width, width * 2);
            this.y = random(height);
        }

        // Twinkling effect: Change brightness randomly
        this.brightness = random(100, 255);
    }
}

// Welcome Screen Function
function welcomeScreen() {
    // Fade effect for the "Heartthrob" message
    fill(255, 0, 0, 255 - blink); // Red color with decreasing opacity
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Heartthrob", width / 2, height / 2 - 20);

    blink += blinkdir;
    if (blink >= 255 || blink <= 0) {
        blinkdir *= -1;
    }

    fill(255, blink); // Make the "Click to begin" message blink
    textSize(24);
    text("Click to begin", width / 2, height / 2 + 40);
}

// Display second page with only the input boxes (Your Name and Crush's Name)
function displaySecondPage() {
    // Display the title "Match Up" at the top
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Match Up", width / 2, height / 3 - 100);

    // Display the input boxes for "Your Name" and "Crush's Name"
    // No rectangles around them, only the input fields will appear
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Your Name", width / 3, height / 2 - 30);
    text("Crush's Name", 2 * width / 3, height / 2 - 30);

    // Display the input values inside the boxes
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(name1, width / 3, height / 2);  // Display text for Your Name
    text(name2, 2 * width / 3, height / 2);  // Display text for Crush's Name
}

// Function to update the names from the input boxes
function updateNames() {
    name1 = input1.value(); // Get the value from the first input box
    name2 = input2.value(); // Get the value from the second input box

    // Debounce typing: Clear the previous timeout and set a new one
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        if (name1 && name2) {
            lovePercentage = calculateLovePercentage(name1, name2); // Calculate the love percentage only when both names are typed
            namesFilled = true; // Mark that both names are filled
        }
    }, 1000); // 1 second delay after the user stops typing
}

// Function to calculate love percentage based on the names
function calculateLovePercentage(name1, name2) {
    // Convert names to lowercase and calculate the sum of ASCII values of all characters
    let totalValue = 0;
    let combinedNames = name1.toLowerCase() + name2.toLowerCase();
    
    for (let i = 0; i < combinedNames.length; i++) {
        totalValue += combinedNames.charCodeAt(i); // Sum of ASCII values
    }

    // Create a percentage from the total value of the characters
    let percentage = (totalValue % 101); // Keep the value within 0-100
    return percentage;
}

// Display third page content with heart and love percentage
function showThirdPageContent() {
    // Hide the input fields (they shouldn't be visible on this page)
    input1.hide();
    input2.hide();

    // Draw pulsating heart
    pulseSize += pulseSpeed * pulseDirection;
    if (pulseSize > 320 || pulseSize < 280) {
        pulseDirection *= -1; // Reverse the direction of pulse
    }
    fill(255, 0, 0);
    heart(width / 2, height / 2, pulseSize);

    // Display love percentage inside the heart
    fill(255);
    textSize(42);
    textAlign(CENTER, CENTER);
    let percentageX = width / 2;
    let percentageY = height / 2 + 100;
    text(lovePercentage + "%", percentageX, percentageY);
}

// Transition to the second page on mouse click
function mousePressed() {
    if (showWelcome) {
        showWelcome = false; // Hide welcome screen when clicked
        showSecondPage = true; // Show second page with input boxes
        input1.show(); // Show input boxes on second page
        input2.show(); // Show input boxes on second page
    } 
    else if (showSecondPage && namesFilled) {
        showSecondPage = false;
        showThirdPage = true; // Proceed to the third page after input
    }
}

// Styling function for input boxes
function styleInput(inputBox) {
    inputBox.style('border', '2px solid #fff'); // Border color
    inputBox.style('border-radius', '10px'); // Regular box shape (no oval)
    inputBox.style('padding', '10px'); // Padding inside the box
    inputBox.style('background-color', '#333'); // Dark background color
    inputBox.style('color', '#fff'); // Text color inside the box
    inputBox.style('font-size', '18px'); // Font size
    inputBox.style('text-align', 'center'); // Center the text
}






