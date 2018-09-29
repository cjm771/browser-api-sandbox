// Speech recognition
// recognize speech keywords. yes i know. awesome.


//we define some colors
let grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black ' +
'| blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray ' +
'| green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive ' +
'| orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal ' +
'| thistle | tomato | turquoise | violet | white | yellow ;';
//webkit only
let recognition = new webkitSpeechRecognition();
let speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

//some kind of way to start
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
};

recognition.onresult = function(event) {
  // look up for all the results if interested, 0,0 is generally what we want
  const color = event.results[0][0].transcript;
  console.log('Pretty sure you said: ' + color + '. Take that siri!');
  document.body.style.backgroundColor = color;
}