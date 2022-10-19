import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import waiterAvailability from "./waiters.js";
import flash from "express-flash";
import session from "express-session";
import psqlStore from "connect-pg-simple";
import pgPromise from 'pg-promise';
import waiterRouter from "./routes/routes.js";

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const pgp = pgPromise({});


const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters';

const config = {
    connectionString
}

if (process.env.NODE_ENV == "production") {
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
const waiters = waiterAvailability(db);
const Routers = waiterRouter(waiters, db);

app.use(session({
    secret: "admin",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "strict"
    }
}));

app.use(flash());
app.use(function (req, res, next) {
    if (req.path === "/admin" && !req.session.isAuth) {
        res.redirect("/adminLogin");
    }
    if (req.path === "/adminLogin" && req.session.isAuth && req.session.admin) {
        res.redirect("/admin");
    }
    next();
})

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set('views', join(__dirname, 'views'));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

app.get('/', Routers.defaultRoute);

app.post('/waiters', Routers.addWaiter);
app.get('/waiters/:name', Routers.getWaiter);
app.get('/waiterPages', Routers.waiterPage);
app.post('/waiters/:name', Routers.postWaiter);
// !reset
app.get('/reset', Routers.theReset);
app.post('/resetDays', Routers.resetIndividual);
// !admin login
app.get('/adminLogin', Routers.adminLogin);
app.post('/adminLogin', Routers.adminLoginPost);
// !admin signup
app.get('/adminSignup', Routers.adminSignup);
app.post('/adminSignup', Routers.adminSignupPost);
// !admin dashboard
app.get('/admin', Routers.theAdmin);
app.post('/admin', Routers.adminPost);
// !admin logout
app.get('/adminLogout', Routers.adminLogout);
// !admin delete
app.get('/about', async function (req, res) {
    res.render('about');
});
app.listen(process.env.PORT || 3_666, () => {
    console.log("Server is running on port 3_666");
})
//heroku logs --tail
