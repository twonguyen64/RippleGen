const controlWaveButton = document.getElementById("controlWaveButton")
const draggablecover = document.getElementById("draggablecover")
const slidercover = document.getElementById("slidercover")


const medium = document.getElementById("wavemedium")
const mediumreflected = document.getElementById("wavemedium-reflected")
const mediumsum = document.getElementById("wavemedium-sum")

const dots = document.getElementsByTagName("dot");
const dots2 = document.getElementsByTagName("dot2");
const dotsum = document.getElementsByTagName("dotsum");

const parameters = document.getElementById("parameters")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const datapoints = 160
var indexOfLastDot = datapoints - 1

var a = 50
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

        const newdot3 = document.createElement("dotsum");
        mediumsum.appendChild(newdot3)
    }


} generateDots()

const cycles = document.getElementById("cycles")
const freal = document.getElementById("freal")
const fratio = document.getElementById("fratio")

async function animate() {
    var sine = 0
    var sine2 = 0
    var sum = 0
    let reflect = -1 //fixed end = -1, free end = 1
    //var start = new Date();
    var totalcycles = 0
    var previouselapsed = 0
    var previousinterval = 0

    while(loop == true) {
        /*
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
        */
        await sleep(wavespeed)
        t++
        sine = Math.floor(a*Math.sin((-2*Math.PI)*f*(t/1000)))
        dots[0].style.translate = `0px ${sine}px`

        sine2 = parseInt(dots[indexOfLastDot].style.translate.slice(4,))
        dots2[indexOfLastDot].style.translate = `0px ${reflect*sine2}px`

        for (let i = indexOfLastDot; i > 0; i--) {
            dots[i].style.translate = dots[i-1].style.translate
        }

        for (let i = 0; i < indexOfLastDot; i++) {
            dots2[i].style.translate = dots2[i+1].style.translate
        }

        for (let i = 0; i < indexOfLastDot; i++) {
            sum = parseInt(dots2[i].style.translate.slice(4,))
            if (isNaN(sum)) {
                sum = parseInt(dots[i].style.translate.slice(4,))
                }
            else {
                sum += parseInt(dots[i].style.translate.slice(4,))
            }
            dotsum[i].style.translate = `0px ${sum}px`
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