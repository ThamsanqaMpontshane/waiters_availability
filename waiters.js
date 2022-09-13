function waiterAvailability(db){

    //!function to add waiter name to waiters table
    async function addWaiter(name){
        const nameRegex = /^[a-zA-Z]+$/;
        const upperName = name.toUpperCase();
        const nameValid = nameRegex.test(upperName);
        const selectName = await db.manyOrNone('select * from waiter where name = $1',[upperName]);
        if(selectName.length == 0 && nameValid == true){
            return await db.none(`INSERT INTO waiter (name) VALUES ('${upperName}')`);
        }
    }
    //!function to get individual waiter
    async function getWaiter(name){
        const upperName = name.toUpperCase();
        return await db.oneOrNone('select * from waiter where name = $1',[upperName]);
    }
    //?function to get all waiters
    async function getAllWaiters(){
        const allWaiters = await db.manyOrNone('select * from waiter');
        return allWaiters;
    }
    // ?add waiter availability for that day
    async function addWaiterAvailability(waiterId, days){
        return await db.none(`INSERT INTO theSchedule (waiter_id, day_id) VALUES ('${waiterId}', '${days}')`);
    }
    // ?get waiter availability
    // !important
    async function getWaiterAvailability(waiterId){
        const waiterAvailability = await db.manyOrNone('select waiter_id, day_id from theSchedule where waiter_id = $1',[waiterId]);
        const waiterDays = [];
        for (let i = 0; i < waiterAvailability.length; i++) {
            const day = waiterAvailability[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1',[day]);
            waiterDays.push(getDays[0].name);
        }
        return waiterDays;
    }
    // !get all waiters availability
    async function getAllWaitersAvailability(){
        const allWaitersAvailability = await db.manyOrNone('select * from theSchedule');
        return allWaitersAvailability;
    }
    // get individual waiter days eg monday, tuesday
    async function getIndividualWaiterDays(waiterId){
        const waiterDays = await db.manyOrNone('select day_id from theSchedule where waiter_id = $1',[waiterId]);
        const waiterDaysName = [];
        for (let i = 0; i < waiterDays.length; i++) {
            const day = waiterDays[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1',[day]);
            waiterDaysName.push(getDays[0].name);
        }
        return waiterDaysName;
    }
    
    // reset the schedule
    async function reset(){
        return await db.manyOrNone('delete from theSchedule');
    }
        return {
            addWaiter,
            getWaiter,
            getAllWaiters,
            addWaiterAvailability,
            getWaiterAvailability,
            getAllWaitersAvailability,
            reset,
            getIndividualWaiterDays
        }
    }

export default waiterAvailability;
