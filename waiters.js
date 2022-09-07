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
    async function getWaiterAvailability(waiterId){
        const waiterAvailability = await db.manyOrNone('select waiter_id, day_id from theSchedule where waiter_id = $1',[waiterId]);
        const waiterDays = [];
        for (let i = 0; i < waiterAvailability.length; i++) {
            const day = waiterAvailability[i].day_id;
            const getDays = await db.manyOrNone('select name from theDays where id = $1',[day]);
            waiterDays.push(getDays[0].name);
        }
        // console.log(waiterDays);
        return waiterDays;
    }
    // !get all waiters availability
    async function getAllWaitersAvailability(){
        const allWaitersAvailability = await db.manyOrNone('select * from theSchedule');
        // console.log(allWaitersAvailability);
        return allWaitersAvailability;
    }
    // create table theSchedule2 (
    //     id serial primary key,
    //     waiter_name varchar(255) not null,
    //     day_name varchar(255) not null,
    //     FOREIGN KEY (waiter_name) REFERENCES waiter (name),
    //     FOREIGN KEY (day_name) REFERENCES theDays (name),
    //     UNIQUE (waiter_name, day_name)
    // );
    async function addWaiterAvailability2(waiterName, days){
        const upperName = waiterName.toUpperCase();
        return await db.none(`INSERT INTO theSchedule2 (waiter_name, day_name) VALUES ('${upperName}', '${days}')`);
    }
    
       
        return {
            addWaiter,
            getWaiter,
            getAllWaiters,
            addWaiterAvailability,
            getWaiterAvailability,
            getAllWaitersAvailability,
            addWaiterAvailability2
        }
    }

export default waiterAvailability;
