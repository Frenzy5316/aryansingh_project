let initialX, initialY, currentPath;
let drawingCanvas, drawingContext;
let mouseDownTime;

let activeTool = null;
let activeColor = 'blue';

let allAnnotations = [];
let allHighlights = [];
let actionHistory = [];

let drawingActive = false;
let lastToolUsed = 2;
let selectingText = false;
let mouseMoved = false;

function initializeCanvas() {
  drawingCanvas = document.createElement('canvas');
  drawingCanvas.style.position = 'absolute';
  drawingCanvas.style.top = '0';
  drawingCanvas.style.left = '0';
  drawingCanvas.style.pointerEvents = 'none';
  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight;
  document.body.appendChild(drawingCanvas);
  drawingContext = drawingCanvas.getContext('2d');
  drawingCanvas.addEventListener('mousedown', onCanvasMouseDown);
  drawingCanvas.addEventListener('mousemove', onCanvasMouseMove);
  drawingCanvas.addEventListener('mouseup', onCanvasMouseUp);
  retrieveAnnotations();
  restoreToolState();
}

function undoLastHighlightAction() {
  if (allHighlights.length > 0) {
    const lastHighlight = allHighlights.pop();
    const highlightElement = document.querySelector(`span[highlight-id="${lastHighlight.id}"]`);
    if (highlightElement) {
      highlightElement.replaceWith(document.createTextNode(highlightElement.textContent));
      actionHistory.push(2);
      console.log("Last highlight undone");
    }
  }
}

function adjustCanvasSize(ratio) {
  const newWidth = window.innerWidth * ratio;
  const newHeight = window.innerHeight * ratio;
  drawingCanvas.width = newWidth;
  drawingCanvas.height = newHeight;
  console.log(`Canvas resized to ${newWidth}x${newHeight}`);
}

function confirmAndClearAllHighlights() {
  const confirmation = confirm("Are you sure you want to clear all highlights?");
  if (confirmation) {
    allHighlights = [];
    document.querySelectorAll('span[highlight-id]').forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent));
    });
    console.log("All highlights cleared");
  }
}

function updatePenToolWidth(width) {
  drawingContext.lineWidth = width;
  console.log(`Pen tool width changed to ${width}`);
}

function modifyHighlightColor(highlightId, newColor) {
  const highlight = allHighlights.find(h => h.id === highlightId);
  if (highlight) {
    highlight.color = newColor;
    const highlightElement = document.querySelector(`span[highlight-id="${highlightId}"]`);
    if (highlightElement) {
      highlightElement.style.backgroundColor = newColor;
      console.log(`Highlight color changed to ${newColor} for highlight ID ${highlightId}`);
    }
  }
}

function onCanvasMouseDown(event) {
  if (activeTool === 'pen') {
    beginDrawing(event);
  } else if (activeTool === 'highlighter') {
    selectingText = true;
    mouseMoved = false;
  }
}

function removeAllAnnotationsAndHighlights() {
  allAnnotations = [];
  allHighlights = [];
  drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  document.querySelectorAll('span[highlight-id]').forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  console.log("All annotations and highlights cleared");
}

function onCanvasMouseMove(event) {
  if (activeTool === 'pen' && drawingActive) {
    continueDrawing(event);
  } else if (selectingText) {
    mouseMoved = true;
  }
}

function onCanvasMouseUp(event) {
  if (activeTool === 'pen' && drawingActive) {
    finishDrawing(activeColor);
  } else if (activeTool === 'highlighter' && selectingText) {
    selectingText = false;
    if (mouseMoved) {
      clearTimeout(mouseDownTime);
      mouseDownTime = setTimeout(() => {
        initiateHighlighting();
      }, 200);
    }
  }
}

function beginDrawing(event) {
  drawingCanvas.style.pointerEvents = 'auto';
  drawingActive = true;
  initialX = event.clientX;
  initialY = event.clientY;
  currentPath = [{ x: initialX, y: initialY }];
}

function exportAnnotationsToJSON() {
  const data = JSON.stringify({ annotations: allAnnotations, highlights: allHighlights });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'annotations.json';
  link.click();
  console.log("Annotations exported as JSON");
}

function continueDrawing(event) {
  if (!drawingActive) return;
  drawingContext.strokeStyle = activeColor;
  drawingContext.lineWidth = 2;
  drawingContext.lineCap = 'round';
  drawingContext.globalAlpha = 1.0;

  drawingContext.beginPath();
  drawingContext.moveTo(initialX, initialY);
  drawingContext.lineTo(event.clientX, event.clientY);
  drawingContext.stroke();

  initialX = event.clientX;
  initialY = event.clientY;
  currentPath.push({ x: initialX, y: initialY });
}

function finishDrawing(color) {
  if (!drawingActive) return;
  drawingActive = false;
  if (currentPath.length > 1) {
    actionHistory.push(1);
    allAnnotations.push({ tool: 'pen', color: color, path: currentPath });
  }
}

