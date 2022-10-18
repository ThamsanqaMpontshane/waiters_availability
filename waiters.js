function waiterAvailability(db) {

    //!function to add waiter name to waiters table
    async function addWaiter(name) {
        const nameRegex = /^[a-zA-Z]+$/;
        const upperName = name.toUpperCase();
        const nameValid = nameRegex.test(upperName);
        const selectName = await db.manyOrNone('select * from waiter where name = $1', [upperName]);
        if (selectName.length === 0 && nameValid === true) {
            return await db.none(`INSERT INTO waiter (name)
                                  VALUES ('${upperName}')`);
        }
    }

    //!function to get individual waiter
    async function getWaiter(name) {
        const upperName = name.toUpperCase();
        return await db.oneOrNone('select * from waiter where name = $1', [upperName]);
    }

    //?function to get all waiters
    async function getAllWaiters() {
        const allWaiters = await db.manyOrNone('select name from waiter');
        return allWaiters.map(waiter => waiter.name);
    }

    // ?add waiter availability for that day
    async function addWaiterAvailability(waiterId, days) {
        return await db.none(`INSERT INTO theSchedule (waiter_id, day_id)
                              VALUES ('${waiterId}', '${days}')`);
    }

    // ?get waiter availability
    // !important
    async function getWaiterAvailability(waiterId) {
        const waiterAvailability = await db.manyOrNone('select waiter_id, day_id from theSchedule where waiter_id = $1', [waiterId]);
        const waiterDays = [];
        for (let i = 0; i < waiterAvailability.length; i++) {
            const day = waiterAvailability[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1', [day]);
            waiterDays.push(getDays[0].name);
        }
        return waiterDays;
    }

    // !get all waiters availability
    async function getAllWaitersAvailability() {
        return await db.manyOrNone('select * from theSchedule');
    }

    async function getIndividualWaiterDays(waiterId) {
        const [waiterDays] = await Promise.all([db.manyOrNone('select day_id from theSchedule where waiter_id = $1', [waiterId])]);
        const waiterDaysName = [];
        for (let i = 0; i < waiterDays.length; i++) {
            const day = waiterDays[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1', [day]);
            waiterDaysName.push(getDays[0].name);
        }
        return waiterDaysName;
    }

    async function reset() {
        await db.none('delete from theSchedule');
        await db.none('delete from waiter');
    }

    async function addDays(waiterId, days) {
        // ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        // do not use map
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const getDayId = await db.manyOrNone('select id from theDays where name = $1', [day]);
            // return
            await db.none(`INSERT INTO theSchedule (waiter_id, day_id)
                           VALUES ('${waiterId}', '${getDayId[0].id}')`);
        }
    }

    // function to reset the days of individual user
    async function resetDays(waiterId) {
        return await db.none('delete from theSchedule where waiter_id = $1', [waiterId]);
    }

    // function to get all the days
    async function getDays(waiterId) {
        const waiterDays = await db.manyOrNone('select day_id from theSchedule where waiter_id = $1', [waiterId]);
        const waiterDaysName = [];
        for (let i = 0; i < waiterDays.length; i++) {
            const day = waiterDays[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1', [day]);
            waiterDaysName.push(getDays[0].name);
        }
        return waiterDaysName;
    }

    // get days id
    async function getDaysId(day) {
        const dayId = await db.manyOrNone('select id from theDays where name = $1', [day]);
        return dayId[0].id;
    }

    // add admin
    async function addAdmin(username, password) {
        const admin = await db.manyOrNone('select * from myAdmins where username = $1', [username]);
        if (admin.length === 0) {
            return await db.none(`INSERT INTO myAdmins (username, password)
                                  VALUES ('${username}', '${password}')`);
        }
    }

    // get admin
    async function getAdmin(username) {
        return await db.oneOrNone('select * from myAdmins where username = $1', [username]);
    }

    // admin logout
    async function adminLogout() {
        //    delete all the sessions
        const sessions = await db.manyOrNone('select * from session');
        for (let i = 0; i < sessions.length; i++) {
            const session = sessions[i];
            await db.none('delete from session where sid = $1', [session.sid]);
        }
    }

    //admin session
    async function adminSession() {
        return await db.manyOrNone('select * from myAdmins');
    }

    //admin update waiter days
    async function adminUpdateWaiterDays(waiterId, days) {
        console.log(waiterId)
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            // console.log(day)
            const getDayId = await db.manyOrNone('select id from theDays where name = $1', [day]);
            console.log(getDayId[0].id);
            const getDay = await db.manyOrNone('select * from theSchedule where waiter_id = $1 and day_id = $2', [waiterId, getDayId[0].id]);
            console.log(getDay)

            if (getDay.length === 0) {
                await db.none(`INSERT INTO theSchedule (waiter_id, day_id)
                               VALUES ('${waiterId}', '${getDayId[0].id}')`);
            } else {
                await db.none('delete from theSchedule where waiter_id = $1 and day_id = $2', [waiterId, getDayId[0].id]);
            }
        }
    }

    return {
        addWaiter,
        getWaiter,
        getAllWaiters,
        addWaiterAvailability,
        getWaiterAvailability,
        getAllWaitersAvailability,
        reset,
        getIndividualWaiterDays,
        addDays,
        resetDays,
        getDays,
        getDaysId,
        addAdmin,
        getAdmin,
        adminLogout,
        adminSession,
        adminUpdateWaiterDays
    }
}

export default waiterAvailability;
