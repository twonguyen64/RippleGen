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
        
        sine = a * Math.sin(PI*PI*f*(t/-1000) + phase).toFixed(18) //18 decimal places were tested to give best accuracy
        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,)) * absorb
        //double interference
        if (reflecttwice != 0) {
            sine0reflected = parseFloat(dots2[0].style.translate.slice(4,))
            if (!isNaN(sine0reflected)) sine += (reflecttwice*sine0reflected) * absorb
        }
            
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
    }
}
async function animateStandingWavePulse() {
    tplus = 0
    pulseLen = (pulsewid*PI*200)/f
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
        if (tplus > 2 * indexOfLastDot ) {
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
            sine = a*Math.sin(((PI*PI))*f*(t/-1000)).toFixed(18)
            dots[0].style.translate = `0rem ${sine}rem`
        }
        else {
            dots[0].style.translate = `0rem 0em`
            tplus++
        }

        if (reflecttwice != 0) {
            tplus = sine = 0
            let sine0reflected = parseFloat(dots2[0].style.translate.slice(4,)) * absorb
            if (!isNaN(sine0reflected)) {
                sine += (reflecttwice*sine0reflected)
                dots[0].style.translate = `0rem ${sine}rem`
            }
        }

        sine2 = parseFloat(dots[indexOfLastDot].style.translate.slice(4,)) * absorb
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
        
        for (let i = 0; i < indexOfLastDot + 1; i++) {
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
    let sine = 0
    let sine2 = 0
    let sum1 = 0
    let sum2 = 0
    const lastdot = indexOfLastDot

    while(loop == true) {
        await sleep(delay)
        t += 1
        sine = a*Math.sin(PI*PI*f*(t/-1000) + phase).toFixed(18)
        sine2 = a2*Math.sin(PI*PI*f2*(t/-1000) + phase2).toFixed(18) 

        dots[0].style.translate = `0rem ${sine}rem`
        dots2[lastdot].style.translate = `0rem ${sine2}rem`

        
        for (let i = lastdot; i > 0; i--) {    
            dots[i].style.translate = dots[i-1].style.translate
        }
        for (let i = 0; i < lastdot; i++) {
            dots2[i].style.translate = dots2[i+1].style.translate
        }

        
        
        for (let i = 0; i <= lastdot; i++) {
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
    const lastdot = indexOfLastDot
    vparameter.classList.add('unclickable')
    const starttime = Date.now()
    let stopwatchtime = 0
    while (loop === true) {
        await sleep(delay)
        if (u <= 0) {
            stopwatch.textContent = stopwatchtime
            stopwatchtime = ((Date.now() - starttime)/12200).toFixed(3)
        }

        let limit = Math.ceil(v * t);
        let limit2 = Math.ceil(v2 * u);

        if (limit > lastdot) {
            limit = lastdot;
            if (limit2 > lastdot) limit2 = lastdot;

            let y = 0
            for (let i = 0; i < limit2 + 1; i++) {
                let sine2 = -1* a * Math.sin(0.02 * PI * f * (u - y/v2) + phase);
                dots2[i].style.translate = `0rem ${sine2}rem`;
                y++
            }
            u = u + 1/8
        }
        let x = 0
        for (let i = 0; i < limit + 1; i++) {
            let sine = -1 * a * Math.sin(0.02 * PI * f * (t - x/v) + phase);
            dots[i].style.translate = `0rem ${sine}rem`;
            x++
        }
        t = t + 1/8
    }
}

async function animateTransmission() {
    const lastdot = indexOfLastDot
    vparameter.classList.add('unclickable')
    while (loop === true) {
        let Ar = (v2 - v) / (v2 + v)
        let At = (2 * v2) / (v2 + v)

        await sleep(delay)
        let limit = Math.ceil(v * t);
        let limit2 = Math.ceil(v2 * u);
        let limit3 = Math.ceil(v * u);

        if (limit > lastdot) {
            limit = lastdot;
            if (limit2 > lastdot) limit2 = lastdot;
            if (limit3 > lastdot) limit3 = lastdot

            let y = 0
            for (let i = 0; i <= limit2; i++) {
                let sinetransmit = -1* a * Math.sin(0.02 * PI * f * (u - y/v2) + phase);
                sinetransmit *= At
                dots2[i].style.translate = `0rem ${sinetransmit}rem`;
                dotsum[i+lastdot].style.translate = `0rem ${sinetransmit}rem`;
                y++
            }
            y = 0
            for (let i = lastdot; i >= lastdot - limit3; i--) {
                let sinereflected = -1* a * Math.sin(0.02 * PI * f * (u - y/v) + phase);
                sinereflected *= Ar
                dots3[i].style.translate = `0rem ${sinereflected}rem`;
                y++
            }
            u = u + 1/8
        }
        let x = 0
        for (let i = 0; i <= limit; i++) {
            let sine = -1 * a * Math.sin(0.02 * PI * f * (t - x/v) + phase);
            dots[i].style.translate = `0rem ${sine}rem`;
            x++
        }
        t = t + 1/8

        for (let i = 0; i <= lastdot; i++) {
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
    const lastdot = indexOfLastDot
    const pulsewidth = parseInt(pulsewid*PI*32*v/f)
    const pulsewidth2 = parseInt(pulsewid*PI*32*v2/f)
    loop = true
    vparameter.classList.add('unclickable')
    pulseWaveButton.classList.add('unclickable')
    
    while (loop === true) {
        let Ar = (v2 - v) / (v2 + v)
        let At = (2 * v2) / (v2 + v)

        await sleep(delay)
        let limit = Math.ceil(v * t);
        let limit2 = Math.ceil(v2 * u);
        let limit3 = Math.ceil(v * u);

        if (limit > lastdot) {
            limit = lastdot;

            if (limit2 > lastdot) limit2 = lastdot
            if (limit3 > lastdot) limit3 = lastdot

            let y = 0
            for (let i = 0; i <= limit2; i++) {
                let sinetransmit = -1* a * Math.sin(0.02 * PI * f * (u - y/v2) + phase);
                sinetransmit *= At
                dots2[i].style.translate = `0 ${sinetransmit}rem`;
                dotsum[i+lastdot].style.translate = `0rem ${sinetransmit}rem`;
                y++
            }
            let endpoint2 = Math.ceil(v2*u)-pulsewidth2
            if (endpoint2 > lastdot) endpoint2 = lastdot
            if (limit2 > pulsewidth2) {
                for (let i = 0; i < endpoint2; i++) {
                    dots2[i].style.translate = '0 0';
                    dotsum[i+lastdot].style.translate = '0 0';
                }
            }

            y = 0
            for (let i = lastdot; i > lastdot - limit3; i--) {
                let sinereflected = -1*  a * Math.sin(0.02 * PI * f * (u - y/v) + phase);
                sinereflected *= Ar
                dots3[i].style.translate = `0 ${sinereflected}rem`;
                y++
            }
            let endpoint3 = Math.ceil(v*u)-pulsewidth
            if (endpoint3 > lastdot) endpoint3 = lastdot
            if (limit3 > pulsewidth) {
                for (let i = lastdot; i > lastdot-endpoint3; i--) {
                    dots3[i].style.translate = '0 0';
                }
            }
            u = u + 1/8
            if (endpoint3 === lastdot && endpoint2 === lastdot) {
                t = 0
                u = 0
                loop = false
                vparameter.classList.remove('unclickable')
                sendWaveButton.classList.remove('unclickable')
                pulseWaveButton.classList.remove('unclickable')
                return
            }
        }
        if (limit3 <= pulsewidth) {
            let x = 0
            for (i = 0; i <= limit; i++) {
                let sine = -1 * a * Math.sin(0.02 * PI * f * (t - x/v) + phase);
                dots[i].style.translate = `0 ${sine}rem`;
                x++
            }
            let endpoint = Math.ceil(v * t)-pulsewidth
            if (endpoint > lastdot) endpoint = lastdot
            if (limit > pulsewidth) {
                for (let i = 0; i <= endpoint; i++) dots[i].style.translate = '0 0';
            }
            t = t + 1/8
        }

        for (let i = 0; i <= lastdot; i++) {
            let sum = 0
            sum1 = parseFloat(dots[i].style.translate.slice(3,))
            sum2 = parseFloat(dots3[i].style.translate.slice(3,))
            if (!isNaN(sum1)) sum += sum1
            if (!isNaN(sum2)) sum += sum2
            dotsum[i].style.translate = `0 ${sum}rem`
        }
    }
}