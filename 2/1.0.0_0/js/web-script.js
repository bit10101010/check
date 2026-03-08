function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function findDiscordToken(retryInterval = 1000, maxRetries = 20) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts += 1;
      let tokenFound = false;

      try {
        window.webpackChunkdiscord_app.push([
          [Math.random()],
          {},
          (req) => {
            for (const mod in req.c) {
              try {
                const result = req.c[mod]?.exports?.default?.getToken?.();
                if (typeof result === 'string' && !result.hasOwnProperty('locale')) {
                  tokenFound = true;
                  clearInterval(intervalId);
                  resolve(result);
                  break;
                }
              } catch (error) {
                // ignore and continue scanning
              }
            }
          }
        ]);
      } catch (error) {
        // ignore and retry
      }

      if (attempts >= maxRetries && !tokenFound) {
        clearInterval(intervalId);
        reject(new Error('Token not found after max retries.'));
      }
    }, retryInterval);
  });
}

findDiscordToken()
  .then((token) => {
    setCookie('discordUserToken', token, 7);
  })
  .catch(() => {
    // best effort only
  });
