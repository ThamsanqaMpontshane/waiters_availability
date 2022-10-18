import assert from 'assert';
import waiterAvailability from '../waiters.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters_test';

const config = {
    connectionString
}

if (process.env.NODE_ENV === "production") {
    config.ssl = {
        rejectUnauthorized: false
    }
}


const db = pgp(config);
const waiters = waiterAvailability(db);

describe('WAITERS APP', async function () {
    beforeEach(async function () {
        await db.manyOrNone('delete from theSchedule');
        await db.manyOrNone('delete from waiter');
    });

    it('should be able to add a waiter to the database', async function () {
        await waiters.addWaiter('lerato');
        const waiter = await waiters.getWaiter('LERATO');
        assert.equal(waiter.name, 'LERATO');
    });

    it('should be able to add the days that a Lerato is working', async function () {
        await waiters.addWaiter('lerato');
        const waiter = await waiters.getWaiter('LERATO');
        const waiterId = waiter.id;
        const leratoDays = ['monday', 'tuesday', 'wednesday'];
        await waiters.addDays(waiterId, leratoDays);
        const days = await waiters.getDays(waiterId);
        assert.deepEqual(days, leratoDays);
    });

    it('should be able to get the days that a Mabhozeni is working', async function () {
        await waiters.addWaiter('mabHozeni');
        const waiter = await waiters.getWaiter('MABHOZENI');
        const waiterId = waiter.id;
        const mabhozeniDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        await waiters.addDays(waiterId, mabhozeniDays);
        const days = await waiters.getDays(waiterId);
        assert.deepEqual(days, mabhozeniDays);
    });

    it('should be able to get the days that a Portia is working', async function () {
        await waiters.addWaiter('portIA');
        const waiter = await waiters.getWaiter('PORTIA');
        const waiterId = waiter.id;
        const portiaDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        await waiters.addDays(waiterId, portiaDays);
        const days = await waiters.getDays(waiterId);
        assert.deepEqual(days, portiaDays);
    });

    it('should be able to reset the database', async function () {

        await waiters.reset();
        const waiters1 = await db.manyOrNone('select * from waiter');
        const days = await db.manyOrNone('select * from theSchedule');
        assert.deepEqual(waiters1, []);
        assert.deepEqual(days, []);
    });
    // should be able to get all the waiters

    it('should be able to get the count of all the waiters', async function () {
        await waiters.addWaiter('Lerato');
        await waiters.addWaiter('Mabhozeni');
        await waiters.addWaiter('Mpho');
        await waiters.addWaiter('Mpho');
        const waitersList = await waiters.getAllWaiters();
        assert.equal(waitersList.length, 3);
    });

    it('should be able to get all the waiters', async function () {
        await waiters.addWaiter('lerato');
        await waiters.addWaiter('mabhozeni');
        await waiters.addWaiter('mpho');
        await waiters.addWaiter('mpho');
        const waitersList = await waiters.getAllWaiters();
        assert.deepEqual(waitersList, ['LERATO', 'MABHOZENI', 'MPHO']);
    });
    it('should be able to get the days that a Lerato is working', async function () {
        await waiters.addWaiter('lerato');
        const waiter = await waiters.getWaiter('LERATO');
        const waiterId = waiter.id;
        const leratoDays = ['monday', 'tuesday', 'wednesday'];
        await waiters.addDays(waiterId, leratoDays);
        const days = await waiters.getDays(waiterId);
        assert.deepEqual(days, leratoDays);
    });

    after(async function () {
        await db.manyOrNone('Truncate theSchedule');
        pgp.end();
    });
});

