import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
// import greet from "./greet.js";
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
// const greet1 = greet(db);
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

app.get('/', (req, res) => {
    res.render('index',{
    });
});

app.listen(process.env.PORT || 3_666, () => {
});
