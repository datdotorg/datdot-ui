const datdotui = require('..')
localStorage.debug = '*'
const element = datdotui({ buttons: 200 })
document.body.append(element)