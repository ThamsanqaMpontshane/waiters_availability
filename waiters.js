function waiterAvailability(db){

    // function to add waiter name to waiters table
    async function addWaiter(name){
        const nameRegex = /^[a-zA-Z]+$/;
        const upperName = name.toUpperCase();
        const nameValid = nameRegex.test(upperName);
        const selectName = await db.manyOrNone('select * from waiter where name = $1',[upperName]);
        if(selectName.length == 0 && nameValid == true){
            return await db.none(`INSERT INTO waiter (name) VALUES ('${upperName}')`);
        }
    }
    async function getAllWaiters(){
        return await db.any(`SELECT * FROM waiter`);
    }
    // async function selectWorkDays(name, day){
    //     const upperName = name.toUpperCase();
    //     const selectId = await db.one(`SELECT id FROM waiter WHERE name = '${upperName}'`);
    //     // use 
    // }

    const getWaiter = async name => {
        const upperName = name.toUpperCase();
        return await db.oneOrNone('select name from waiter where name = $1',[upperName]);
    }
    // function to get schedule for a waiter
        return {
            addWaiter,
            getAllWaiters,
            getWaiter
            // selectWorkDays
        }
    }

export default waiterAvailability;
