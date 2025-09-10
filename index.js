const draggablecover = document.getElementById("draggablecover")
const draggablecoversum = document.getElementById("draggablecover-sum")
const strlenmeters = document.getElementById('L')
const strlenlambda = document.getElementById('L-lambda')
const vparameter = document.getElementById('v-parameter')

const medium = document.getElementById("wavemedium")
const mediumreflected = document.getElementById("wavemedium-reflected")
const mediumreflected2 = document.getElementById("wavemedium-reflected2")
const mediumsum = document.getElementById("wavemedium-sum")

const dots = document.getElementsByTagName("dot");
const dots2 = document.getElementsByTagName("dot2");
const dots3 = document.getElementsByTagName("dot3");
const dotsum = document.getElementsByTagName("dotsum");

const axes = document.getElementsByClassName("axis")

const sendWaveButton = document.getElementById("sendWaveButton")
const resetWaveButton = document.getElementById("resetWaveButton")
const pulseWaveButton = document.getElementById("pulseWaveButton")

const stopwatch = document.getElementById('stopwatch')
const infopage = document.getElementById('infopage')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const PI = Math.PI
var mode = 'std-wave'
const totalstrlenmeters = 2 //m
const gapdotdistance = 0.32 //rem, (dot width + dot gap)
var divisions = 16
var datapoints = 160
var indexOfLastDot = datapoints - 1

var a = 3
var f = 4
var v = 10
const maxv = 20 + 1
var phase = 0
var t = 0

var a2 = 3
let f2 = 5
let v2 = 5
var phase2 = 0
var u = 0

var delay = 10
var loop = true
var reflect = -1
var reflecttwice = 0
var dmp = 0
var absorb = 1
var pulsewid = 0.5
var pulseLen = (PI*100)/f
var tplus = 0 //the time after the last pulse is sent

function generateAxis(totalMeters, isThereExtension) {
    let offset = 0
    let axisnumber = 0
    for (const axis of axes) {
        axis.textContent = ''
        let mrk1multiplier = 1
        for (let i = 1; i < divisions; i++) {
            if (i%4 === 0) {
                const mrk = document.createElement('majmrk')
                const n = document.createElement('n')
                n.textContent = `${offset+(totalMeters/4)*mrk1multiplier++}m`
                axis.appendChild(mrk)
                mrk.appendChild(n)
                continue
            }
            const mrk = document.createElement('minmrk')
            axis.appendChild(mrk)
            
            if (i%2 === 0) {
                const n = document.createElement('n')
                n.textContent = `${offset+(totalMeters/4)*(mrk1multiplier-1) + (totalMeters/8)}m`
                mrk.appendChild(n)
            }
        }
        if (isThereExtension === true && axisnumber === 1) offset += totalMeters
        axisnumber++
    }
}

