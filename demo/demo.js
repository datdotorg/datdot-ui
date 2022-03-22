const message_maker = require('message-maker')
const datdotui = require('..')

var id = 0

// ------------------------------------
const myaddress = `${__filename}-${id++}`
const inbox = {}
const outbox = {}
const recipients = {}
const names = {}
const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

function make_protocol (name) {
  return function protocol (address, notify) {
    names[address] = recipients[name] = { name, address, notify, make: message_maker(myaddress) }
    return { notify: listen, address: myaddress }
  }
}
function listen (msg) {
  console.log('DEMO', { msg })
  const { head, refs, type, data, meta } = msg // receive msg
  inbox[head.join('/')] = msg                  // store msg
  const [from] = head
  // send back ack
  const { notify: from_notify, make: from_make, address: from_address } = names[from]
  from_notify(from_make({ to: from_address, type: 'ack', refs: { 'cause': head } }))
}
// ------------------------------------

const data = {
  plans: {
    title: 'PLANS',
    tab: ['Data', 'Schedule', 'Location', 'Performance', 'Swarm']
  },
  jobs: {
    title: 'JOBS',
    tab: ['Calendar', 'Summary', 'Performance']
  }
}

const element = datdotui({data}, make_protocol('datdot-ui'))

document.body.append(element)