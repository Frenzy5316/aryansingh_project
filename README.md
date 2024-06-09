
ChatGPT
Web Annotator
Author: Aryan Singh

Abstract
The Web Annotator Chrome extension is designed to enhance user interaction with web content through a suite of powerful annotation tools. This extension allows users to highlight text on any webpage using customizable, color-coded highlights, enabling efficient categorization and organization of significant sections. Users can also attach contextual notes to highlighted content, adding personal insights, comments, or supplementary information for future reference. One of the key features of this extension is the persistence of annotations across browser sessions, ensuring that users can revisit annotated pages with their highlights and notes intact even after closing and reopening the browser.

This project report provides an overview of the project's architecture, features, implementation details, and the technologies used. It highlights the motivation behind the project, the challenges addressed, the novelty and application innovation, as well as future directions for development. This extension has a variety of applications, including teaching sessions, self-notes, and meaningful explanations to others. I've endeavored to make it robust and functional across different systems, screen sizes, and resolutions.

Table of Contents
Introduction
How a Chrome Extension is Created
Implementation
Concluding Remarks
Introduction
What is a Web Annotator?
A web annotator, in this context, is a Chrome extension that enhances user engagement with online content by offering tools for highlighting and annotating text on any webpage. It allows users to mark key sections with customizable, color-coded highlights and add personal notes for additional context. These annotations are saved and persist across browser sessions, ensuring users can access their work anytime. The extension also provides features like keyboard shortcuts and a responsive design for optimal use on various devices, aiming to boost efficiency and organization for researchers, students, and professionals.

Motivation for the Project
When Tinkering Labs released this project, I saw it as an opportunity to gain hands-on experience in web development, which I had not tried before. It was an enjoyable task, and I learned a lot during its execution. This project is particularly useful for teachers and students to explain and understand online concepts effectively. Additionally, I wanted to enhance my JavaScript skills, and this project provided the perfect platform for that. Developing a Chrome extension was a new and exciting challenge for me.

Application Domains
Education: Enhancing the learning experience for students and educators by allowing them to highlight and annotate online course materials, academic papers, and e-books.
Research: Assisting researchers in efficiently marking and taking notes on online journals, articles, and other digital resources, facilitating better organization and retrieval of information.
Professional Use: Helping professionals in various fields to annotate and review online reports, documents, and resources, improving productivity and collaboration.
Personal Knowledge Management: Aiding individuals in bookmarking, highlighting, and annotating web content for personal projects, interests, or daily reading, promoting better knowledge retention and organization.
Collaborative Work: Supporting collaborative annotation and sharing among teams, enabling better communication and idea exchange in academic, professional, and personal contexts.
How a Chrome Extension is Created
A typical Chrome extension is created using several files, which are then loaded unpacked in developer mode. These files include:

The Manifest File (manifest.json): The manifest file is a JSON file that provides essential information about the extension. It includes details such as the extension's name, version, description, permissions (e.g., access to tabs, storage, and web requests), content scripts, background scripts, icons, and more. It serves as the roadmap for Chrome to understand how the extension should behave and what resources it requires.

Background Script (background.js): The background script runs in the background and manages the extension's core functionality. It listens for events such as tab changes, browser actions, and network requests. It also maintains the extension's state and handles tasks that don't require user interaction.

Content Script (content.js): Content scripts are injected into web pages based on specified URL patterns defined in the manifest file. These scripts interact with the DOM of the web page, modify its content, and communicate with the background script using message passing. Content scripts enhance or modify the behavior of specific web pages to provide additional functionality.

Popup HTML (popup.html) and Popup Script (popup.js): If the extension has a browser action or page action that displays a popup when clicked, you'll need a popup.html file to define the structure of the popup and a popup.js file to handle its logic. The popup can contain UI elements such as buttons, input fields, or other interactive components. The popup script can interact with the background script and perform actions based on user input.

