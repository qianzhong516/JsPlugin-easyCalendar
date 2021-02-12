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
         this.currentMonth = this.months[this.currentMonthIdx]
         this.currentYear = currentYear
         this.id = selector
         init.call(this)
    }

    /* public methods */

    /* private methods */
    function init() {
        let _ = this
        let input = document.querySelector(`#${_.id}`)
        input.style.position = 'relative'
        let html = `<div id="easy-calendar-wrapper">
                        <div id="easy-calendar-header">
                            <button class="prev"><i class="fas fa-chevron-left"></i></button> 
                                <span class="title">${this.currentYear} ${this.currentMonth}</span>
                            <button class="next"><i class="fas fa-chevron-right"></i></button> 
                        </div>
                        <div>
                            <table id="easy-calendar">
                                <tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>
                            </table>
                        </div>
                    </div>`

        // mount calendar onto body
        document.querySelector('body').insertAdjacentHTML('beforeend', html)
        displayDays.call(_)

        /* bind click event to button controls */
        const prevBtn = document.querySelector('#easy-calendar-header .prev')
        // don't bind any argument with prevHandler, because it will be bound to the handler forever
        prevBtn.addEventListener('click', prevHandler.bind(_))

    }

    function prevHandler() {
        let _ = this
        // year must be calculated before monthIdx
        _.currentYear = _.currentMonthIdx > 0 ? _.currentYear : _.currentYear - 1 
        _.currentMonthIdx = _.currentMonthIdx > 0 ? _.currentMonthIdx - 1 : 11
        _.currentMonth = _.months[_.currentMonthIdx]
        displayDays.call(_)
        updateTitle.call(_)
    }

    function displayDays() {
        const calendarTable = document.querySelector('#easy-calendar tbody')
        console.log('displayDays()', 'MonthIdx: ', this.currentMonthIdx, 'currentYear: ', this.currentYear)
        const days = calcDaysInMonth(this.currentMonthIdx, this.currentYear)
        let html = ""

        // remove existing content
        const content = calendarTable.querySelectorAll('.content')
        if(content.length){
            content.forEach(row => {
                // console.log(row)
                row.remove()
            })
        }
      
        // append days content
        for(let i=0; i<days; i++){
            if(i%7 === 0 && i>=7){
                html=`<tr class="content">${html}</tr>`
                calendarTable.insertAdjacentHTML('beforeend', html)
                html=""
            }
            html+=`<td>${i+1}</td>`        
        } 

        // append the last row
        html=`<tr class="content">${html}</tr>` 
        calendarTable.insertAdjacentHTML('beforeend', html)
    }

    function updateTitle() {
        const calendarTitle = document.querySelector('#easy-calendar-header .title')
        calendarTitle.textContent = `${this.currentYear} ${this.currentMonth}`
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