const toggleInput = document.getElementById('toggleinput')
const toggleText = document.getElementById('light-dark-toggle-text')

//Initial check for browser:
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleInput.checked = true
    document.documentElement.classList.add('dark-mode')
    toggleText.textContent = 'Dark Mode'
}

//Get rid of loading screen
setTimeout(() => {
    document.getElementById('load-screen').style.opacity = 0
    setTimeout(() => {
        document.getElementById('load-screen').remove()
    }, 500)
}, 500)

//Toggle switch functionality:
document.getElementById('toggleinput').addEventListener('click', () => {
    if (toggleInput.checked) {
        document.documentElement.classList.add('dark-mode')
        toggleText.textContent = 'Dark Mode'
    }
    else {
        document.documentElement.classList.remove('dark-mode')
        toggleText.textContent = 'Light Mode'
    }
})
