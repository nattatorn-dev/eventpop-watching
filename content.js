var reloadState, currentTimeout;

function handleTimeout() {
  if(!document.querySelector("button#submit-order[disabled='disabled']")) {
    document.getElementById('submit-order').click()
  } else {
    var selectScriptIndex = 0
    for (i = 0; i < document.getElementsByTagName('script').length; i++) {
        if( document.getElementsByTagName('script')[i].outerHTML.indexOf('window.gon') !== -1) {
    		selectScriptIndex = i
    	}
    }

    var selectorWindowGon = document.querySelectorAll('script')[selectScriptIndex].outerHTML.split(';gon.')
    var inject = selectorWindowGon.reduce(function(p, c, k) {
      return Object.assign(p, {[c.substr(0, c.indexOf('='))]: c.substr(c.indexOf('=') + 1, c.length)})
    }, {})

    var localStorageKey = 'events:'+inject.event_id+':ticket_types:pending_orders'
    var localStorageValue = JSON.stringify(Object.keys(JSON.parse(inject.ticket_types_min)).reduce(function(p, c, k) {
      return k === 0 ? Object.assign(p, {[c]: 1}) : Object.assign(p, {[c]: 0})
    }, {}))

    localStorage.setItem(localStorageKey, localStorageValue)
    document.location.reload()
  }
}

//Set a timeout or remove timeout based on state
function toggleTimeout() {
  if (reloadState.active) {
    console.log("Refresh in " + (reloadState.time / 1000) + " seconds");
    currentTimeout = window.setTimeout(handleTimeout, reloadState.time);
  } else {
    console.log("Refresh cancelled");
    window.clearTimeout(currentTimeout);
  }
}

//Handler for updating page state and calling toggleTimeout
function handleMessage(request) {
  reloadState = request;
  toggleTimeout();
}

//Listen for extension state to change
chrome.runtime.onMessage.addListener(handleMessage);

//Ask for state on load or reload
chrome.runtime.sendMessage({getState: true}, function(response) {
  handleMessage(response);
});
