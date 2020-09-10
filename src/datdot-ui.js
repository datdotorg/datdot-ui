const debug = require('debug')
const bel = require('bel')
const csjs = require('csjs-inject')

const datdot_ui_button = require('datdot-ui-button')

module.exports = datdotui

function datdotui (opts) {

  const name = `datdot-ui-${`${Math.random()}`.slice(2)}>`
  const log = debug(name)
  var counter = 0
  var lastmessage
  const state = {}


  for(var buttons = [], i = opts.buttons || 1; i; i--) {
    const btn_name = `btn-${i}`
    const btn_text = i
    const protocol = send => {
      const logger = log.extend(btn_name)
      logger.log = domlog
      state[btn_name] = { send, logger }
      return hear
    }
    const button = datdot_ui_button({ name: btn_name, text: btn_text, protocol })
    buttons.push(button)
  }


  const element = bel`<div class=${css.ui}>
    <div class=${css.buttons}>${buttons}</div>
    <div class=${css.terminal}></div>
  </div>`
  const [buttonfield, terminal] = element.children


  return element


  function hear (message) {
    const { flow: [from, id], type, body } = message
    if (!state[from]) log('unknown sender', bel`<pre>${JSON.stringify(message, 0, 2)}</pre>`)
    state[from].logger(id, type, body)
    if (type === 'click') {
      const text = body
      if (!lastmessage) return lastmessage = { lastname: from, lasttext: text }
      const { lastname, lasttext } = lastmessage
      log('flip buttons:', from, lastname)
      state[from].send({ flow: [name, counter++], type: 'update', body: { key: 'text', value: lasttext } })
      state[lastname].send({ flow: [name, counter++], type: 'update', body: { key: 'text', value: text } })      
      lastmessage = void 0
    }
  }


  function domlog (...args) {
    const [_0, _1, _2, id, _3, type, btn2] = args
    console.log({_0, _1, _2, id, _3, type, btn2})
    var element = bel`<p>${name} ${type} button ${btn2}</p>`
    terminal.append(element)
  }


}
const css = csjs`
body { 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: black;
  height: 100vh;
  width: 100vw;
}
.ui {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  background-color: red;
}
.terminal {
  background-color: grey;
  min-height: 200px;
  max-height: 200px;
  overflow-y: scroll;
  height: auto;
  color: black;
  width: 100%;
}`
