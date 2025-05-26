const controlWaveButton = document.getElementById("controlWaveButton")
const draggablecover = document.getElementById("draggablecover")
const draggablecoversum = document.getElementById("draggablecover-sum")
const strlenmeters = document.getElementById('L')
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

const totalstrlenmeters = 4 //m
const gapdotdistance = 0.3 //rem, (dot width + dot gap)
const datapoints = 160
var indexOfLastDot = datapoints - 1

var a = 2
var f = 3.1416
var omega = (2*Math.PI)*f
var wavespeed = 10

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


}

function generateAxis(totalMeters) {
    const axes = document.getElementsByClassName("axis")
    console.log(axes)
    for (const axis of axes) {
        axis.textContent = ''
        let mrk1multiplier = 1
        for (let i = 0; i < 15; i++) {
            if ((i+1)%4 === 0) {
                const mrk = document.createElement('mrk1')
                const n = document.createElement('n')
                n.textContent = `${(totalMeters/4)*mrk1multiplier++}m`
                axis.appendChild(mrk)
                mrk.appendChild(n)
                continue
            }
            const mrk = document.createElement('mrk2')
            axis.appendChild(mrk)
            
            if ((i+1)%2 === 0) {
                const n = document.createElement('n')
                n.textContent = `${(totalMeters/4)*(mrk1multiplier-1) + (totalMeters/8)}`
                mrk.appendChild(n)
            }
        }
    }
}

function generateSliderCover() {
    const slidercover = document.createElement("input")
    slidercover.type = 'range'
    slidercover.id = 'slidercover'
    slidercover.min = 1
    slidercover.value = 1
    slidercover.max = `${gapdotdistance+ 1 + (datapoints/2)*gapdotdistance}`
    slidercover.step = `${gapdotdistance}`

    slidercover.addEventListener("input", () => {
        let value = slidercover.value
        
        indexOfLastDot = datapoints - Math.ceil((value-1)/gapdotdistance) //minus 1 just in case
        if (indexOfLastDot > datapoints - 1) indexOfLastDot = datapoints - 1

        draggablecover.style.width = `${value}rem`
        draggablecoversum.style.width = `${value}rem`
        let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints)).toFixed(3)
        //if len = one of the tick marks, then make it equal to that value
        strlenmeters.textContent = `${len}m`
    });

    document.getElementById('container-main').appendChild(slidercover)
}
/*STARTUP*/
generateDots();
generateAxis(totalstrlenmeters);
generateSliderCover();

async function animate() {
    var sine = 0
    var sine2 = 0
    var sum = 0
    let reflect = -1 //fixed end = -1, free end = 1
    


    while(loop == true) {
        await sleep(wavespeed)
        t++
        sine = a*Math.sin((-2*Math.PI)*f*(t/1000)).toFixed(18) //18 decimal places were tested to give best accuracy
        dots[0].style.translate = `0rem ${sine}rem`

        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,))
        dots2[indexOfLastDot].style.translate = `0rem ${reflect*sine2}rem`

        for (let i = indexOfLastDot; i > 0; i--) {
            dots[i].style.translate = dots[i-1].style.translate
        }

        for (let i = 0; i < indexOfLastDot; i++) {
            dots2[i].style.translate = dots2[i+1].style.translate
        }

        for (let i = 0; i < indexOfLastDot; i++) {
            sum = parseFloat(dots2[i].style.translate.slice(4,))
            if (isNaN(sum)) {
                sum = parseFloat(dots[i].style.translate.slice(4,))
                }
            else {
                sum += parseFloat(dots[i].style.translate.slice(4,))
            }
            dotsum[i].style.translate = `0rem ${sum}rem`
        }
        
    }
}

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
    mediumsum.textContent = ''
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