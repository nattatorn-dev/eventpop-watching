//Set initial state of extension
var reloadState = {
  active: false,
  time: 100 //Time in ms for reload timeout
}

function updateTabIcon(id) {
  if (reloadState.active) {
    chrome.browserAction.setIcon({ path: 'cat_on.png', tabId: id })
  } else {
    chrome.browserAction.setIcon({ path: 'cat_off.png', tabId: id })
  }
}

//When extension is clicked, toggle the state of the extenstion
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('Simple Refresh')

  //Select the tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0]
    //Flip the state
    reloadState.active = !reloadState.active
    //Send the updated state to the page
    chrome.tabs.sendMessage(activeTab.id, reloadState)

    //Update icon
    updateTabIcon(activeTab.id)
  })
})

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //Grab the active tab
    var activeTab = tabs[0]

    //Set icon according to state
    updateTabIcon(activeTab.id)
  })
})

//Listen for requests from page for state
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //If request is "getState"
  if (request.getState) {
    //Send state to page
    sendResponse(reloadState)
  }
})
