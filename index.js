const draggablecover = document.getElementById("draggablecover")
const draggablecoversum = document.getElementById("draggablecover-sum")
const strlenmeters = document.getElementById('L')
const strlenlambda = document.getElementById('L-lambda')

const medium = document.getElementById("wavemedium")
const mediumreflected = document.getElementById("wavemedium-reflected")
const mediumreflected2 = document.getElementById("wavemedium-reflected2")
const mediumsum = document.getElementById("wavemedium-sum")

const dots = document.getElementsByTagName("dot");
const dots2 = document.getElementsByTagName("dot2");
const dots3 = document.getElementsByTagName("dot3");
const dotsum = document.getElementsByTagName("dotsum");

const axes = document.getElementsByClassName("axis")
const parameters = document.getElementById("parameters")

const sendWaveButton = document.getElementById("sendWaveButton")
const resetWaveButton = document.getElementById("resetWaveButton")
const pulseWaveButton = document.getElementById("pulseWaveButton")

const stopwatch = document.getElementById('stopwatch')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var mode = 'standingwave'
var totalstrlenmeters = 16 //m
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
var dmp = 0
var reflecttwice = 0
var pulsewid = 0.5
var pulseLen = (Math.PI*100)/f
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
    slidercover.type = 'range'
    slidercover.id = 'slidercover'
    slidercover.min = 1
    slidercover.value = 1
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
    loop = false
    await sleep(delay + 100)
    medium.textContent = ''
    mediumreflected.textContent = ''
    mediumreflected2.textContent = ''
    mediumsum.textContent = ''

    t = 0
    u = 0
    if (mode === 'mediacompare' || mode === 'transmission') document.getElementById('v-parameter').classList.remove('unclickable')

    await sleep(delay + 100)
    
    for (let i = 0; i < datapoints; i++) {
        const newdot = document.createElement("dot");
        medium.appendChild(newdot)

        const newdot2 = document.createElement("dot2");
        mediumreflected.appendChild(newdot2)
    }
    if (mode === 'transmission') {
        for (let j = 0; j < 2*datapoints; j++) {
            const newdotsum = document.createElement("dotsum");
            if (j < datapoints) {
                newdotsum.classList.add('str1')
            } else {
                newdotsum.classList.add('str2')
            }
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
    await generateAxis(totalstrlenmeters, false);
    await generateSliderCover();
    await resetSliderCover()
} 
startup();

async function animateStandingWave() {
    let sine = 0
    let sine2 = 0
    let sine0reflected = 0
    let sum1 = 0
    let sum2 = 0
    while(loop == true) {
        let damping = dmp/50000
        t++
        await sleep(delay)
        
        sine = a*Math.sin(((Math.PI*Math.PI))*f*(t/-1000) + phase).toFixed(18) //18 decimal places were tested to give best accuracy
        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,))
        if (!isNaN(sine0reflected)) sine += (reflecttwice*sine0reflected)
            
        dots[0].style.translate = `0rem ${sine}rem`
        dots2[indexOfLastDot].style.translate = `0rem ${reflect*sine2}rem`

        if (dmp === 0) {
            for (let i = indexOfLastDot; i > 0; i--) {    
                dots[i].style.translate = dots[i-1].style.translate
            }
            for (let i = 0; i < indexOfLastDot; i++) {
                dots2[i].style.translate = dots2[i+1].style.translate
            }
        }

        else {
            for (let i = indexOfLastDot; i > 0; i--) {  
                let dampedsine = parseFloat(dots[i-1].style.translate.slice(4,)) * Math.exp(-(i*damping))
                if (isNaN(dampedsine)) continue
                dots[i].style.translate = `0rem ${dampedsine}rem`
            }
            for (let i = 0; i < indexOfLastDot; i++) {
                let dampedsine = parseFloat(dots2[i+1].style.translate.slice(4,)) * Math.exp(-(i*damping))
                if (isNaN(dampedsine)) continue
                dots2[i].style.translate = `0rem ${dampedsine}rem`
            }
        }
        
        for (let i = 0; i < indexOfLastDot+1; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(4,))
            sum2 = parseFloat(dots2[i].style.translate.slice(4,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0rem ${sum}rem`
        }
        //double interference
        if (reflecttwice != 0) {
            sine0reflected = parseFloat(dots2[0].style.translate.slice(4,))
        }
    }
}
async function animateStandingWavePulse() {
    tplus = 0
    pulseLen = (pulsewid*Math.PI*200)/f
    if (loop) {
        t = 0
        return
    }
    let sine = 0
    let sine2 = 0
    let sum1 = 0
    let sum2 = 0
    loop = true;
    while(loop == true) {
        if (tplus > 2*indexOfLastDot ) {
            t = 0
            tplus = 0
            loop = false
            sendWaveButton.classList.remove('unclickable')
            return
        }
        let damping = dmp/50000
        await sleep(delay)
        
        if (t < pulseLen) {
            t++
            sine = a*Math.sin(((Math.PI*Math.PI))*f*(t/-1000)).toFixed(18)
            dots[0].style.translate = `0rem ${sine}rem`
        }
        else {
            dots[0].style.translate = `0rem 0em`
            tplus++
        }

        if (reflecttwice != 0) {
            tplus = sine = 0
            let sine0reflected = parseFloat(dots2[0].style.translate.slice(4,))
            if (!isNaN(sine0reflected)) {
                sine += (reflecttwice*sine0reflected)
                dots[0].style.translate = `0rem ${sine}rem`
            }
        }

        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,))
        if (isNaN(sine2)) sine2 = 0
        dots2[indexOfLastDot].style.translate = `0rem ${reflect*sine2}rem`


        if (dmp === 0) {
            for (let i = indexOfLastDot; i > 0; i--) {    
                dots[i].style.translate = dots[i-1].style.translate
            }
            for (let i = 0; i < indexOfLastDot; i++) {
                dots2[i].style.translate = dots2[i+1].style.translate
            }
        }

        else {
            for (let i = indexOfLastDot; i > 0; i--) {  
                let dampedsine = parseFloat(dots[i-1].style.translate.slice(4,)) * Math.exp(-(i*damping))
                if (isNaN(dampedsine)) continue
                dots[i].style.translate = `0rem ${dampedsine}rem`
            }
            for (let i = 0; i < indexOfLastDot; i++) {
                let dampedsine = parseFloat(dots2[i+1].style.translate.slice(4,)) * Math.exp(-(i*damping))
                if (isNaN(dampedsine)) continue
                dots2[i].style.translate = `0rem ${dampedsine}rem`
            }
        }
        
        for (let i = 0; i < indexOfLastDot+1; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(4,))
            sum2 = parseFloat(dots2[i].style.translate.slice(4,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0rem ${sum}rem`
        }
    }
}
async function animateCollision() {
    var sine = 0
    var sine2 = 0
    var sum1 = 0
    var sum2 = 0
    const reflect = -1 //fixed end = -1, free end = 1

    while(loop == true) {
        await sleep(delay)
        t += 1
        sine = a*Math.sin(((Math.PI*Math.PI))*f*(t/-1000) + phase).toFixed(18)
        sine2 = a2*Math.sin(((Math.PI*Math.PI))*f2*(t/-1000) + phase2).toFixed(18) 

        dots[0].style.translate = `0rem ${sine}rem`
        dots2[indexOfLastDot].style.translate = `0rem ${sine2}rem`

        
        for (let i = indexOfLastDot; i > 0; i--) {    
            dots[i].style.translate = dots[i-1].style.translate
        }
        for (let i = 0; i < indexOfLastDot; i++) {
            dots2[i].style.translate = dots2[i+1].style.translate
        }

        
        
        for (let i = 0; i <= indexOfLastDot; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(4,))
            sum2 = parseFloat(dots2[i].style.translate.slice(4,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0rem ${sum}rem`
        }
    }
}
async function animateMedia() {
    document.getElementById('v-parameter').classList.add('unclickable')
    const starttime = Date.now() //stopwatch
    while (loop === true) {
        //stopwatch
        if (u <= 0) {
            let stopwatchtime = ((Date.now() - starttime)/1000).toFixed(2)
            stopwatch.textContent = stopwatchtime
        }

        await sleep(delay)
        let limit = Math.ceil(v * t); // number of dots reached by the wave
        let limit2 = Math.ceil(v2 * u);

        if (limit > indexOfLastDot) {
            limit = indexOfLastDot;

            if (limit2 > indexOfLastDot) limit2 = indexOfLastDot;

            let y = 0
            for (let i = 0; i < limit2 + 1; i++) {
                let sine2 = -1* a * Math.sin(0.02 * Math.PI * f * (u - y/v2) + phase);
                dots2[i].style.translate = `0rem ${sine2}rem`;
                y++
            }
            u = u + 1/8
        }

        let x = 0
        for (let i = 0; i < limit + 1; i++) {
            let sine = -1 * a * Math.sin(0.02 * Math.PI * f * (t - x/v) + phase);
            dots[i].style.translate = `0rem ${sine}rem`;
            x++
        }
        t = t + 1/8
    }
}
async function animateTransmission() {
    document.getElementById('v-parameter').classList.add('unclickable')
    while (loop === true) {
        let Ar = (v2 - v) / (v2 + v)
        let At = (2 * v2) / (v2 + v)

        await sleep(delay)
        let limit = Math.ceil(v * t); // number of dots reached by the wave
        let limit2 = Math.ceil(v2 * u);
        let limit3 = Math.ceil(v * u);

        if (limit > indexOfLastDot) {
            limit = indexOfLastDot;

            if (limit2 > indexOfLastDot) limit2 = indexOfLastDot;
            if (limit3 > indexOfLastDot) limit3 = indexOfLastDot

            let y = 0
            for (let i = 0; i <= limit2; i++) {
                let sinetransmit = -1* a * Math.sin(0.02 * Math.PI * f * (u - y/v2) + phase);
                sinetransmit *= At
                dots2[i].style.translate = `0rem ${sinetransmit}rem`;
                dotsum[i+indexOfLastDot].style.translate = `0rem ${sinetransmit}rem`;
                y++
            }
            y = 0
            for (let i = indexOfLastDot; i >= indexOfLastDot - limit3; i--) {
                let sinereflected = a * Math.sin(0.02 * Math.PI * f * (u - y/v) + phase);
                sinereflected *= Ar
                dots3[i].style.translate = `0rem ${sinereflected}rem`;
                y++
            }
            u = u + 1/8
        }

        let x = 0
        for (let i = 0; i <= limit; i++) {
            let sine = -1 * a * Math.sin(0.02 * Math.PI * f * (t - x/v) + phase);
            dots[i].style.translate = `0rem ${sine}rem`;
            x++
        }
        t = t + 1/8

        for (let i = 0; i <= indexOfLastDot; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(4,))
            sum2 = parseFloat(dots3[i].style.translate.slice(4,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0rem ${sum}rem`
        }
    }
}
async function animateTransmissionPulse() {
    const pulsewidth = parseInt(pulsewid*Math.PI*32*v/f)
    const pulsewidth2 = parseInt(pulsewid*Math.PI*32*v2/f)
    loop = true
    document.getElementById('v-parameter').classList.add('unclickable')
    pulseWaveButton.classList.add('unclickable')
    
    while (loop === true) {
        let Ar = (v2 - v) / (v2 + v)
        let At = (2 * v2) / (v2 + v)

        await sleep(delay)
        let limit = Math.ceil(v * t); // number of dots reached by the wave
        let limit2 = Math.ceil(v2 * u);
        let limit3 = Math.ceil(v * u);

        if (limit > indexOfLastDot) {
            limit = indexOfLastDot;

            if (limit2 > indexOfLastDot) limit2 = indexOfLastDot
            if (limit3 > indexOfLastDot) limit3 = indexOfLastDot

            let y = 0
            for (let i = 0; i <= limit2; i++) {
                let sinetransmit = -1* a * Math.sin(0.02 * Math.PI * f * (u - y/v2) + phase);
                sinetransmit *= At
                dots2[i].style.translate = `0 ${sinetransmit}rem`;
                dotsum[i+indexOfLastDot].style.translate = `0rem ${sinetransmit}rem`;
                y++
            }
            let endpoint2 = Math.ceil(v2*u)-pulsewidth2
            if (endpoint2 > indexOfLastDot) endpoint2 = indexOfLastDot
            if (limit2 > pulsewidth2) {
                for (let i = 0; i < endpoint2; i++) {
                    dots2[i].style.translate = '0 0';
                    dotsum[i+indexOfLastDot].style.translate = '0 0';
                }
            }

            y = 0
            for (let i = indexOfLastDot; i > indexOfLastDot - limit3; i--) {
                let sinereflected = a * Math.sin(0.02 * Math.PI * f * (u - y/v) + phase);
                sinereflected *= Ar
                dots3[i].style.translate = `0 ${sinereflected}rem`;
                y++
            }
            let endpoint3 = Math.ceil(v*u)-pulsewidth
            if (endpoint3 > indexOfLastDot) endpoint3 = indexOfLastDot
            if (limit3 > pulsewidth) {
                for (let i = indexOfLastDot; i > indexOfLastDot-endpoint3; i--) {
                    dots3[i].style.translate = '0 0';
                }
            }
            u = u + 1/8
            if (endpoint3 === indexOfLastDot && endpoint2 === indexOfLastDot) {
                t = 0
                u = 0
                loop = false
                document.getElementById('v-parameter').classList.remove('unclickable')
                sendWaveButton.classList.remove('unclickable')
                pulseWaveButton.classList.remove('unclickable')
                return
            }
        }
        if (limit3 <= pulsewidth) {
            let x = 0
            for (i = 0; i <= limit; i++) {
                let sine = -1 * a * Math.sin(0.02 * Math.PI * f * (t - x/v) + phase);
                dots[i].style.translate = `0 ${sine}rem`;
                x++
            }
            let endpoint = Math.ceil(v * t)-pulsewidth
            if (endpoint > indexOfLastDot) endpoint = indexOfLastDot
            if (limit > pulsewidth) {
                for (let i = 0; i <= endpoint; i++) dots[i].style.translate = '0 0';
            }
            t = t + 1/8
        }

        for (let i = 0; i <= indexOfLastDot; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(3,))
            sum2 = parseFloat(dots3[i].style.translate.slice(3,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0 ${sum}rem`
        }
    }
}


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
            case 'standingwave':
                animateStandingWave()
                break
            case 'waveinterfere':
                animateCollision()
                break
            case 'mediacompare':
                animateMedia()
                break
            case 'transmission':
                animateTransmission()
                break
        }
        return
    }
});
pulseWaveButton.addEventListener("click", async () => {
    sendWaveButton.classList.add('unclickable')
    switch (mode) {
        case 'standingwave':
            animateStandingWavePulse()
            break
        case 'transmission':
            animateTransmissionPulse()
            break
    }
});

resetWaveButton.addEventListener("click", resetWave);

function createInfoPage(mode) {
    console.log('updating page')
    const infomain = document.getElementById('infomain')
    infomain.textContent = ''
    const newinfopage = document.createElement('object')
    newinfopage.type = 'text/html'
    newinfopage.data = `./simulation-info-html/${mode}.html`
    infomain.appendChild(newinfopage)
}

const simselector = document.getElementById('sim-selector')
simselector.addEventListener(('click'), async (e) => {
    if (e.target.id === 'sim-selector') return
    for (simtype of simselector.getElementsByClassName('sim-type')) {
        if (e.target.id === simtype.id) {
            simtype.classList.add('selected')
            mode = simtype.id
            createInfoPage(mode)
        } else {
            simtype.classList.remove('selected')
        }
    }

    document.getElementById('container-main').classList.add('hide')
    document.getElementById('resultant-wave').classList.add('hide')


    if (e.target.id === 'standingwave' || e.target.id === 'waveinterfere') {
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
        await resetSliderCover()
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

        vbox.textContent = `${v} m/s`;
        v2box.textContent = `${v2} m/s`;
        await generateAxis(totalstrlenmeters, true);
    }
    
    if (e.target.id === 'waveinterfere') {
        document.getElementById('slidercover').classList.add('hide')
        document.getElementById('wave2').classList.remove('none')
        document.getElementById('stringlenwrapper').classList.add('none')
        document.getElementById('pulsewidth-parameter').classList.add('none')
        document.getElementById('medium-properties').classList.add('none')
    }
    else if (e.target.id === 'mediacompare') {
        document.getElementById('resultant-wave').classList.add('none')
        document.getElementById('pulsewidth-parameter').classList.add('none')
        pulseWaveButton.classList.add('none')
        document.getElementById('analytics').classList.remove('none')

        medium.style.backgroundColor = `rgba(49, 90, 226, ${0.35 - (0.018)*v})`
        mediumreflected.style.backgroundColor = `rgba(226, 90, 49, ${0.35 - (0.018)*v2})`
    }
    else if (e.target.id === 'transmission') {
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
    console.log(e.target.id)
});




const fslider = document.getElementById("f")
const fbox = document.getElementById("f-box")
const phaseslider = document.getElementById("phase")
const phasebox = document.getElementById("phase-box")
const ampslider = document.getElementById("amp")
const ampbox = document.getElementById("amp-box")
const pulsewidth = document.getElementById("pulsewidth")
const pulsewidthbox = document.getElementById("pulsewidth-box")
const vslider = document.getElementById("v")
const vbox = document.getElementById("v-box")

const f2slider = document.getElementById("f2")
const f2box = document.getElementById("f2-box")
const phase2slider = document.getElementById("phase2")
const phase2box = document.getElementById("phase2-box")
const amp2slider = document.getElementById("amp2")
const amp2box = document.getElementById("amp2-box")
const v2slider = document.getElementById("v2")
const v2box = document.getElementById("v2-box")

const tslider = document.getElementById("t")
const tbox = document.getElementById("t-box")
const dampslider = document.getElementById('damp')
const dampbox = document.getElementById('damp-box')
const reflectbutton = document.getElementById('reflect')
const reflect2xbutton = document.getElementById('reflect2x')

fslider.addEventListener('input', (e) => {
    f = parseInt(e.target.value)
    fbox.textContent = `${e.target.value} Hz`
    let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints))
    strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`
});
f2slider.addEventListener('input', (e) => {
    f2 = parseInt(e.target.value)
    f2box.textContent = `${e.target.value} Hz`
});

phaseslider.addEventListener('input', (e) => {
    phase = parseInt(e.target.value)*(Math.PI/180)
    phasebox.textContent = `+${e.target.value}°`
});
phase2slider.addEventListener('input', (e) => {
    phase2 = parseInt(e.target.value)*(Math.PI/180)
    phase2box.textContent = `+${e.target.value}°`
});

ampslider.addEventListener('input', (e) => {
    a = parseFloat(e.target.value)
    ampbox.textContent = `${e.target.value}`
});
amp2slider.addEventListener('input', (e) => {
    a2 = parseFloat(e.target.value)
    amp2box.textContent = `${e.target.value}`
});

pulsewidth.addEventListener('input', (e) => {
    pulsewid = parseFloat(e.target.value)
    pulsewidthbox.textContent = `${pulsewid}λ`
});



vslider.addEventListener('input', (e) => {
    v = parseInt(e.target.value)
    vbox.textContent = `${v} m/s`;
    medium.style.backgroundColor = `rgba(49, 90, 226, ${0.35 - (0.018)*v})`

    if (mode === 'transmission') {
        document.documentElement.style.setProperty('--str1', `scale(${3 - v/8})`);
        console.log(document.documentElement.style)
    }
});
v2slider.addEventListener('input', (e) => {
    v2 = parseInt(e.target.value)
    v2box.textContent = `${v2} m/s`;
    mediumreflected.style.backgroundColor = `rgba(226, 90, 49, ${0.35 - (0.018)*v2})`

    if (mode === 'transmission') {
        document.documentElement.style.setProperty('--str2', `scale(${3 - v2/8})`);
        console.log(document.documentElement.style)
    }
});


tslider.addEventListener('input', (e) => {
    tbox.textContent = `${e.target.value}x`;
    delay = 10/parseFloat(e.target.value)
});

dampslider.addEventListener('input', (e) => {
    dmp = e.target.value
    if (dmp == 0) {
        dampbox.textContent = `No damping`;
        return
    }
    dampbox.textContent = `${parseFloat(dmp).toFixed(1)}x damping`;
});
reflectbutton.addEventListener('click', (e) => {
    let clicked = e.target.textContent
    switch (e.target.textContent) {
        case 'Fixed End':
            reflect = -1
            e.target.classList.add('selected')
            draggablecover.classList.remove('free-end')
            draggablecoversum.classList.remove('free-end')
            break
        case 'Free End':
            reflect = 1
            e.target.classList.add('selected')
            draggablecover.classList.add('free-end')
            draggablecoversum.classList.add('free-end')
            break
        case 'None':
            reflect = 0
            e.target.classList.add('selected')
            draggablecover.classList.add('free-end')
            draggablecoversum.classList.add('free-end')
            break
        default:
            return
    }
    for (butt of reflectbutton.getElementsByClassName('parameter-butt')) {
        if (butt.textContent != clicked) butt.classList.remove('selected')
    }
});
reflect2xbutton.addEventListener('click', (e) => {
    let clicked = e.target.textContent
    switch (e.target.textContent) {
        case 'Fixed End':
            reflecttwice = -1
            reflectleft = 
            e.target.classList.add('selected')
            break
        case 'Free End':
            reflecttwice = 1
            e.target.classList.add('selected')
            break
        case 'None':
            reflecttwice = 0
            e.target.classList.add('selected')
            break
        default:
            return
    }
    for (butt of reflect2xbutton.getElementsByClassName('parameter-butt')) {
        if (butt.textContent != clicked) butt.classList.remove('selected')
    }
});

