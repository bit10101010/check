const injectedScript = document.createElement('script');
injectedScript.src = chrome.runtime.getURL('js/web-script.js');
injectedScript.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(injectedScript);

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openExtensionPopup') {
    sendResponse(getCookie('discordUserToken'));
  }
});
