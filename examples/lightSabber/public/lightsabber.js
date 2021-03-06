/**
 * 
 * Light saber by Chris Malcolm (c) 2018
 * 
 * Example of Accelerometer motion + orientation.
 * Also does some web audio oscillator stuff.
 * 
 */
class Saber{
    
    constructor() {
        // audo settings
        this.audioCtx = null;
        this.oscillatorNode =  null;
        this.distortionGainNode = null;
        this.acceloEvtTriggered = false;
        // logging settings
        this.lastTime = 0;
        this.lastTime02 = 0;
        this.throttle = 200;
        
        // orientation
        this.upAngle = null;

        this.logger1 =  this.Logger(document.querySelector('.dialog .content1'));
        this.logger2 =  this.Logger(document.querySelector('.dialog .content2'));
        // DOM settings
        this.$dialog = document.querySelector('.dialog ');
        this.$humButton = document.querySelector('.hum');
        this.$saber = document.querySelector('.lightsaber');
        this.$saberInput = document.querySelector('.lightsaber input');

        this.$hideLogsButton = document.querySelector('.logToggle');

        // init dom events 
        this.domEventInit();
        // start this puppy
        this.startAcceloReadout();
    }

    domEventInit() {

        // synonymous with hum thing..
        this.$saberInput.addEventListener('click', () => {
            this.$humButton.dispatchEvent(new Event('click'));
        });
        //enable disable hum
        this.$humButton.addEventListener('click', () => {
            this.$humButton.classList.toggle('on');
            if (this.$humButton.classList.contains('on')) {
                this.startHum();
                this.$humButton.innerText = 'End Hum';
                this.$saberInput.checked = true;
            } else {
                this.endHum();
                this.$humButton.innerText = 'Start Hum';
                this.$saberInput.checked = false;
            }
        });

        // toggle logs
        this.$hideLogsButton.addEventListener('click', () => {
            this.$hideLogsButton.classList.toggle('on');
            if (this.$hideLogsButton.classList.contains('on')) {
                this.$dialog.style.display = 'block';
                this.$hideLogsButton.innerText = 'Hide Logs';
            } else {
                this.$dialog.style.display = 'none';
                this.$hideLogsButton.innerText = 'Show Logs';
            }
        });
    }

    startAcceloReadout() {
        this.logger1.clearLog();
        this.logger2.clearLog();
        this.logger1.log('motion tracking starting...');
        this.logger2.log('orientation tracking starting...');
        window.addEventListener("deviceorientation", this.handleOrientation.bind(this), true);
        window.addEventListener("devicemotion", this.handleMotion.bind(this), true);
        // some browsers still have the event but really dont have it working..so if evt not triggered in 5.. error out.
        setTimeout(() => {
            if (this.acceloEvtTriggered === false) {
                this.logger1.error('Its been a hot second..probably accelorometer isn\'t supported :(');
                this.logger2.error('Its been a hot second..probably accelorometer isn\'t supported :(');
            }
        }, 5000);
        // this.startHum();
    }
    
    // how fast phone moves!
    handleMotion(e) {
        this.acceloEvtTriggered = true;
        if (Date.now() - this.lastTime >  this.throttle ) {
            this.logger1.clearLog();
            //  how fast we rotating!
            this.logger1.log('rotation acceleration:', e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma);
            // how fast we moving xyz
            const axisMotion = [e.acceleration.x, e.acceleration.y, e.acceleration.z];
            this.logger1.log('acceleration:', axisMotion);
            //lets average
            const movementAverage = Math.abs(axisMotion.reduce((acc, item) => {
                acc += item;
                return acc;
             }));
            //  if we have our oscillator setup lets edit it bruh!
            try {
                this.logger1.log('average: ', movementAverage);
                 if (this.oscillatorNode) {
                     this.logger1.log('ramping to: ',30 + (movementAverage* 1000));
                     // lets change oscillator based on movement speeds !! woop woop
                    this.oscillatorNode.frequency.exponentialRampToValueAtTime(30 + (movementAverage* 50), 
                    this.audioCtx.currentTime + .25);
                    // this.distortionGainNode.gain.exponentialRampToValueAtTime((movementAverage* .025), 
                    // this.audioCtx.currentTime + .25);
                 } else {
                    this.logger1.error('oscilattor not enabled!');
                 }
            } catch (e) {
                this.logger1.error(`Error: ${e}`);
            }
           

            this.lastTime = Date.now();
        }
    }

    // lets watch how this phone orients
    handleOrientation(e) {
        if (Date.now() - this.lastTime02 >  this.throttle ) {
            this.logger2.clearLog();
            // orientation?
            this.logger2.log(
                'plane rotation (on a table, 0 = north pole):<br/>', e.alpha, '<br/>',
                'center short axis (0 = parallel to earth):<br/>', e.beta, '<br/>', 
                'center long axis (0 = parallel to earth surface):<br/> ', e.gamma, '<br/>');
            if (this.oscillatorNode) {
                if (this.upAngle === null) {
                    this.upAngle = e.alpha; // we'll assume the user had it facing up right (portraight)
                }
                // do some css magic brah
                this.$saber.style.transform = `rotateZ(${ this.upAngle - (e.alpha)}deg) rotateX(${-1 * 90 + e.beta}deg)`;
            }
            
            
            this.lastTime02 = Date.now();
        }
    }
    
    // logger convenience function
    Logger($el) {
        return new function(){
            this.$log = $el;
            this.clearLog = function() {
                this.$log.innerText = '';
            }
        
            this.error = function() {
                this.$log.innerHTML += '<br/><span class=\'error\'>' + 
                [...arguments].map((obj) => JSON.stringify(obj)).join(' ') +
                '</span>';
            }
            this.log = function() {
                this.$log.innerHTML += '<br/>' + [...arguments].map((obj) => JSON.stringify(obj)).join(' ');
            }
        }
    }

    // end oscillator...it can get annoying.
    endHum() {
        this.oscillatorNode.stop();
    }

    // this makes a cool hum
    startHum() {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        
        // low frequency no-hi pitched stuff for our
        this.audioCtx = new AudioContext();
        this.oscillatorNode =  this.audioCtx.createOscillator();
        this.oscillatorNode.frequency.value = 30;
        var oscillatorGainNode = this.audioCtx.createGain();
        var finish = this.audioCtx.destination;
        
        // super low like a hum brah
        this.distortionGainNode = this.audioCtx.createGain();
        this.distortionGainNode.gain.value = 0.01;
        var distortionNode = this.audioCtx.createWaveShaper();
        
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
        
        // distort that
        distortionNode.curve = makeDistortionCurve(4000);
        
        this.oscillatorNode.connect(oscillatorGainNode);
        oscillatorGainNode.connect(this.distortionGainNode);
        this.distortionGainNode.connect(distortionNode);
        distortionNode.connect(finish);
        
        this.oscillatorNode.start(0);
        this.oscillatorNode.frequency.value = 30;
        //  wooop woop lets ramp up the start
        this.oscillatorNode.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime);
        this.oscillatorNode.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + .75);
        this.oscillatorNode.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime+1);
    }


}