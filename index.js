const controlWaveButton = document.getElementById("controlWaveButton")

const slidercover = document.getElementById('slidercover')
const draggablecover = document.getElementById("draggablecover")
const draggablecoversum = document.getElementById("draggablecover-sum")
const strlenmeters = document.getElementById('L')
const medium = document.getElementById("wavemedium")
const mediumreflected = document.getElementById("wavemedium-reflected")
const mediumsum = document.getElementById("wavemedium-sum")

const dots = document.getElementsByTagName("dot");
const dots2 = document.getElementsByTagName("dot2");
const dotsum = document.getElementsByTagName("dotsum");

const axes = document.getElementsByClassName("axis")

const parameters = document.getElementById("parameters")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var totalstrlenmeters = 10 //m
const gapdotdistance = 0.3 //rem, (dot width + dot gap)
var divisions = 16
var datapoints = 160
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
    for (const axis of axes) {
        axis.textContent = ''
        let mrk1multiplier = 1
        for (let i = 1; i < divisions; i++) {
            if (i%4 === 0) {
                const mrk = document.createElement('majmrk')
                const n = document.createElement('n')
                n.textContent = `${(totalMeters/4)*mrk1multiplier++}m`
                axis.appendChild(mrk)
                mrk.appendChild(n)
                continue
            }
            const mrk = document.createElement('minmrk')
            axis.appendChild(mrk)
            
            if (i%2 === 0) {
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
    strlenmeters.textContent = `${totalstrlenmeters}m`

    slidercover.addEventListener("input", () => {
        let value = slidercover.value   
        indexOfLastDot = parseInt(datapoints - (value-1)/gapdotdistance) //minus 1 just in case
        if (indexOfLastDot > datapoints - 1) indexOfLastDot = datapoints - 1

        draggablecover.style.width = `${value}rem`
        draggablecoversum.style.width = `${value}rem`
        let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints)).toFixed(2)
        strlenmeters.textContent = `${len}m`

        let round = datapoints/(divisions)
        let num = Math.ceil((indexOfLastDot-(round/2)) / round) * round 
        
        if (num < indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 0) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[num/2 - 1].style.visibility = 'hidden'
                }
            }
        }
        if (num > indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 1) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[Math.floor(num/2) - 1].style.visibility = ''
                }
            }
        }
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