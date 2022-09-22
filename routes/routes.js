const theWaiters = (waiters,db) => {
    async function defaultRoute(req, res) {
        res.render('index');
    }
    async function addWaiter(req, res) {
        const { name } = req.body;
        if (name == "") {
            req.flash('error', 'Please enter your name');
            res.redirect('/');
        }
        // else if name is not valid
        // regex
        const regex = /^[a-zA-Z]+$/;
        if (regex.test(name) == false) {
            req.flash('error', 'Please enter a valid name');
            res.redirect('/');
        } else {
            await waiters.addWaiter(name);
            const waiter = await waiters.getWaiter(name);
            const user = waiter.name;
            res.redirect(`/waiters/${user}`);
        }
    }

    async function getWaiter(req, res) {
        const userName = req.params.name;
        const waiter = await waiters.getWaiter(userName);
        const getIndividual = await waiters.getIndividualWaiterDays(waiter.id);
        const Monday = getIndividual.includes('monday') ? 'checked' : 'unchecked';
        const Tuesday = getIndividual.includes('tuesday') ? 'checked' : 'unchecked';
        const Wednesday = getIndividual.includes('wednesday') ? 'checked' : 'unchecked';
        const Thursday = getIndividual.includes('thursday') ? 'checked' : 'unchecked';
        const Friday = getIndividual.includes('friday') ? 'checked' : 'unchecked';
        const Saturday = getIndividual.includes('saturday') ? 'checked' : 'unchecked';
        const Sunday = getIndividual.includes('sunday') ? 'checked' : 'unchecked';
        await waiters.getWaiterAvailability(waiter.id);
        res.render('days', {
            userName,
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday
        });
    }

    async function postWaiter(req, res) {
        const  userName  = req.params.name;
        const { days } = req.body;
    
        const getTheWaiter = await waiters.getWaiter(userName);
        const waiterId = getTheWaiter.id;
        // loop through the days 
        for (let i = 0; i < days.length; i++) {
            const day = days[i];        
            const dayId = await db.oneOrNone('select id from theDays where name = $1',[day]);
            console.log(dayId.id);
            const thedayId = dayId.id;
            const checkDay = await db.manyOrNone('select * from theSchedule where waiter_id = $1 and day_id = $2',[waiterId,thedayId]);
            if(checkDay.length == 0){
            const getId = dayId.id;
            console.log(getId);
            
            await waiters.addWaiterAvailability(waiterId, getId);
            }
            
        }
        req.flash('error', 'Working days updated successfully'); 
        await waiters.getWaiterAvailability(waiterId);
        res.redirect(`/waiters/${userName}`);
    }

    async function theReset(req, res) {
        await waiters.reset();
        res.redirect('/admin');
    }

    async function theAdmin(req, res) {
        const selectAlLWaiter = await db.manyOrNone('select waiter_id from theSchedule');
        const selectDayId = await db.manyOrNone('select day_id from theSchedule');
        // !list of names of the waiters
        const waiterNames = await waiters.getAllWaiters();
        const waiterList = [];
        const waiterList3 = [];
        for (let i = 0; i < waiterNames.length; i++) {
            const waiter = waiterNames[i];
              // console.log(waiter);
            const theWaiter = await waiters.getWaiter(waiter);
            // console.log(theWaiter);
            const waiterId = theWaiter.id;
            // console.log(waiterId);
            const getIndividual = await waiters.getIndividualWaiterDays(waiterId);
            const MondayChecked = getIndividual.includes('monday') ? 'checked' : 'unchecked';
            const TuesdayChecked = getIndividual.includes('tuesday') ? 'checked' : 'unchecked';
            const WednesdayChecked = getIndividual.includes('wednesday') ? 'checked' : 'unchecked';
            const ThursdayChecked = getIndividual.includes('thursday') ? 'checked' : 'unchecked';
            const FridayChecked = getIndividual.includes('friday') ? 'checked' : 'unchecked';
            const SaturdayChecked = getIndividual.includes('saturday') ? 'checked' : 'unchecked';
            const SundayChecked = getIndividual.includes('sunday') ? 'checked' : 'unchecked';
            const waiterName = theWaiter.name;
            const waiterObject = {
                waiterName,
                MondayChecked,
                TuesdayChecked,
                WednesdayChecked,
                ThursdayChecked,
                FridayChecked,
                SaturdayChecked,
                SundayChecked
            }
            waiterList.push(waiterObject);
            const waiterList2 = waiterList[i];
            waiterList3.push(waiterList2);
        }
        const Monday = [];
        const Tuesday = [];
        const Wednesday = [];
        const Thursday = [];
        const Friday = [];
        const Saturday = [];
        const Sunday = [];
        for (let i = 0; i < selectDayId.length; i++) {
            const dayId = selectDayId[i].day_id;
            const waiterId = selectAlLWaiter[i].waiter_id;
            const waiterName = await db.manyOrNone('select name from waiter where id = $1',[waiterId]);
            const dayName = await db.manyOrNone('select name from theDays where id = $1',[dayId]);
    
            if(dayName[0].name == 'monday'){
                Monday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'tuesday'){
                Tuesday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'wednesday'){
                Wednesday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'thursday'){
                Thursday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'friday'){
                Friday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'saturday'){
                Saturday.push(waiterName[0].name);
            }
            if(dayName[0].name == 'sunday'){
                Sunday.push(waiterName[0].name);
            }
        }

        const days = [Monday.length, Tuesday.length, Wednesday.length, Thursday.length, Friday.length, Saturday.length, Sunday.length];
        const MondayColor = [];
        const TuesdayColor = [];
        const WednesdayColor = [];
        const ThursdayColor = [];
        const FridayColor = [];
        const SaturdayColor = [];
        const SundayColor = [];
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            if(day > 3){
                // avoid code duplication
                if(i == 0){
                    MondayColor.push('red');
                }
                if(i == 1){
                    TuesdayColor.push('red');
                }
                if(i == 2){
                    WednesdayColor.push('red');
                }
                if(i == 3){
                    ThursdayColor.push('red');
                }
                if(i == 4){
                    FridayColor.push('red');
                }
                if(i == 5){
                    SaturdayColor.push('red');
                }
                if(i == 6){
                    SundayColor.push('red');
                }
    
            }
                if(day == 3){
                    if(i == 0){
                        MondayColor.push('orange');
                    }
                    if(i == 1){
                        TuesdayColor.push('orange');
                    }
                    if(i == 2){
                        WednesdayColor.push('orange');
                    }
                    if(i == 3){
                        ThursdayColor.push('orange');
                    }
                    if(i == 4){
                        FridayColor.push('orange');
                    }
                    if(i == 5){
                        SaturdayColor.push('orange');
                    }
                    if(i == 6){
                        SundayColor.push('orange');
                    }
                }
        }
        res.render('admin',{
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday,
            MondayColor,
            TuesdayColor,
            WednesdayColor,
            ThursdayColor,
            FridayColor,
            SaturdayColor,
            SundayColor,
            names: waiterNames,
            waiterList,
            waiterList3
        });
    }
        async function resetIndividual(req, res) {
            const  userName  = req.params.name;
            const getTheWaiter = await waiters.getWaiter(userName);
            const waiterId = getTheWaiter.id;
            await waiters.resetDays(waiterId);
            res.redirect(`/waiters/${userName}`);
        }
    return {
        defaultRoute,
        getWaiter,
        theAdmin,
        theReset,
        postWaiter,
        addWaiter,
        resetIndividual
    }

};

export default theWaiters;





