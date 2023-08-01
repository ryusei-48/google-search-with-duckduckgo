chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) {
    sendResponse({
      'status': false,
      'reason': 'message is missing'
    });
  }
  else if (message.contentScriptQuery === 'post') {
    fetch(message.endpoint, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
      }
    })
      .then( async (response) => {
        if (response && response.ok) {
          sendResponse( await response.text() );
        }
      })
      .catch((error) => {
        sendResponse({
          'status': false,
          'reason': 'failed to fetch'
        });
      });
  }

  return true;
});