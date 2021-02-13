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

        // don't bind any argument with prevHandler here, 
        // because it will be bound to the handler forever
        if(_.prevBtn)
            _.prevBtn.addEventListener('click', prevHandler.bind(_))
        
        if(_.nextBtn)
            _.nextBtn.addEventListener('click', nextHandler.bind(_))
        
        // show calendar
         _.input.addEventListener('focus', () => {
            document.querySelector('body').appendChild(_.wrapper)
         })

        // remove calendar when clicking on the blank area
        window.addEventListener('click', removeCalendar.bind(_))

        // when click on the wrapper, stop event propagating to the window 
        _.wrapper.addEventListener('click', (e) => {
            e.stopPropagation()
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
            if(_.level === 0){ // level = day
                const dd = +e.target.textContent > 9 ? e.target.textContent : `0${e.target.textContent}`
                const mm = _.currentMonthIdx > 8 ? _.currentMonthIdx+1 : `0${_.currentMonthIdx+1}` 
                const yy = _.currentYear
                _.input.value = [dd, mm, yy].join('/')
            }
            if(_.level === 1){ // level = month
                const monthLiteral = e.target.textContent
                _.currentMonthIdx = _.months.indexOf(monthLiteral)
                _.currentMonth = _.months[_.currentMonthIdx]
                _.level-=1 // navigate back to day level
                updateTitle.call(_)
                loadTableContent.call(_)
            }
            if(_.level === 2){ // level = year
                _.level-=1
                _.currentYear = +e.target.textContent
                updateTitle.call(_)
                loadTableContent.call(_)
            }
        }
    }

    function levelHandler() {
        let _ = this
        _.level = (_.level + 1) % 3
        loadTableContent.call(_)
        updateTitle.call(_)
    }

    function prevHandler() {
        let _ = this

        // level = day
        if(_.level === 0) {
            // year must be calculated before monthIdx
            _.currentYear = _.currentMonthIdx > 0 ? _.currentYear : _.currentYear - 1 
            _.currentMonthIdx = _.currentMonthIdx > 0 ? _.currentMonthIdx - 1 : 11
            _.currentMonth = _.months[_.currentMonthIdx]
        }

        // level = year
        if(_.level === 2) {
            _.currentYear-=11
        }

        loadTableContent.call(_)
        updateTitle.call(_)
    }

    function nextHandler() {
        let _ = this

        // level = day
        if(_.level === 0) {
            _.currentYear = _.currentMonthIdx < 11 ? _.currentYear : _.currentYear + 1
            _.currentMonthIdx = _.currentMonthIdx < 11 ? _.currentMonthIdx + 1 : 0
            _.currentMonth = _.months[_.currentMonthIdx]
        }

        // level = year
        if(_.level === 2) {
            _.currentYear+=11
        }

        loadTableContent.call(_)
        updateTitle.call(_)
    }

    function loadTableContent() {
        let _ = this 
        _.calendar.innerHTML = ""

        // level = day
        if(_.level === 0){ 
            const tableHeader = `<tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr>`
            _.calendar.innerHTML = tableHeader
    
            const days = calcDaysInMonth(_.currentMonthIdx, _.currentYear)
            let html = ""
          
            // append days content
            const col = 7
            for(let i=0; i<days; i++){
                if(i%col === 0)
                    html+="<tr>"
                
                html+=`<td>${i+1}</td>`     
                
                if(i%col === col-1)
                    html+="</tr>"
            } 
            _.calendar.insertAdjacentHTML('beforeend', html)
        }
        
        // level = month
        if(_.level === 1) { 
            const col = 4 // 4 columns in a row
            let html = ""
            for(let i=0; i<12; i++) {
                if(i%col === 0)
                    html+="<tr>"

                html+=`<td>${_.months[i]}</td>`

                if(i%col === 3)
                    html+="</tr>"
            }
            _.calendar.innerHTML = html
        }

        // level = year, 12-year range
        if(_.level === 2) {
            const col = 4
            let html = ""
            for(let i=0; i<12; i++){
                if(i%col === 0)
                    html+="<tr>"
                html+=`<td>${_.currentYear+i}</td>`
                if(i%col === 3)
                    html+="</tr>"
            }
            _.calendar.innerHTML = html
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
            calendarTitle.textContent = `${_.currentYear} - ${_.currentYear+11}`
        }
    }

    function removeCalendar(e){
        let _ = this
        // remove calendar if e.target is not the input
        if(!e.target.isEqualNode(_.input)){
            _.wrapper.remove()
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