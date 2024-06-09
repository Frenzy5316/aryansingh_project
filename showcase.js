document.addEventListener('DOMContentLoaded', () => {
  let isPenActive = false;
  let isHighlighterActive = false;
  let selectedColor = "#FFFFFF";

  const updateButtonStyles = () => {
    document.getElementById('pen').style.backgroundColor = isPenActive ? '#D4D4D4' : '#FFFFFF';
    document.getElementById('highlighter').style.backgroundColor = isHighlighterActive ? '#D4D4D4' : '#FFFFFF';
    document.getElementById('color-palette').value = selectedColor;
  };

  const updateStorage = () => {
    chrome.storage.local.set({ isPenActive, isHighlighterActive, selectedColor });
  };

  const sendMessageToActiveTab = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      } else {
        console.error("No active tab found");
      }
    });
  };

  document.getElementById('pen').addEventListener('click', () => {
    isPenActive = !isPenActive;
    isHighlighterActive = false;
    updateStorage();
    updateButtonStyles();
    sendMessageToActiveTab({ action: "pen", status1: isHighlighterActive, status2: isPenActive });
  });

  document.getElementById('highlighter').addEventListener('click', () => {
    isHighlighterActive = !isHighlighterActive;
    isPenActive = false;
    updateStorage();
    updateButtonStyles();
    sendMessageToActiveTab({ action: "highlighter", status1: isHighlighterActive, status2: isPenActive });
  });

  chrome.storage.local.get(['isPenActive', 'isHighlighterActive', 'selectedColor'], (result) => {
    isPenActive = result.isPenActive || false;
    isHighlighterActive = result.isHighlighterActive || false;
    selectedColor = result.selectedColor || '#FFFF00';
    updateButtonStyles();
  });

  document.getElementById('color-palette').addEventListener('change', (event) => {
    selectedColor = event.target.value;
    updateStorage();
    updateButtonStyles();
    sendMessageToActiveTab({ action: "color", color: selectedColor });
  });

  document.getElementById('save').addEventListener('click', () => {
    sendMessageToActiveTab({ action: "save" });
  });

  document.getElementById('undo').addEventListener('click', () => {
    console.log("Sending 'undo' action to content script");
    sendMessageToActiveTab({ action: "undo" });
  });
});
