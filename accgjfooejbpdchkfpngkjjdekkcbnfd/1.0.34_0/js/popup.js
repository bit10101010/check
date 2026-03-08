jQuery(function () {
	jQuery('.copyClipboard').click(function () {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			console.log(tabs);
			if (tabs.length && tabs[0].url.includes("discord.com")) {
				chrome.tabs.sendMessage(tabs[0].id, { action: "openExtensionPopup" }, function(token) {
					if (token) {
						jQuery('#token').val(token)
						jQuery('#token, .copyClipboard').show()
						navigator.clipboard.writeText(token).then(function () {
							alert('Copying to clipboard was successful!');
						}).catch(function (err) {
							alert('Could not copy text: ', err);
						});
					}
				});
			} else {
				alert("Only for discord.com.")
			}
		});
	});
});