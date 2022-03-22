const debug = require('debug')
const bel = require('bel')
const csjs = require('csjs-inject')
const { isBefore, getYear, getMonth, getDaysInMonth } = require('date-fns')
// widgets
const timelineDays = require('datdot-ui-timeline-days')
// const datepicker = require('datdot-ui-datepicker')
const tab = require('datdot-ui-tab')
const message_maker = require('message-maker')

var id = 0

module.exports = datdotui

function datdotui ({data}, parent_protocol) {
// -----------------------------------
  const myaddress = `${__filename}-${id++}`
  const inbox = {}
  const outbox = {}
  const recipients = {}
  const names = {}
  const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

  const {notify, address} = parent_protocol(myaddress, listen)
  names[address] = recipients['parent'] = { name: 'parent', notify, address, make: message_maker(myaddress) }
  notify(recipients['parent'].make({ to: address, type: 'ready', refs: {} }))
  
  function make_protocol (name) {
    return function protocol (address, notify) {
      console.log('PROTOCOL INIT', { name, address })
      names[address] = recipients[name] = { name, address, notify, make: message_maker(myaddress) }
      return { notify: listen, address: myaddress }
    }
  }
  
  function listen (msg) {
    const { head, refs, type, data, meta } = msg // receive msg
    inbox[head.join('/')] = msg                  // store msg
    const [from] = head
    console.log('DATEPICKER', { type, from, name: names[from].name, msg, data })
    // handlers
  }
// -----------------------------------

  var counter = 0

  const { jobs, plans } = data
  // set init date
  const date = new Date()
  let year = getYear(date)
  // get current month
  let currentMonth = getMonth(date)
  let currentDays = getDaysInMonth(date)
  // get next month
  let nextMonth = currentMonth+1
  let nextDays = getDaysInMonth(new Date(year, nextMonth))
  // store data
  let state = {}
  
  // SUB COMPONENTS
  const timelinedays = timelineDays( {data: null, style: `${css['timeline-days']}` },  make_protocol(`timeline-${counter++}`) )
  // const datepicker1 = datepicker({month1: [year, currentMonth, currentDays], month2: [year, nextMonth, nextDays] }, make_protocol(`datepicker-${counter++}`))

  const weekday = bel`<section class=${css['calendar-weekday']} role="weekday"></section>`
  const weekList= ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  weekList.map( w => weekday.append( bel`<div class=${css['calendar-week']} role="week">${w.slice(0 ,1)}</div>`))


  const element = bel`
  <div class=${css.wrap}>
    <section class=${css["ui-widgets"]}>

      <!--- ui-calendar-timeline-days start -->
      <div class=${css.days}>
        <h2 class=${css.title}>Timline days</h2>
        <div class=${css['calendar-timeline-days']}>${timelinedays}</div>
      </div>
      <!--- // ui-calendar-timeline-days end -->

    </section>
    <div class=${css.terminal}> </div>
  </div>`

  const [, terminal] = element.children
 
  return element

}

const css = csjs`
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #F2F2F2;
  height: 100%;
}
button:active, button:focus {
  outline: dotted 1px #c9c9c9;
}
.wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 75vh 25vh;
  min-width: 520px
}
.terminal {
  background-color: #212121;
  color: #f2f2f2;
  font-size: 13px;
  padding: 0 20px;
  overflow-y: auto;
}
.terminal div {
  margin: 10px 0;
}
.terminal div:last-child {
  color: #FFF500;
  font-weight: bold;
}
.ui-widgets {
  padding: 20px;
  overflow-y: auto;
}
.ui-widgets > div {
  margin-bottom: 30px;
  padding: 10px 20px 20px 20px;
  background-color: #fff;
}
.ui-tab {

}
.ui-tab > nav {
  margin-bottom: 20px;
}
.title {
  color: #008dff;
}
.ui-calendar-header {
}
.custom-header {
  background-color: #f2f2f2;
  max-width: 25%;
  min-width: 225px;
  border-radius: 50px;
}
.custom-header > [class^="calendar-header"] {
  grid-template-rows: 30px;
}
.custom-header > [class^="calendar-header"] h3 {
  font-size: 16px;
}
.calendar-header-fullsize {
}
.days {

}
.calendar-timeline-days {

}
.timeline-days {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(auto-fit, minmax(30px, auto));
  justify-content: left;
  align-items: center;
}
.calendar-section {
  margin-top: 30px;
  font-size: 12px;
}
.calendar-table-days {
  max-width: 210px;
}
.calendar-days {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(7, minmax(30px, auto));
  justify-items: center;
}
.calendar-weekday {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(7, 30px);
  justify-items: center;
}
.calendar-week {
}
.ui-datepicker {

}
`