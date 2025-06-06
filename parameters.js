document.getElementById('wave1').addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"]')) {
        const slider = e.target
        let unit = ''
        switch (slider.id) {
            case 'f':
                f = parseInt(slider.value)
                unit = ' Hz'
                if (mode === 'std-wave') {
                    let len = ((indexOfLastDot+1)*(totalstrlenmeters/datapoints))
                    strlenlambda.textContent = `${(f*len/(4*totalstrlenmeters) ).toFixed(2)}λ`
                }
                break
            case 'phase':
                phase = parseInt(e.target.value)*(PI/180)
                unit = '°'
                break
            case 'amp':
                a = parseFloat(e.target.value)
                unit = ''
                break
            case 'pulsewidth':
                pulsewid = parseFloat(e.target.value)
                unit = 'λ'
                break
        }
        const box = document.getElementById(`${slider.id}-box`)
        box.textContent = slider.value + unit
    }
});

document.getElementById('wave2').addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"]')) {
        const slider = e.target
        let unit = ''
        switch (slider.id) {
            case 'f2':
                f2 = parseInt(slider.value)
                unit = ' Hz'
                break
            case 'phase2':
                phase2 = parseInt(slider.value)*(PI/180)
                unit = '°'
                break
            case 'amp2':
                a2 = parseFloat(slider.value)
                unit = ''
                break
        }
        const box = document.getElementById(`${slider.id}-box`)
        box.textContent = slider.value + unit
    }
});

document.getElementById('media-vrange').addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"]')) {
        const slider = e.target
        switch (slider.id) {
            case 'v':
                v = parseInt(slider.value) / 1.6
                medium.style.backgroundColor = `rgba(49, 90, 226, ${0.35 - (0.018)*v})`
                if (mode === 'transmit') document.documentElement.style.setProperty('--str1', `scale(${3 - v/8})`);
                break
            case 'v2':
                v2 = parseInt(slider.value) / 1.6
                mediumreflected.style.backgroundColor = `rgba(226, 90, 49, ${0.35 - (0.018)*v2})`
                if (mode === 'transmit') document.documentElement.style.setProperty('--str2', `scale(${3 - v2/8})`);
                break
        }
        const box = document.getElementById(`${slider.id}-box`)
        box.textContent = slider.value + '  m/s'
    }
});


document.getElementById("t").addEventListener('input', (e) => {
    document.getElementById("t-box").textContent = `${e.target.value}x`;
    delay = 10/parseFloat(e.target.value)
});

document.getElementById('damp').addEventListener('input', (e) => {
    dmp = parseFloat(e.target.value)
    if (dmp == 0) {
        document.getElementById('damp-box').textContent = `No damping`;
        return
    }
    document.getElementById('damp-box').textContent = `${parseFloat(dmp).toFixed(1)}x damping`;
});
document.getElementById('absorb').addEventListener('input', (e) => {
    absorb = (1 - e.target.value/100).toFixed(1)
    if (absorb == 1.0) {
        document.getElementById('absorb-box').textContent = `Full reflection`;
        return
    }
    document.getElementById('absorb-box').textContent = `${100 - absorb*100}% energy absorption`;
});

document.getElementById('reflect').addEventListener('click', (e) => {
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
    for (butt of document.getElementById('reflect').getElementsByClassName('parameter-butt')) {
        if (butt.textContent != clicked) butt.classList.remove('selected')
    }
});
document.getElementById('reflect2x').addEventListener('click', (e) => {
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
    for (butt of document.getElementById('reflect2x').getElementsByClassName('parameter-butt')) {
        if (butt.textContent != clicked) butt.classList.remove('selected')
    }
});