function generateSliderCover() {
    document.getElementById('slidercover-wrapper').textContent = ''

    const slidercover = document.createElement("input")
    slidercover.type = 'range'; slidercover.id = 'slidercover'; slidercover.min = 1; slidercover.value = 1
    slidercover.max = `${gapdotdistance + 1 + (datapoints/2)*gapdotdistance}`
    slidercover.step = `${gapdotdistance}`

    slidercover.addEventListener("input", () => {
        let value = slidercover.value   
        indexOfLastDot = parseInt(datapoints - (value-1)/gapdotdistance) //minus 1 just in case
        if (indexOfLastDot > datapoints - 1) indexOfLastDot = datapoints - 1

        draggablecover.style.width = `${value}rem`
        draggablecoversum.style.width = `${value}rem`
        let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints)).toFixed(2)
        strlenmeters.textContent = `${len}m`
        strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`

        //for disappearing axis labels:
        let round = datapoints/(divisions)
        let num = Math.ceil((indexOfLastDot-(round/2)) / round) * round
        
        if (num < indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 0) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[num/2 - 1].classList.add('hide')
                }
            }
        }
        if (num > indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 1) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[Math.floor(num/2) - 1].classList.remove('hide')
                }
            }
        }
    });
    document.getElementById('slidercover-wrapper').appendChild(slidercover)
}

async function resetWave() {
    t = 0
    u = 0
    loop = false
    await sleep(delay + 100)
    medium.textContent = ''
    mediumreflected.textContent = ''
    mediumreflected2.textContent = ''
    mediumsum.textContent = ''
    if (mode === 'med-wave' || mode === 'transmit') vparameter.classList.remove('unclickable')

    await sleep(delay + 100)
    
    for (let i = 0; i < datapoints; i++) {
        const newdot = document.createElement("dot");
        medium.appendChild(newdot)

        const newdot2 = document.createElement("dot2");
        mediumreflected.appendChild(newdot2)
    }
    if (mode === 'transmit') {
        for (let j = 0; j < 2*datapoints; j++) {
            const newdotsum = document.createElement("dotsum");
            if (j < datapoints) {newdotsum.classList.add('str1')} 
            else {newdotsum.classList.add('str2')}
            mediumsum.appendChild(newdotsum)

            if (j % 2 === 0) {
                const newdot3 = document.createElement("dot3");
                mediumreflected2.appendChild(newdot3)
            }
        }
    } 
    else {
        for (let j = 0; j < datapoints; j++) {
            const newdotsum = document.createElement("dotsum");
            mediumsum.appendChild(newdotsum)
        }
    }
    sendWaveButton.textContent = "SEND WAVE";
    sendWaveButton.classList.remove('unclickable')
    pulseWaveButton.classList.remove('unclickable')

}
function resetSliderCover() {
    indexOfLastDot = datapoints - 1
    document.getElementById('slidercover').value = 1
    draggablecover.style.width = '1rem'
    draggablecoversum.style.width = '1rem'
    strlenmeters.textContent = `${totalstrlenmeters}m`
    let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints)).toFixed(2)
    strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`

    for (const axis of axes) {
        for (ticks of axis.getElementsByTagName('n')) {
            ticks.classList.remove('hide')
        }
    }
}

/*STARTUP*/
async function startup() {
    await resetWave()
    generateAxis(totalstrlenmeters, false);
    generateSliderCover();
    resetSliderCover();
} 
startup();




sendWaveButton.addEventListener("click", async () => {
    if (sendWaveButton.textContent == "STOP WAVE") {
        loop = false;
        sendWaveButton.textContent = "SEND WAVE";
        return
    }
    else {
        loop = true;
        sendWaveButton.textContent = "STOP WAVE";
        pulseWaveButton.classList.add('unclickable')

        switch (mode) {
            case 'std-wave':
                animateStandingWave()
                break
            case 'inf-wave':
                animateCollision()
                break
            case 'med-wave':
                animateMedia()
                break
            case 'transmit':
                animateTransmission()
                break
        }
        return
    }
});

pulseWaveButton.addEventListener("click", async () => {
    sendWaveButton.classList.add('unclickable')
    switch (mode) {
        case 'std-wave':
            animateStandingWavePulse()
            break
        case 'transmit':
            animateTransmissionPulse()
            break
    }
});

resetWaveButton.addEventListener("click", resetWave);

function loadInfoPage(url) {
    fetch('./sim-info-pages/' + url + '.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text(); // Get the response as plain text (HTML)
    })
    .then(html => {
        infopage.innerHTML = html;
        if (typeof MathJax !== 'undefined' && MathJax.typeset) {
            MathJax.typeset(); // Load Mathjax
        }
    })
    .catch(error => {
        console.error('Error loading information page:', error);
    });
}

