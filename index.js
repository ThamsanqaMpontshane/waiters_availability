import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import waiterAvailability from "./waiters.js";
import flash from "express-flash";
import session from "express-session";
// import psqlStore from "connect-pg-simple";
// const pgSession = psqlStore(session);
import pgPromise from 'pg-promise';
import waiterRouter from "./routes/routes.js";
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
const Routers = waiterRouter(waiters, db);

app.use(session({
    secret: "admin",
    resave: false,
    saveUninitialized: false,
    // store: new pgSession({
    // })
}));

function isAuth(req, res, next){
    if(req.session.admin){
        next();
    }else{
        res.redirect("/login");
    }
}
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

app.get('/', Routers.defaultRoute);

app.post('/waiters',Routers.addWaiter);
app.get('/waiters/:name',Routers.getWaiter);
app.post('/waiters/:name',Routers.postWaiter);
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
// !admin logout
app.get('/adminLogout', Routers.adminLogout);
// !about
app.get('/about', async function(req, res){
    res.render('about');
});
app.listen(process.env.PORT || 3_666, () => {
    console.log("Server is running on port 3_666");
});
