

const slidercover = document.getElementById('slidercover')
const draggablecover = document.getElementById("draggablecover")
const draggablecoversum = document.getElementById("draggablecover-sum")
const strlenmeters = document.getElementById('L')
const strlenlambda = document.getElementById('L-lambda')

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

var mode = 'standingwave'
var totalstrlenmeters = 4 //m
const gapdotdistance = 0.3 //rem, (dot width + dot gap)
var divisions = 16
var datapoints = 160
var indexOfLastDot = datapoints - 1

var a = 3
var f = 5
let f2 = 5

var v = 10
let v2 = 5

var delay = 10

var t = 0
var u = 0 //for wavecompare
var loop = true


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
                n.textContent = `${offset+(totalMeters/4)*(mrk1multiplier-1) + (totalMeters/8)}`
                mrk.appendChild(n)
            }
        }
        if (isThereExtension === true && axisnumber === 1) offset += totalMeters
        axisnumber++
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
    strlenlambda.textContent = `${(f).toFixed(2)}λ`

    slidercover.addEventListener("input", () => {
        let value = slidercover.value   
        indexOfLastDot = parseInt(datapoints - (value-1)/gapdotdistance) //minus 1 just in case
        if (indexOfLastDot > datapoints - 1) indexOfLastDot = datapoints - 1


        draggablecover.style.width = `${value}rem`
        draggablecoversum.style.width = `${value}rem`
        let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints)).toFixed(2)
        strlenmeters.textContent = `${len}m`
        strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`

        let round = datapoints/(divisions)
        let num = Math.ceil((indexOfLastDot-(round/2)) / round) * round
        
        if (num < indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 0) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[num/2 - 1].style.opacity= '0'
                }
            }
        }
        if (num > indexOfLastDot) {
            num = num/(datapoints/divisions)
            if (num % 2 === 1) {
                for (const axis of axes) {
                    const ticks = axis.getElementsByTagName('n')
                    ticks[Math.floor(num/2) - 1].style.opacity = ''
                }
            }
        }
    });

    document.getElementById('container-main').appendChild(slidercover)
}

async function resetWave() {
    loop = false
    await sleep(delay + 100)
    medium.textContent = ''
    mediumreflected.textContent = ''
    mediumsum.textContent = ''
    t = 0
    if (mode === 'mediacompare') u = 0
    indexOfLastDot = datapoints - 1
    await sleep(delay + 100)
    
    for (let i = 0; i < datapoints; i++) {
        const newdot = document.createElement("dot");
        medium.appendChild(newdot)

        const newdot2 = document.createElement("dot2");
        mediumreflected.appendChild(newdot2)

        const newdot3 = document.createElement("dotsum");
        mediumsum.appendChild(newdot3)
    }

    controlWaveButton.textContent = "SEND WAVE";
}

/*STARTUP*/
async function startup() {
    await resetWave()
    await generateAxis(totalstrlenmeters, false);
    await generateSliderCover();
} 
startup();

async function animateStandingWave() {
    var sine = 0
    var sine2 = 0
    var sum = 0
    var k = 1 //damping
    const reflect = -1 //fixed end = -1, free end = 1

    while(loop == true) {
        await sleep(delay)
        t += 1
        //k += 0.005
        sine = (a/k)*Math.sin(((Math.PI*Math.PI))*f*(t/-1000)).toFixed(18) //18 decimal places were tested to give best accuracy
        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,))

        /* Another inteference
        let sine0reflected = parseFloat(dots2[0].style.translate.slice(4,))
        if (!isNaN(sine0reflected)) sine += (-0.7*sine0reflected)
        */

        dots[0].style.translate = `0rem ${sine}rem`
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

async function animateMedia() {
    while (loop === true) {
        await sleep(delay)
        let limit = Math.floor(v * t); // number of dots reached by the wave
        let limit2 = Math.floor(v * u);

        if (limit >= indexOfLastDot) {
            limit = indexOfLastDot;

            if (limit2 >= indexOfLastDot) limit2 = indexOfLastDot;

            let y = 0
            for (let i = 0; i < limit2; i++) {
                let sine2 = -1* a * Math.sin(2 * Math.PI * f/100 * (t - (y+indexOfLastDot)/v2));
                dots2[i].style.translate = `0rem ${sine2}rem`;
                y++
            }
            u = u + 1/8
        }

        let x = 0
        for (let i = 0; i < limit; i++) {
            let sine = -1 * a * Math.sin(2 * Math.PI * f/100 * (t - x/v));
            dots[i].style.translate = `0rem ${sine}rem`;
            x++
        }
        t = t + 1/8


    }
}

async function animateCollision() {
    var sine = 0
    var sine2 = 0
    var sum = 0
    var k = 1 //damping
    const reflect = -1 //fixed end = -1, free end = 1

    while(loop == true) {
        await sleep(delay)
        t += 1
        //k += 0.005
        sine = (a/k)*Math.sin(((Math.PI*Math.PI))*f*(t/-1000)).toFixed(18)
        sine2 = (a/k)*Math.sin(((Math.PI*Math.PI))*f2*(t/-1000)).toFixed(18) 

        dots[0].style.translate = `0rem ${sine}rem`
        dots2[indexOfLastDot].style.translate = `0rem ${sine2}rem`

        
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

const controlWaveButton = document.getElementById("controlWaveButton")
const resetWaveButton = document.getElementById("resetWaveButton")

controlWaveButton.addEventListener("click", () => {
    if (controlWaveButton.textContent == "END WAVE") {
        loop = false;
        controlWaveButton.textContent = "SEND WAVE";
    }
    else {
        loop = true;
        controlWaveButton.textContent = "END WAVE";

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
        }
    }
});

resetWaveButton.addEventListener("click", resetWave);

const simselector = document.getElementById('sim-selector')
simselector.addEventListener(('click'), (e) => {
    for (simtype of simselector.getElementsByClassName('sim-type')) {
        if (e.target.id === simtype.id) {
            simtype.classList.add('selected')
            mode = simtype.id
        } else {
            simtype.classList.remove('selected')
        }
    }

    if (e.target.id === 'standingwave' || e.target.id === 'waveinterfere') {
        document.documentElement.style.setProperty('--numberofdots', '160');
        datapoints = 160
        document.getElementById('axis-extension').classList.add('hide')
        document.getElementById('media-vrange').classList.add('hide')
        resetWave()
        generateAxis(totalstrlenmeters, false);

        document.getElementById('resultant-wave').classList.remove('hide')
        document.getElementById('slidercover').classList.remove('hide')
        document.getElementById('container-main').classList.remove('side-by-side')
        medium.classList.remove('relative')
        mediumreflected.classList.remove('relative')
    }
    document.getElementById('f2-parameter').classList.add('hide')
    
    if (e.target.id === 'waveinterfere') {
        document.getElementById('slidercover').classList.add('hide')
        document.getElementById('f2-parameter').classList.remove('hide')
    }
    else if (e.target.id === 'mediacompare') {
        document.documentElement.style.setProperty('--numberofdots', '120');
        datapoints = 120
        resetWave()

        const containermain = document.getElementById('container-main')

        document.getElementById('axis-extension').classList.remove('hide')
        document.getElementById('media-vrange').classList.remove('hide')

        document.getElementById('resultant-wave').classList.add('hide')
        document.getElementById('slidercover').classList.add('hide')
        containermain.classList.add('side-by-side')
        medium.classList.add('relative')
        mediumreflected.classList.add('relative')
        mediumreflected.classList.add('tube-gap')
        
        generateAxis(totalstrlenmeters, true);

        const mediaboundary = document.createElement('div')
            mediaboundary.id = 'mediaboundary'
            containermain.appendChild(mediaboundary)
    }

})


const fslider = document.getElementById("f")
const fbox = document.getElementById("f-box")
const f2slider = document.getElementById("f2")
const f2box = document.getElementById("f2-box")

const tslider = document.getElementById("t")
const tbox = document.getElementById("t-box")

const vslider = document.getElementById("v")
const vbox = document.getElementById("v-box")
const v2slider = document.getElementById("v2")
const v2box = document.getElementById("v2-box")

fslider.addEventListener('input', (e) => {
    f = e.target.value
    fbox.textContent = `${e.target.value} Hz`
    let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints))
    strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`
});

f2slider.addEventListener('input', (e) => {
    f2 = e.target.value
    f2box.textContent = `${e.target.value} Hz`
});
/*
fbox.addEventListener('keydown', (e) => {
    if (e.key === "Enter") vslider.value = e.target.value;
    f = e.target.value
});
*/

vslider.addEventListener('input', (e) => {
    v = e.target.value
    vbox.value = v;
});
v2slider.addEventListener('input', (e) => {
    v2 = e.target.value
    v2box.value = v2;
});


tslider.addEventListener('input', (e) => {
    tbox.value = e.target.value;
    delay = 10/e.target.value 
});
tbox.addEventListener('keydown', (e) => {
    if (e.key === "Enter") tslider.value = e.target.value;
    delay = 10/e.target.value 
});