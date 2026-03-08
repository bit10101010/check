// Content script for Discord Token Login Extension
// This script runs on Discord pages

(function() {
  'use strict';

  const LOG_PREFIX = '[Discord Token Login][content]';

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    log('Message received:', request?.action);

    if (request.action === 'openExtensionPopup') {
      const token = extractTokenFromPage();
      if (token) {
        log('Token extracted for popup request');
        sendResponse(token);
      } else {
        log('No token extracted for popup request');
        sendResponse(null);
      }
      return true;
    }

    if (request.action === 'injectToken') {
      try {
        log('Inject token request received');
        injectTokenToDiscord(request.token);
        sendResponse({ success: true });
      } catch (error) {
        log('Inject token failed:', error?.message || error);
        sendResponse({ success: false, error: error.message });
      }
    }
    return true;
  });

  function extractTokenFromPage() {
    try {
      const direct = window.localStorage.getItem('token');
      if (direct) {
        return direct.replace(/^"|"$/g, '');
      }
    } catch (e) {
      log('Direct localStorage token read failed:', e?.message || e);
    }

    try {
      let foundToken = null;
      window.webpackChunkdiscord_app.push([
        [Math.random()],
        {},
        (req) => {
          for (const mod of Object.values(req.c)) {
            try {
              const candidate = mod?.exports?.default?.getToken?.();
              if (typeof candidate === 'string' && candidate.includes('.')) {
                foundToken = candidate;
                break;
              }
            } catch (e) {
              // Keep scanning modules
            }
          }
        }
      ]);

      return foundToken;
    } catch (e) {
      log('Webpack token extraction failed:', e?.message || e);
      return null;
    }
  }
  
  // Function to inject token into Discord's localStorage
  function injectTokenToDiscord(token) {
    // Method 1: Using iframe trick for localStorage access
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      if (iframe.contentWindow && iframe.contentWindow.localStorage) {
        iframe.contentWindow.localStorage.setItem('token', JSON.stringify(token));
      }
      
      document.body.removeChild(iframe);
    } catch (e) {
      console.log('Iframe method failed:', e);
    }
    
    // Method 2: Direct localStorage (may work on some versions)
    try {
      localStorage.setItem('token', JSON.stringify(token));
    } catch (e) {
      console.log('Direct localStorage method failed:', e);
    }
    
    // Method 3: Using webpackChunkdiscord_app if available
    try {
      if (typeof webpackChunkdiscord_app !== 'undefined') {
        webpackChunkdiscord_app.push([
          [Math.random()],
          {},
          (req) => {
            for (const m of Object.keys(req.c).map((x) => req.c[x].exports).filter((x) => x)) {
              if (m.default && m.default.setToken) {
                m.default.setToken(token);
                break;
              }
              if (m.setToken) {
                m.setToken(token);
                break;
              }
            }
          }
        ]);
      }
    } catch (e) {
      console.log('Webpack method failed:', e);
    }
  }
  
  // Log that content script is loaded
  log('Content script loaded');
})();

