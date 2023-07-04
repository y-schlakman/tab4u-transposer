var minus = document.getElementById('minus');
var plus = document.getElementById('plus');

minus.addEventListener("click", function(){
	sendMessage({transpose: -0.5});
});
plus.addEventListener("click", function(){
	sendMessage({transpose: 0.5});
});

async function sendMessage(message)
{
	const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
	const response = await chrome.tabs.sendMessage(tab.id, message);
	console.log(response);
}