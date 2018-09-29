// A quick tutorial through web audio api.. by Chris Malcolm
// This code is more of an explanation, NOT a copy/pastable snippet
// if something doesn't work let me know this code is untested.

/**
 * 
 * CONTEXT!
 * 
 */

// audio context first. its like our canvas
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

/**
 * 
 * SOURCES!
 * 
 */

// here we can hook up sources (in / out audio / read from buffers )
// <audio> html file
const elDom = document.querySelector('#myAudioPlayer');
const source = audioCtx.createMediaElementSource(elDom);

// -- OR --

// a source could also be a stream buffer! (like external url data) 
source = audioCtx.createBufferSource();
source.buffer = myAwesomeApp.getMyBufferedStream(); //get a stream!

/**
 * 
 * PLAYBACK!
 * 
 */

// control their playback
source.start(0);
source.stop(0);
// its our 'middleware' for sound..
// connect to analyzers + other things then..
// stream your sounds through to the speakers..
source.connect(audioCtx.destination);

/**
 * 
 * NODES! analyze + create
 * 
 */

// Analyze!

// and can create audio nodes (anaylsis, oscillators, etc), layers !
const analyser = context.createAnalyser();
analyser.fftSize = 32; //its like the number of divisions per spectral line (resolution!)

// ok so in real app, we would have a forever loop while the thing is playing to 
// analyze in realtime! setimeout has terrible performance implications and will
// eventually lose sync / become laggy. requestAnimationFrame is the solution for 
// native throttling.
const foreverLoop = () => {
  // queue up next invokation ^^ see above for why settimeout is the worst for this
  requestAnimationFrame(foreverLoop);
  // ok this part might look scary..we basically now can get an array of values
  var frequencyData = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(frequencyData);
   //show be an arr of your bin size of number numbers [0,0,20,40,60,..]
  // here's where you can make like a bar chart!
  console.log('barssss', frequencyData);
  // or if u want an average of em all (to gain volume / amplitude)
  const average = frequencyData.reduce((acc, val) => {
    acc += val;
  }) / analyzer.frequencyBinCount;
  console.log('average:', average);
}

// connect this bad boy
source.connect(analyser);
// start ya loop
foreverLoop();


// -- OR --

// Create!

// create sounds! here's a oscillating sound..
oscillatorNode = audioCtx.createOscillator();
// freq lowish brah
oscillatorNode.frequency.value = 30;
// volume low brah
gainNode = audioCtx.createGain();
gainNode.gain.value = 0.01;

// our source is the oscilator!
oscillatorNode.connect(gainNode);
oscillatorNode.start(0);
oscillatorNode.stop(0);