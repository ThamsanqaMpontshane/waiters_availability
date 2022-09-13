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
    if (name == "") {
        req.flash('error', 'Please enter your name');
        res.redirect('/');
    }
    // else if name is not valid
    else if (name !=`^[a-zA-Z]+$`) {
        req.flash('error', 'Please enter a valid name');
        res.redirect('/');
    }else{
    await waiters.addWaiter(name);
    const waiter = await waiters.getWaiter(name);
    const user = waiter.name;
    res.redirect(`/waiters/${user}`);
}
});
app.get('/waiters/:name', async (req, res) => {
    const userName = req.params.name;
    const waiter = await waiters.getWaiter(userName);
    const getIndividual = await waiters.getIndividualWaiterDays(waiter.id);
    // check the checkbox of the days that the waiter is available
    // the value is 'checked' if the waiter is available
    // the value is 'unchecked' if the waiter is not available
    const Monday = getIndividual.includes('monday') ? 'checked' : 'unchecked';
    const Tuesday = getIndividual.includes('tuesday') ? 'checked' : 'unchecked';
    const Wednesday = getIndividual.includes('wednesday') ? 'checked' : 'unchecked';
    const Thursday = getIndividual.includes('thursday') ? 'checked' : 'unchecked';
    const Friday = getIndividual.includes('friday') ? 'checked' : 'unchecked';
    const Saturday = getIndividual.includes('saturday') ? 'checked' : 'unchecked';
    const Sunday = getIndividual.includes('sunday') ? 'checked' : 'unchecked';
    await waiters.getWaiterAvailability(waiter.id);
    res.render('days',{
        userName,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday
    });
});

app.post('/waiters/:name', async (req, res) => {
    const  userName  = req.params.name;
    const { days } = req.body

    const getTheWaiter = await waiters.getWaiter(userName);
    const waiterId = getTheWaiter.id;
    // loop through the days 
    for (let i = 0; i < days.length; i++) {
        const day = days[i];        
        const dayId = await db.manyOrNone('select id from theDays where name = $1',[day]);
        const checkDay = await db.manyOrNone('select * from theSchedule where waiter_id = $1 and day_id = $2',[waiterId,(dayId[0].id)]);
        if(checkDay.length == 0){
        const getId = dayId[0].id;
        // console.log(getId);
        await waiters.addWaiterAvailability(waiterId, getId);
        }
    }
    await waiters.getWaiterAvailability(waiterId);
    res.redirect(`/waiters/${userName}`);
});

app.get('/reset', async (req, res) => {
    await waiters.reset();
    res.redirect('/admin');
});

app.get('/admin', async (req, res) => {
    const selectAlLWaiter = await db.manyOrNone('select waiter_id from theSchedule');
    const selectDayId = await db.manyOrNone('select day_id from theSchedule');
    const Monday = [];
    const Tuesday = [];
    const Wednesday = [];
    const Thursday = [];
    const Friday = [];
    const Saturday = [];
    const Sunday = [];
    for (let i = 0; i < selectDayId.length; i++) {
        const dayId = selectDayId[i].day_id;
        const waiterId = selectAlLWaiter[i].waiter_id;
        const waiterName = await db.manyOrNone('select name from waiter where id = $1',[waiterId]);
        const dayName = await db.manyOrNone('select name from theDays where id = $1',[dayId]);
        if(dayName[0].name == 'monday'){
            Monday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'tuesday'){
            Tuesday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'wednesday'){
            Wednesday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'thursday'){
            Thursday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'friday'){
            Friday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'saturday'){
            Saturday.push(waiterName[0].name);
        }
        if(dayName[0].name == 'sunday'){
            Sunday.push(waiterName[0].name);
        }
    }
    // create a array that will store the length of the days
    const days = [Monday.length, Tuesday.length, Wednesday.length, Thursday.length, Friday.length, Saturday.length, Sunday.length];
    // loop over this array and if the length is greater than 3 then add red , if the length is equal to 3 then add orange 
    // have a color array for each day
    const MondayColor = [];
    const TuesdayColor = [];
    const WednesdayColor = [];
    const ThursdayColor = [];
    const FridayColor = [];
    const SaturdayColor = [];
    const SundayColor = [];
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        if(day > 3){
            if(i == 0){
                MondayColor.push('red');
            }
            if(i == 1){
                TuesdayColor.push('red');
            }
            if(i == 2){
                WednesdayColor.push('red');
            }
            if(i == 3){
                ThursdayColor.push('red');
            }
            if(i == 4){
                FridayColor.push('red');
            }
            if(i == 5){
                SaturdayColor.push('red');
            }
            if(i == 6){
                SundayColor.push('red');
            }
        }
            if(day == 3){
                if(i == 0){
                    MondayColor.push('orange');
                }
                if(i == 1){
                    TuesdayColor.push('orange');
                }
                if(i == 2){
                    WednesdayColor.push('orange');
                }
                if(i == 3){
                    ThursdayColor.push('orange');
                }
                if(i == 4){
                    FridayColor.push('orange');
                }
                if(i == 5){
                    SaturdayColor.push('orange');
                }
                if(i == 6){
                    SundayColor.push('orange');
                }
            }
    }
    res.render('admin',{
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday,
        MondayColor,
        TuesdayColor,
        WednesdayColor,
        ThursdayColor,
        FridayColor,
        SaturdayColor,
        SundayColor
    });
});
// reset button route


app.listen(process.env.PORT || 3_666, () => {
    console.log("Server is running on port 3_666");
});