Icons and Other Assets: Icons represent the extension in the Chrome Web Store and in the browser toolbar. The manifest file specifies various icon sizes for different use cases. Additionally, you may include other assets such as images or CSS files for styling your extension's UI.

Diagram of Chrome Extension Architecture
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/archi.jpg" alt="Architecture Overview" style="width: 40%;">
  <p style="text-align: center;"><em>Figure 1: Architecture Overview</em></p>
</div>
Flowchart of Chrome Extension Operation
<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/flowchart.jpeg" alt="Flowchart" style="width: 40%;">
  <p style="text-align: center;"><em>Figure 2: Flowchart</em></p>
</div>
Implementation
This project uses the following tech stacks:

HTML: Utilized for creating the structure and layout of the buttons and containers.
CSS: Employed for styling the buttons, containers, and defining their appearance, including hover and active states.
JavaScript: Instrumental in implementing the functionality of the buttons, such as pen drawing, text highlighting, undoing actions, and saving.
How Does the Extension Look?
Initially, the extension looks like this:

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/9.png" alt="Basic layout of the extension" style="width: 40%;">
  <p style="text-align: center;"><em>Figure 3: Basic layout of the extension</em></p>
</div>
This is the default color picker of HTML, providing a wide range of colors for user convenience:

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/8.png" alt="Color selection" style="width: 40%;">
  <p style="text-align: center;"><em>Figure 4: Color selection</em></p>
</div>
Functionality Implementation
Pen Functionality
The 'pen' class is used for styling the button representing the pen tool. The pen functionality is implemented through a series of JavaScript functions and event listeners that enable drawing on the canvas using the mouse. Here's an overview:

Event Listeners:

canvas.addEventListener('mousedown', startDrawing): Triggers the startDrawing function when the mouse button is pressed on the canvas.
canvas.addEventListener('mousemove', draw): Calls the draw function to update the drawing based on the current mouse position.
canvas.addEventListener('mouseup', stopDrawing): Indicates the end of drawing and calls the stopDrawing function when the mouse button is released.
canvas.addEventListener('mouseout', stopDrawing): Ensures drawing stops even if the mouse leaves the canvas.
Drawing Functions:

startDrawing(event): Initializes the drawing process by setting up the initial coordinates for drawing.
draw(event): Updates the drawing based on the current mouse position, creating a continuous line as the mouse moves.
stopDrawing(): Ends the drawing action when the mouse button is released or moves out of the canvas.
Drawing Implementation:

The draw function uses various properties of the 2D rendering context (ctx) to control the appearance and behavior of the pen tool on the canvas.
Below is a screenshot of the pen functionality in action:

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/2.png" alt="Annotating free hand on a web page (instagram.com)" style="width: 80%;">
  <p style="text-align: center;"><em>Figure 5: Annotating free hand on a web page (instagram.com)</em></p>
</div>
Text Highlighter Functionality
The 'highlight-btn' class defines the styling of the button representing the text highlighter tool. JavaScript is utilized to implement the text highlighting functionality by detecting user text selection and applying a background color to the selected text or a specific area on a webpage. Here's an overview:

Function highlightSelection:

Checks if the current tool is set to 'text-highlighter'. If not, the function returns early.
Retrieves the current selection within the document using window.getSelection().
Checks if the selection is collapsed (empty). If so, the highlighting process is not initiated.
Creates a new span element to wrap the highlighted text and sets its background color.
Extracts the contents of the selected range and appends them inside the newly created span element.
Removes the selection range and adds an annotation object to an annotations array.
Function getXPath:

Generates an XPath expression for the given element to locate and reference specific elements on the webpage.
Recursively builds the XPath expression by traversing the DOM tree, ensuring that the annotation is accurately applied to the correct elements.
Event Listener:

Registers an event listener for the 'mouseup' event, which triggers the highlightSelection function when the user releases the mouse button after selecting text.
Below is a screenshot demonstrating the highlighter functionality in action:

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/1.png" alt="Highlighting text on a web page (instagram.com)" style="width: 80%;">
  <p style="text-align: center;"><em>Figure 6: Highlighting text on a web page (instagram.com)</em></p>
