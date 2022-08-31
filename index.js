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
    await waiters.getAllWaiters();
    res.render('index',{
    });
});
app.post('/waiters', async (req, res) => {
    const { name } = req.body;
    await waiters.addWaiter(name);
    const waiter = await waiters.getWaiter(name);
    const user = waiter.name
    res.redirect(`/waiters/${user}`);
});
app.get('/waiters/:name', async (req, res) => {
    const  userName  = req.params.name;
    const waiter = await waiters.getWaiter(userName);
    res.render('days',{userName});
});

app.post('/waiters/:name', async (req, res) => {
    const { days }  = req.body;
    const  userName  = req.params.name;
    const theName = await waiters.addWaiter(userName);
    // const thelog = await waiters.selectWorkDays(userName, days);
    // console.log(thelog);
    res.render('days',{userName});
});
app.listen(process.env.PORT || 3_666, () => {
    console.log("Server is running on port 3_666");
});