const simselector = document.getElementById('sim-selector')
simselector.addEventListener(('click'), async (e) => {
    if (e.target.id === 'sim-selector') return
    for (simtype of simselector.getElementsByClassName('sim-type')) {
        if (e.target.id === simtype.id) {
            simtype.classList.add('selected')
            mode = simtype.id

            if (simtype.id === 'med-wave' || simtype.id === 'transmit') {
                infopage.classList.add('short')
            } else infopage.classList.remove('short')

            loadInfoPage(mode)
        } else {
            simtype.classList.remove('selected')
        }
    }

    document.getElementById('container-main').classList.add('hide')
    document.getElementById('resultant-wave').classList.add('hide')


    if (e.target.id === 'std-wave' || e.target.id === 'inf-wave') {
        datapoints = 160
        await resetWave()
        await resetSliderCover()
        medium.style.backgroundColor = ''
        mediumreflected.style.backgroundColor = ''
        document.documentElement.style.setProperty('--datapoints', `${datapoints}`);
        await generateAxis(totalstrlenmeters, false);

        document.getElementById('axis-extension').classList.add('none')
        document.getElementById('media-boundary').classList.add('none')
        document.getElementById('media-vrange').classList.add('none')
        
        pulseWaveButton.classList.remove('none')
        document.getElementById('resultant-wave').classList.remove('none')
        document.getElementById('slidercover').classList.remove('hide')
        
        draggablecover.classList.remove('none')
        draggablecoversum.classList.remove('none')
        document.getElementById('media-boundary-sum').classList.add('none')

        document.getElementById('container-main').classList.remove('side-by-side')
        medium.classList.remove('relative')
        mediumreflected.classList.remove('relative')
        mediumreflected.classList.remove('tube-gap')
        document.getElementById('analytics').classList.add('none')
    }
    else {
        datapoints = 120
        await resetWave()
        resetSliderCover()
        document.documentElement.style.setProperty('--datapoints',  `${datapoints}`);
        const containermain = document.getElementById('container-main')
        document.getElementById('axis-extension').classList.remove('none')
        document.getElementById('media-boundary').classList.remove('none')
        document.getElementById('media-vrange').classList.remove('none')

        document.getElementById('wave2').classList.add('none')
        document.getElementById('medium-properties').classList.add('none')
        document.getElementById('slidercover').classList.add('hide')
        document.getElementById('stringlenwrapper').classList.add('none')
        
        containermain.classList.add('side-by-side')
        medium.classList.add('relative')
        mediumreflected.classList.add('relative')
        mediumreflected.classList.add('tube-gap')

        document.getElementById('v-box').textContent = `${v} m/s`;
        document.getElementById('v2-box').textContent = `${v2} m/s`;
        await generateAxis(totalstrlenmeters, true);
    }
    
    if (e.target.id === 'inf-wave') {
        document.getElementById('slidercover').classList.add('hide')
        document.getElementById('wave2').classList.remove('none')
        document.getElementById('stringlenwrapper').classList.add('none')
        document.getElementById('pulsewidth-parameter').classList.add('none')
        document.getElementById('medium-properties').classList.add('none')
    }
    else if (e.target.id === 'med-wave') {
        document.getElementById('resultant-wave').classList.add('none')
        document.getElementById('pulsewidth-parameter').classList.add('none')
        pulseWaveButton.classList.add('none')
        document.getElementById('analytics').classList.remove('none')

        medium.style.backgroundColor = `rgba(49, 90, 226, ${0.35 - (0.018)*v})`
        mediumreflected.style.backgroundColor = `rgba(226, 90, 49, ${0.35 - (0.018)*v2})`
    }
    else if (e.target.id === 'transmit') {
        document.getElementById('resultant-wave').classList.remove('none')
        document.getElementById('pulsewidth-parameter').classList.remove('none')
        pulseWaveButton.classList.remove('none')

        draggablecover.classList.add('none')
        draggablecoversum.classList.add('none')
        document.getElementById('media-boundary-sum').classList.remove('none')
        document.getElementById('analytics').classList.add('none')

        medium.style.backgroundColor = `rgba(49, 90, 226, ${(0.018)*v})`
        mediumreflected.style.backgroundColor = `rgba(226, 90, 49, ${(0.018)*v2})`
    }
    else {
        document.getElementById('stringlenwrapper').classList.remove('none')
        document.getElementById('wave2').classList.add('none')
        document.getElementById('pulsewidth-parameter').classList.remove('none')
        document.getElementById('medium-properties').classList.remove('none')
    }
    document.getElementById('container-main').classList.remove('hide')
    document.getElementById('resultant-wave').classList.remove('hide')
});



