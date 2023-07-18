// Move mouse or tap in X direction to change the ASCII scaling.

// ASCII characters used for density mapping
const density = "@235 1254 56 4955. ";

let video;
let asciiDiv;
let img; // Declare a variable to hold the image
let sound2; // Declare a variable to hold the sound
const maxStep = 10;
const minFontSize = 6;
const maxFontSize = minFontSize * maxStep;

function preload() {
  // Load the image
  img = loadImage("TEXT5.png");

  // Load the sound
  sound2 = createAudio("sound3.mp3");
  sound2.loop(); // Make the sound loop continuously
}

function setup() {
  // Create a video capture element
  video = createCapture(VIDEO);
  video.size(180, 110);

  // Set the canvas width and height to match the video and image
  const canvasWidth = video.width + img.width;
  const canvasHeight = max(video.height, img.height);

  createCanvas(canvasWidth, canvasHeight);

  // Create a div element to display the ASCII art
  asciiDiv = createDiv();
}

function draw() {
  // Calculate the current date and the target date (01/08/2024)
  const currentDate = new Date();
  const targetDate = new Date("2024-01-08");

  // Calculate the time remaining until the target date
  const timeRemaining = targetDate - currentDate;

  // Convert the time remaining to days, hours, minutes, and seconds
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Construct the countdown string
  const countdownString = `Countdown: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

  // Load the video pixels and hide the video element
  video.loadPixels();
  video.hide();

  // Initialize the ASCII image string
  let asciiImage = "";

  // Calculate the step size for the ASCII characters based on the mouseX position
  const stepSize = floor(map(mouseX, 0, width, 1, maxStep));

  // Loop through the video pixels and convert them to ASCII characters
  for (let j = 0; j < video.height; j += stepSize) {
    for (let i = 0; i < video.width; i += stepSize) {
      // Get the RGB values of the pixel
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      // Convert RGB to grayscale
      const avg = getGrayScaleColor(r, g, b);

      // Map the grayscale value to an index in the density string
      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, 0, len));

      // Get the corresponding ASCII character
      const c = density.charAt(charIndex);

      // Add the ASCII character to the image string
      if (c === " ") asciiImage += "&nbsp;";
      else asciiImage += c;
    }
    // Add line break after each row of characters
    asciiImage += "<br/>";
  }

  // Calculate the font size and line height based on the step size
  const pointSize = map(stepSize, 1, maxStep, minFontSize, maxFontSize);
  const lineHeightSize = pointSize * 0.75;

  // Apply the font size and line height to the ASCII div element
  asciiDiv.style("font-size", `${pointSize}pt`);
  asciiDiv.style("line-height", `${lineHeightSize}pt`);

  // Clear the canvas
  clear();

  // Calculate the position for the video and image
  const videoX = 0;
  const videoY = 0;
  const imgX = 0;
  const imgY = 0;

  // Draw the video on the canvas
  image(video, videoX, videoY);

  // Draw the image on the canvas
  image(img, imgX, imgY);

  // Draw the ASCII video frame on the canvas
  asciiDiv.html(asciiImage);

  // Set the color and size of the countdown text
  const countdownText = createP(countdownString);
  countdownText.style("font-weight", "bold");
  countdownText.style("color", "yellow");
  countdownText.style("font-size", "20pt");
  countdownText.style("line-height", "20pt");

  // Append the countdown text to the ASCII div element
  asciiDiv.child(countdownText);
}

function getGrayScaleColor(r, g, b) {
  // Calculate grayscale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