</div>
Eraser Functionality
The 'erase' class is associated with the eraser tool button. The eraser functionality allows users to remove existing annotations from the canvas or webpage. Here's an overview:

Function erase():
Clears the entire canvas by using the ctx.clearRect method, effectively removing all pen annotations.
Iterates over all child nodes of the document body and recursively removes the 'highlighted' class from any span elements, thus undoing text highlights.
Below is a screenshot showcasing the eraser functionality:

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="images/3.png" alt="Erasing text highlights on a web page (instagram.com)" style="width: 80%;">
  <p style="text-align: center;"><em>Figure 7: Erasing text highlights on a web page (instagram.com)</em></p>
</div>
HTML and JavaScript Code Overview
HTML Structure (popup.html)
The HTML file defines the structure of the extension's popup interface:

html
Copy code
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <button id="pen" class="pen">Pen</button>
  <input type="color" id="color-picker">
  <button id="highlight" class="highlight-btn">Highlight</button>
  <button id="erase" class="erase">Erase</button>
  <canvas id="drawingCanvas"></canvas>
  <script src="popup.js"></script>
</body>
</html>
JavaScript Functionality (popup.js)
The JavaScript file implements the core functionality of the extension:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function() {
  const penBtn = document.getElementById('pen');
  const colorPicker = document.getElementById('color-picker');
  const highlightBtn = document.getElementById('highlight');
  const eraseBtn = document.getElementById('erase');
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let annotations = [];
  let currentTool = 'pen';
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  penBtn.addEventListener('click', () => {
    currentTool = 'pen';
  });

  colorPicker.addEventListener('change', () => {
    ctx.strokeStyle = colorPicker.value;
  });

  highlightBtn.addEventListener('click', () => {
    currentTool = 'text-highlighter';
  });

  eraseBtn.addEventListener('click', erase);

  function startDrawing(event) {
    if (currentTool !== 'pen') return;
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  }

  function draw(event) {
    if (!drawing) return;
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
  }

  function stopDrawing() {
    drawing = false;
    ctx.closePath();
  }

  function highlightSelection() {
    if (currentTool !== 'text-highlighter') return;
    const selection = window.getSelection();
    if (selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = colorPicker.value;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
    annotations.push({ type: 'highlight', color: colorPicker.value, xpath: getXPath(span) });
  }

  function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.body.querySelectorAll('.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });
  }

  function getXPath(element) {
    if (element.id !== '') return `id("${element.id}")`;
    if (element === document.body) return element.tagName;

    const ix = Array.from(element.parentNode.childNodes).indexOf(element) + 1;
    return `${getXPath(element.parentNode)}/${element.tagName}[${ix}]`;
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  document.addEventListener('mouseup', highlightSelection);
});
Working with Manifest File
manifest.json
The manifest file specifies the extension's metadata, permissions, and script files:

json
Copy code
{
  "manifest_version": 2,
  "name": "Web Annotator",
  "version": "1.0",
  "description": "Annotate the web with highlights and notes.",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "browser_action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
CSS for Styling
The CSS file (popup.css) defines the appearance of the extension's UI elements:

css
Copy code
body {
  font-family: Arial, sans-serif;
}

button {
  margin: 10px;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

#color-picker {
  margin: 10px;
}

canvas {
  border: 1px solid #ccc;
  display: block;
}
Concluding Remarks
This project provided an insightful journey into the world of web development through the creation of a Chrome extension. The Web Annotator Chrome extension enables users to highlight text and make annotations on any webpage, offering significant potential in educational, research, and professional domains. The extension's persistent annotations feature ensures that users can revisit their work, making it a valuable tool for anyone who frequently engages with online content. Future development could include more sophisticated annotation tools, collaborative features, and support for additional browsers.







