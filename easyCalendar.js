(function(){
    /* init constructor */
    EasyCalendar = function(selector, options) {
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
         this.outerWrapper = null
         this.wrapper = null
         this.header = null
         this.calendar = null
         this.prevBtn = null
         this.nextBtn = null
         this.level = 0  // level - 0: day, 1: month, 2: year
         let defaultOptions = {
             theme: {
                 borderColor: '#ccc',
                 headerColor: '#000',
                 headerBg: '#ccc',
                 navBg: '#666666',
                 cellBg: '#f2f2f2'
             }
         }
         if(options)
            this.settings = extendSettings(defaultOptions, options)
         else
            this.settings = defaultOptions

         init.call(this)
    }

    /* public methods */

    /* private methods */
    function init() {
        let _ = this
        const randomId = Math.floor(Math.random() * 10000 + 1)

        _.input = document.querySelector(`#${_.id}`)
        // add a parent div to the input
        const parent = _.input.parentNode
        _.outerWrapper = document.createElement('div')
        _.outerWrapper.style.position = 'relative'
        parent.replaceChild(_.outerWrapper, _.input)
        _.outerWrapper.appendChild(_.input)

        _.wrapper = document.createElement('div')
        _.wrapper.className = "easy-calendar-wrapper"
        _.wrapper.id = `easy-calendar-wrapper-${randomId}`

        _.header = document.createElement('div')
        _.header.className = "easy-calendar-header"
        const controls = `<button class="prev"></button> 
                                <span class="title">${this.currentYear} ${this.currentMonth}</span>
                          <button class="next"></button>`
        _.header.innerHTML = controls

        const body = document.createElement('div')
        _.calendar = document.createElement('table')
        _.calendar.className = "easy-calendar"

        // load styles
        const style = document.createElement('style')
        style.textContent = `
            #easy-calendar-wrapper-${randomId} {
                border: 1px solid ${_.settings.theme.borderColor};
            }
            #easy-calendar-wrapper-${randomId} .easy-calendar td {
                background-color: ${_.settings.theme.cellBg};
                border: 1px solid ${_.settings.theme.borderColor};
            }
            #easy-calendar-wrapper-${randomId} .easy-calendar td:hover {
                background-color: ${hexToRGBA(_.settings.theme.cellBg, 0.2)};
            }
            #easy-calendar-wrapper-${randomId} .easy-calendar-header {
                background-color: ${_.settings.theme.headerBg};
                color: ${_.settings.theme.headerColor};
            }
            #easy-calendar-wrapper-${randomId} .easy-calendar-header .title:hover {
                background-color: ${hexToRGBA(_.settings.theme.cellBg, 0.8)};
            }
            #easy-calendar-wrapper-${randomId} .easy-calendar-header button{
                background-color: ${_.settings.theme.navBg};
            }
        `
        
        document.head.appendChild(style)
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
            _.outerWrapper.appendChild(_.wrapper)
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

        // level = month
        if(_.level === 1) {
            _.currentYear-=1
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

        // level = month
        if(_.level === 1) {
            _.currentYear+=1
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

    function hexToRGBA(hex, alpha = 1) { // #FF0000
        let r, g, b
        if(hex.substr(1).length === 3) // if use hex shortcuts
            r = g = b = parseInt(hex.slice(1, 3), 16)
        else if(hex.substr(1).length === 6){
            r= parseInt(hex.slice(1, 3), 16)
            g= parseInt(hex.slice(3, 5), 16)
            b= parseInt(hex.slice(5, 7), 16)
        }

        if(r && g && b)
            return `rgba(${r}, ${g}, ${b}, ${alpha})`
        
        return hex
     }

     function extendSettings(defaultOptions, options) {
        for(let option in options) {
            if(defaultOptions.hasOwnProperty(option)){
                if(typeof defaultOptions[option] === "object"){ 
                     // the second level of settings
                    for(let innerOption in options[option]){
                        if(defaultOptions[option].hasOwnProperty(innerOption))
                            defaultOptions[option][innerOption] = options[option][innerOption]
                    }
                }else{
                    defaultOptions[option] = options[option]
                }
            }
        }
        return defaultOptions
     }

})()