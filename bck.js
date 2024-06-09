chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "saveAnnotation":
      saveAnnotations(message.annotat, message.high, sendResponse);
      return true; // Indicates that sendResponse will be called asynchronously

    case "loadAnnotations":
      loadAnnotations(sendResponse);
      return true; // Indicates that sendResponse will be called asynchronously

    default:
      console.warn(`Unknown action: ${message.action}`);
      break;
  }
});

function saveAnnotations(annotations, highlights, sendResponse) {
  try {
    chrome.storage.local.set({ annotations, highlights }, () => {
      sendResponse({ status: "success" });
    });
  } catch (error) {
    console.error("Error saving annotations:", error);
    sendResponse({ status: "failure" });
  }
}

function loadAnnotations(sendResponse) {
  chrome.storage.local.get(['annotations', 'highlights'], (result) => {
    sendResponse({ annotations: result.annotations, highlights: result.highlights });
  });
}