function wrapTextInSpan(color, notes) {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let span = document.createElement('span');
    span.style.backgroundColor = color;
    span.setAttribute('highlight-id', Date.now());
    range.surroundContents(span);
    actionHistory.push(2);
    allHighlights.push({ span: span.outerHTML, range: range.toString(), color: color, id: span.getAttribute('highlight-id'), note: notes });
  }
}

function initiateHighlighting() {
  if (activeTool === 'highlighter') {
    let note = prompt("Enter a note for this highlight:");
    wrapTextInSpan(activeColor, note);
  }
}

function retrieveAnnotations() {
  chrome.runtime.sendMessage({ action: "loadAnnotations" }, (response) => {
    if (response && response.annotations) {
      allAnnotations = response.annotations;
      allHighlights = response.highlights;
      lastToolUsed = 2;
      redrawCanvas(lastToolUsed);
    } else {
      console.log("No annotations found");
    }
  });
}

function rotateCanvasContent(angle) {
  const radians = angle * (Math.PI / 180);
  drawingContext.save();
  drawingContext.translate(drawingCanvas.width / 2, drawingCanvas.height / 2);
  drawingContext.rotate(radians);
  drawingContext.translate(-drawingCanvas.width / 2, -drawingCanvas.height / 2);
  drawingContext.drawImage(drawingCanvas, 0, 0);
  drawingContext.restore();
  console.log(`Canvas content rotated by ${angle} degrees`);
}

function restoreToolState() {
  chrome.storage.local.get(['PenStatus', 'HighlighterStatus', 'ColorStatus'], (result) => {
    if (result.PenStatus === true) {
      activeTool = 'pen';
      drawingCanvas.style.pointerEvents = 'auto';
      activeColor = result.ColorStatus || '#FFFF00';
    } else if (result.HighlighterStatus === true) {
      activeTool = 'highlighter';
      drawingCanvas.style.pointerEvents = 'none';
      activeColor = result.ColorStatus || '#FFFF00';
    } else {
      activeTool = null;
      drawingCanvas.style.pointerEvents = 'none';
      activeColor = result.ColorStatus || '#FFFF00';
    }
  });
}

function redrawCanvas(toolUsed) {
  drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  if (toolUsed === 2 || toolUsed === 1) {
    allHighlights.forEach(highlight => {
      let span = document.createElement('span');
      span.innerHTML = highlight.range;
      span.style.backgroundColor = highlight.color;
      span.setAttribute('highlight-id', highlight.id);
      let bodyText = document.body.innerHTML;
      let highlightedText = bodyText.replace(highlight.range, span.outerHTML);
      document.body.innerHTML = highlightedText;
    });
  }
  if (toolUsed === 2 || toolUsed === 1) {
    allAnnotations.forEach(annotation => {
      drawingContext.strokeStyle = annotation.color;
      drawingContext.lineWidth = 2;
      drawingContext.globalAlpha = 1.0;
      drawingContext.lineCap = 'round';
      const paths = annotation.path;
      for (let i = 1; i < paths.length; i++) {
        drawingContext.beginPath();
        drawingContext.moveTo(paths[i - 1].x, paths[i - 1].y);
        drawingContext.lineTo(paths[i].x, paths[i].y);
        drawingContext.stroke();
      }
    });
  }
}

initializeCanvas();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen") {
    activeTool = message.status2 ? 'pen' : null;
    drawingCanvas.style.pointerEvents = message.status2 ? 'auto' : 'none';
  } else if (message.action === "highlighter") {
    activeTool = message.status1 ? 'highlighter' : null;
    drawingCanvas.style.pointerEvents = message.status1 ? 'none' : 'none';
    if (activeTool === 'highlighter') {
      document.addEventListener('mousedown', onCanvasMouseDown);
      document.addEventListener('mousemove', onCanvasMouseMove);
      document.addEventListener('mouseup', onCanvasMouseUp);
    }
  } else if (message.action === "color") {
    activeColor = message.color;
  } else if (message.action === "save") {
    chrome.runtime.sendMessage({ action: "saveAnnotation", annotat: allAnnotations, high: allHighlights }, (response) => {
      if (response && response.status === "success") {
        alert("Annotations have been Saved!");
      }
    });
  } else if (message.action === "undo") {
    lastToolUsed = 1;
    const lastAction = actionHistory.pop();
    if (lastAction === 1) {
      if (allAnnotations.length > 0) {
        const lastAnnotation = allAnnotations.pop();
        redrawCanvas(lastToolUsed);
      }
    } else if (lastAction === 2) {
      if (allHighlights.length > 0) {
        const lastHighlight = allHighlights.pop();
        const highlightElement = document.querySelector(`span[highlight-id="${lastHighlight.id}"]`);
        if (highlightElement) {
          highlightElement.replaceWith(document.createTextNode(highlightElement.textContent));
        }
        redrawCanvas(lastToolUsed);
      }
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN' && event.target.hasAttribute('highlight-id')) {
    let highlightId = event.target.getAttribute('highlight-id');
    let highlight = allHighlights.find(h => h.id === highlightId);
    if (highlight && highlight.note) {
      alert(`Note: ${highlight.note}`);
    }
  }
});
