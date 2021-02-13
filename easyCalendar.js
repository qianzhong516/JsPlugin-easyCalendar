(function(){
    /* init constructor */
    EasyCalendar = function(selector) {
         const today = new Date()
         const currentDate = today.getDate()
         const currentMonth = today.getMonth() // 0 - 11
         const currentYear = today.getFullYear()

         this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
         this.currentDate = currentDate
         this.currentMonthIdx = currentMonth
         this.currentMonth = this.months[currentMonth]
         this.currentYear = currentYear
         this.id = selector
         this.input = null
         this.wrapper = null
         this.header = null
         this.calendar = null
         this.prevBtn = null
         this.nextBtn = null
         this.level = 0  // level - 0: day, 1: month, 2: year
         init.call(this)
    }

    /* public methods */

    /* private methods */
    function init() {
        let _ = this
        _.input = document.querySelector(`#${_.id}`)
        _.input.style.position = 'relative'

        _.wrapper = document.createElement('div')
        _.wrapper.id = "easy-calendar-wrapper"

        _.header = document.createElement('div')
        _.header.id = "easy-calendar-header"
        const controls = `<button class="prev"><i class="fas fa-chevron-left"></i></button> 
                                <span class="title">${this.currentYear} ${this.currentMonth}</span>
                          <button class="next"><i class="fas fa-chevron-right"></i></button>`
        _.header.innerHTML = controls

        const body = document.createElement('div')
        _.calendar = document.createElement('table')
        _.calendar.id = "easy-calendar"

        body.appendChild(_.calendar)

        _.wrapper.appendChild(_.header)
        _.wrapper.appendChild(body)

        // load table content
        loadTableContent.call(_)
        initializeEvents.call(_)
    }

    function initializeEvents() {
        let _ = this
        _.prevBtn = _.header.querySelector('.prev')
        _.nextBtn = _.header.querySelector('.next')

        // don't bind any argument with prevHandler, because it will be bound to the handler forever
        if(_.prevBtn)
            _.prevBtn.addEventListener('click', prevHandler.bind(_))
        
        if(_.nextBtn)
            _.nextBtn.addEventListener('click', nextHandler.bind(_))
        
         _.input.addEventListener('focus', () => {
            // mount calendar onto body
            document.querySelector('body').appendChild(_.wrapper)

            // remove calendar event
            window.addEventListener('click', function removeCalendar(e){
                // remove calendar if e.target is not a child of wrapper, or the input
                if( !_.wrapper.contains(e.target) && !e.target.isEqualNode(_.input) ){
                    _.wrapper.remove()
                    window.removeEventListener('click', removeCalendar, false)
                }
            })
         })

         // select day event
         _.calendar.addEventListener('click', cellClickHandler.bind(_))

         // level navigator event
         const calendarTitle = _.header.querySelector('.title')
         calendarTitle.addEventListener('click', levelHandler.bind(_))
    }

    function cellClickHandler(e) {
        let _ = this
        if(e.target.nodeName === 'TD'){
            if(_.level === 0){
                const dd = +e.target.textContent > 9 ? e.target.textContent : `0${e.target.textContent}`
                const mm = _.currentMonthIdx > 8 ? _.currentMonthIdx+1 : `0${_.currentMonthIdx+1}` 
                const yy = _.currentYear
                _.input.value = [dd, mm, yy].join('/')
            }
        }
    }

    function levelHandler() {
        let _ = this
        _.level = (_.level + 1) % 3
        loadTableContent.call(_)
    }

    function prevHandler() {
        let _ = this
        // year must be calculated before monthIdx
        _.currentYear = _.currentMonthIdx > 0 ? _.currentYear : _.currentYear - 1 
        _.currentMonthIdx = _.currentMonthIdx > 0 ? _.currentMonthIdx - 1 : 11
        _.currentMonth = _.months[_.currentMonthIdx]
        loadTableContent.call(_)
        updateTitle.call(_)
    }

    function nextHandler() {
        let _ = this
        _.currentYear = _.currentMonthIdx < 11 ? _.currentYear : _.currentYear + 1
        _.currentMonthIdx = _.currentMonthIdx < 11 ? _.currentMonthIdx + 1 : 0
        _.currentMonth = _.months[_.currentMonthIdx]
        loadTableContent.call(_)
        updateTitle.call(_)
    }

    function loadTableContent() {
        let _ = this 
        _.calendar.innerHTML = ""

        if(_.level === 0){
            const tableHeader = `<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>`
            _.calendar.innerHTML = tableHeader
            const calendarTable = _.calendar.children[0] // select tbody
    
            console.log('loadTableContent()', 'MonthIdx: ', _.currentMonthIdx, 'currentYear: ', _.currentYear)
            const days = calcDaysInMonth(_.currentMonthIdx, _.currentYear)
            let html = ""
          
            // append days content
            for(let i=0; i<days; i++){
                if(i%7 === 0 && i>=7){
                    html=`<tr>${html}</tr>`
                    calendarTable.insertAdjacentHTML('beforeend', html)
                    html=""
                }
                html+=`<td>${i+1}</td>`        
            } 
    
            // append the last row
            html=`<tr>${html}</tr>` 
            calendarTable.insertAdjacentHTML('beforeend', html)
        }

        if(_.level === 1) {

        }

    }

    function updateTitle() {
        let _ = this
        const calendarTitle = _.header.querySelector('.title')

        if(_.level === 0) {
            calendarTitle.textContent = `${_.currentYear} ${_.currentMonth}`
        }else if(_.level === 1){
            calendarTitle.textContent = _.currentYear
        }else if(_.level === 2){
            calendarTitle.textContent = `${_.currentYear} - ${_.currentYear+12}`
        }

    }

    /* internal/helper methods */
    function calcDaysInMonth(monthIndex, year) {
        let days

        if(monthIndex%7%2 === 0) // Jan, Mar, May, Aug, Oct
            days = 31
        else if(monthIndex === 6) // Jul
            days = 31
        else if(monthIndex === 1){ // Feb
            // check if is a leap year
            if(year%400 === 0 | (year%4 === 0 && year%100 !== 0))
                days = 29
            else
                days = 28
        }
        else 
            days = 30
    
        return days
    }

})()