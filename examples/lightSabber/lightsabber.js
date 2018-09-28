var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var oscillatorNode = audioCtx.createOscillator();
oscillatorNode.frequency.value = 60;
var oscillatorGainNode = audioCtx.createGain();
var finish = audioCtx.destination;

var distortionGainNode = audioCtx.createGain();
var distortionNode = audioCtx.createWaveShaper();

function makeDistortionCurve(amount) {
    var k = amount,
        n_samples = typeof sampleRate === 'number' ? sampleRate : 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k)*Math.atan(Math.sinh(x*0.25)*5) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

distortionNode.curve = makeDistortionCurve(600);

oscillatorNode.connect(oscillatorGainNode);
oscillatorGainNode.connect(distortionGainNode);
distortionGainNode.connect(distortionNode);
distortionNode.connect(finish);

oscillatorNode.start(0);