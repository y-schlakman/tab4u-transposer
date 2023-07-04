console.log("tab4u transposer has been loaded");//debug
document.body.onload = function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log("message recieved");
		if (request.transpose == undefined)
			return;
		console.log(request);
		transpose(request.transpose);
	});
};

/*
* TODO:
* clean code (make general chords array and check for english becase most songs ar in hebrew.
* make the transposing happen during the first cycle instead of having two cycles. understand when you'll get empty elements and make clean organized edge case checks.
*/
function transpose(tone)
{
	notesSharpes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
	notesMinors = ['Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G']
	sharp = /(?<=^|\s|\/)([a-g]#)m?(?:maj)?(?:min)?\d?(?:sus\d)?(?=\s|$|\/)/ig
	minor = /(?<=^|\s|\/)([a-g]b?)m?(?:maj)?(?:min)?\d?(?:sus\d)?(?=\s|$|\/)/ig
	
		
	realTone = tone * 2;
	
	console.log("tab4u transposer has started working");//debug
	
	chords_en = document.getElementsByClassName('chords_en');
	if(chords_en.length == 0)
		chords_en = document.getElementsByClassName('chords');
	var chordElements = [];
	for(var i = 0; i < chords_en.length; ++i) {
		for(var j = 0; j < chords_en[i].childNodes.length; ++j) {
			var elem = chords_en[i].childNodes[j];
			if(elem.nodeName === 'SPAN'){
				chordElements.push(elem.firstChild);
			}
			else if(elem.nodeName === '#text' && elem.nodeValue.trim() != '') {
				chordElements.push(elem);
			}
			console.log(elem);
		}
	}
	console.log(chordElements);
	
	var chords = [];
	chordElements.forEach(function(chordElement) {
		if(chordElement.nodeValue.trim() == '')
			return;
		if(sharp.test(chordElement.nodeValue)) {
			chordElement.nodeValue = chordElement.nodeValue.replace(sharp, function(match, p1, offset, string) {
				var chordIndex = notesSharpes.indexOf(p1);
				return match.replace(p1, getOffsetInArray(notesSharpes, chordIndex, realTone));
			});
		}
		else {
			chordElement.nodeValue = chordElement.nodeValue.replace(minor, function(match, p1, offset, string) {
				var chordIndex = notesMinors.indexOf(p1);
				return match.replace(p1, getOffsetInArray(notesMinors, chordIndex, realTone));
			});
		}
	});
}

function getOffsetInArray(arr, index, offset)
{
	var dest = (index + offset) % 12;
	if(dest < 0)
	{
		dest = 12 + dest;
	}
	return arr[dest];
}