const controlWaveButton = document.getElementById("controlWaveButton")
const draggablecover = document.getElementById("draggablecover")
const slidercover = document.getElementById("slidercover")
const dots = document.getElementsByTagName("dot");
const dots2 = document.getElementsByTagName("dot2");
const numdatapoints = document.getElementById("numdatapoints")

const medium = document.getElementById("wavemedium")
const mediumreflected = document.getElementById("wavemedium-reflected")

const parameters = document.getElementById("parameters")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const datapoints = 160
var indexOfLastDot = datapoints - 1

var a = 70
var f = 20
var omega = (2*Math.PI)*f
var wavespeed = 10
const minwavespeed = 10

var loop = true
var t = 0

function generateDots() {
    for (let i = 0; i < datapoints; i++) {
        const newdot = document.createElement("dot");
        medium.appendChild(newdot)

        const newdot2 = document.createElement("dot2");
        mediumreflected.appendChild(newdot2)
    }


} generateDots()

const cycles = document.getElementById("cycles")
const freal = document.getElementById("freal")
const fratio = document.getElementById("fratio")

async function animate() {
    var sine = 0
    var sine2 = 0
    var start = new Date();
    var totalcycles = 0
    var previouselapsed = 0
    var previousinterval = 0

    while(loop == true) {
        if (sine === 0) {
            var elapsed = new Date() - start;
            var interval = elapsed - previouselapsed
            console.log(previousinterval)

        if (interval > 1+previousinterval/1.2) {
            var freq = (1/(interval/1000)).toFixed(2)
            cycles.textContent = `${++totalcycles}`
            freal.textContent = `${freq} Hz`
            fratio.textContent = f / freq
            
            previouselapsed = elapsed
            previousinterval = interval
            }
        }

        await sleep(wavespeed)
        t++
        sine = Math.floor(a*Math.sin((-2*Math.PI)*f*(t/1000)))
        dots[0].style.translate = `0px ${sine}px`

        sine2 = parseInt(dots[indexOfLastDot].style.translate.slice(3,))
        dots2[indexOfLastDot].style.translate = `0px ${-sine2}px`

        for (let i = indexOfLastDot; i > 0; i--) {
            dots[i].style.translate = dots[i-1].style.translate
        }

        for (let i = 0; i < datapoints - 1; i++) {
            dots2[i].style.translate = dots2[i+1].style.translate
        }
    }
}

slidercover.addEventListener("input", () => {
    let value = slidercover.value
    draggablecover.style.width = `${value}px`
    indexOfLastDot = datapoints - Math.ceil((value-18)/4) + 1 //minus 1 just in case
    if (indexOfLastDot > 159) indexOfLastDot = 159
});


controlWaveButton.addEventListener("click", () => {
    if (controlWaveButton.textContent == "END WAVE") {
        loop = false;
        controlWaveButton.textContent = "SEND WAVE";
    }
    else {
        loop = true;
        animate()
        controlWaveButton.textContent = "END WAVE";
    }
});

resetWaveButton.addEventListener("click", async () => {
    loop = false
    await sleep(wavespeed + 100)
    medium.textContent = ''
    mediumreflected.textContent = ''
    t = 0
    await sleep(wavespeed + 100)
    generateDots()
    controlWaveButton.textContent = "SEND WAVE";
});

const fslider = document.getElementById("f")
const fbox = document.getElementById("f-box")
const vslider = document.getElementById("v")
const vbox = document.getElementById("v-box")

fslider.addEventListener('input', (e) => {
    fbox.value = e.target.value;
    f = e.target.value
});
fbox.addEventListener('keydown', (e) => {
    if (e.key === "Enter") vslider.value = e.target.value;
    f = e.target.value
});

vslider.addEventListener('input', (e) => {
    vbox.value = e.target.value;
    wavespeed = e.target.value
});
vbox.addEventListener('keydown', (e) => {
    if (e.key === "Enter") vslider.value = e.target.value;
    wavespeed = e.target.value
});