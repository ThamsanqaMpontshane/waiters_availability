import assert from 'assert';
import waiterAvailability from '../waiters.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters_test';

const config = {
    connectionString
}

if(process.env.NODE_ENV == "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
}


const db = pgp(config);
const waiters = waiterAvailability(db);

describe('WAITERS APP' , async function(){
    beforeEach(async function(){
        await db.manyOrNone('delete from theSchedule');
        await db.manyOrNone('delete from waiter');
    });

    it('should be able to add a waiter to the database' , async function(){
        await waiters.addWaiter('Lerato');
        const waiter = await waiters.getWaiter('LERATO');
        assert.equal(waiter.name, 'LERATO');
    });

    it('should be able to add the days that a Lerato is working' , async function(){
        await waiters.addWaiter('Lerato');
        const waiter = await waiters.getWaiter('LERATO');
        console.log(waiter);
        const waiterId = waiter.id;
        // add days
        // addDays(waiterId, days)
        // getDays(waiterId)
        // getDaysId(day)
        // addWaiterAvailability(waiterId, dayId)
        // getWaiterAvailability(waiterId)

        await waiters.addDays(waiterId, 'Monday');
        const days = await waiters.getDays(waiterId);
        assert.equal(days, ['Monday']);
    });

    // it('should be able to get the days that a Mabhozeni is working' , async function(){
    //     await waiters.addWaiter('Mabhozeni');
    //     const waiter = await waiters.getWaiter('MABHOZENI');
    //     const waiterId = waiter.id;
    //     const day = await waiters.getDaysId('monday');
    //     await waiters.addWaiterAvailability(waiterId, day);
    //     const waiterDays = await waiters.getWaiterAvailability(waiterId);
    //     assert.deepEqual(waiterDays, ['monday']);
    // });

    // it('should be able to get the days that a Mabhozeni is working' , async function(){
    //     await waiters.addWaiter('Mabhozeni');
    //     const waiter = await waiters.getWaiter('Mabhozeni');
    //     await waiters.addWaiterAvailability(waiter.id, 'Monday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Tuesday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Wednesday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Thursday');

    //     const days = await waiters.getWaiterAvailability(waiter.id);
    //     assert.deepEqual(days, ['Monday', 'Tuesday', 'Wednesday', 'Thursday']);
    // });

    // should be able to reset the database
    // it('should be able to reset the database' , async function(){
    //     await waiters.addWaiter('Lerato');
    //     const waiter = await waiters.getWaiter('Lerato');
    //     await waiters.addWaiterAvailability(waiter.id, 'Monday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Tuesday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Wednesday');
    //     await waiters.addWaiterAvailability(waiter.id, 'Thursday');
    //     await waiters.reset();
    //     const days = await waiters.getWaiterAvailability(waiter.id);
    //     assert.deepEqual(days, []);
    // });
    // should be able to get all the waiters

    // it('should be able to get all the waiters', async function(){
    //     await waiters.addWaiter('Lerato');
    //     await waiters.addWaiter('Mabhozeni');
    //     await waiters.addWaiter('Mpho');
    //     await waiters.addWaiter('Mpho');
    //     const waitersList = await waiters.getAllWaiters();
    //     assert.equal(waitersList.length, 3);
    // });

    // it('should be able to get all the waiters', async function(){
    //     await waiters.addWaiter('Lerato');
    //     await waiters.addWaiter('Mabhozeni');
    //     await waiters.addWaiter('Mpho');
    //     await waiters.addWaiter('Mpho');
    //     const waitersList = await waiters.getAllWaiters();
    //     // console.log(waitersList);
    //     assert.equal(waitersList ,['LERATO','MABHOZENI','MPHO']);
    // });

    after(async function(){
        await db.manyOrNone('Truncate theSchedule');
        // await db.manyOrNone('Truncate waiter');
        pgp.end();
    });
});

