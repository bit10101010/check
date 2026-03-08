function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

try {
	function findDiscordToken(retryInterval = 1000, maxRetries = 20) {
		return new Promise((resolve, reject) => {
			let attempts = 0;
			const intervalId = setInterval(() => {
				attempts++;
				console.log(`Attempt ${attempts}: searching for token...`);
				let tokenFound = false;

				try {
					window.webpackChunkdiscord_app.push([
						[Math.random()],
						{},
						e => {
							for (const mod in e.c) {
								try {
									const result = e.c[mod]?.exports?.default?.getToken?.();
									if (typeof result === 'string' && !result.hasOwnProperty('locale')) {
										console.log('Token found:', result);
										tokenFound = true;
										clearInterval(intervalId);
										resolve(result);
										break;
									}
								} catch { }
							}
						}
					]);
				} catch (err) {
					console.error('Error during token search:', err);
				}

				if (attempts >= maxRetries && !tokenFound) {
					clearInterval(intervalId);
					reject('Token not found after max retries.');
				}
			}, retryInterval);
		});
	}

	// Usage:
	findDiscordToken().then(token => {
		setCookie('discordUserToken', token, 7);
	}).catch(err => {
		console.error(err);
	});
} catch (error) {
	console.log('error:', error);
}
