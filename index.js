import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import waiterAvailability from "./waiters.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from 'pg-promise';
// import greetRouter from './routes/routes.js';

const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters';

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
// const Routers = greetRouter(greet1);

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.get('/', async (req, res) => {
    res.render('index',{
    });
});
app.post('/waiters', async (req, res) => {
    const { name } = req.body;
    await waiters.addWaiter(name);
    const waiter = await waiters.getWaiter(name);
    const user = waiter.name;
    res.redirect(`/waiters/${user}`);
});
app.get('/waiters/:name', async (req, res) => {
    const userName = req.params.name;
    const waiter = await waiters.getWaiter(userName);
    await waiters.getWaiterAvailability(waiter.id);
    res.render('days',{userName});
});

app.post('/waiters/:name', async (req, res) => {
    const  userName  = req.params.name;
    const { days } = req.body;
    // console.log(days);

    const getTheWaiter = await waiters.getWaiter(userName);
    const waiterId = getTheWaiter.id;
    // loop through the days 
    for (let i = 0; i < days.length; i++) {
        const day = days[i];        
        const dayId = await db.manyOrNone('select id from theDays where name = $1',[day]);
        const checkDay = await db.manyOrNone('select * from theSchedule where waiter_id = $1 and day_id = $2',[waiterId, dayId[0].id]);
        if(checkDay.length == 0){
        const getId = dayId[0].id;
        // console.log(getId);
        await waiters.addWaiterAvailability(waiterId, getId);
        await waiters.getWaiterAvailability2()
        }
    }

    res.redirect(`/waiters/${userName}`);
});

app.get('/admin', async (req, res) => {
    const allWaitersAvailability = await waiters.getAllWaitersAvailability();
    const allWaiters = await waiters.getAllWaiters();
    res.render('admin',{
    });
});

app.listen(process.env.PORT || 3_666, () => {
    console.log("Server is running on port 3_666");
});
