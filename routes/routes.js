import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();
const theWaiters = (waiters, db) => {
  async function defaultRoute(req, res) {
    res.render("index");
  }

  async function waiterPage(req, res) {
    res.render("waiterPages");
  }

  async function addWaiter(req, res) {
    const { name } = req.body;
    const regex = /^[a-zA-Z]+$/;
    const button = req.body.button;
    const getTheWaiter = await waiters.getWaiter(name);
    // console.log(getTheWaiter.length);
    if (button === "login") {
      if (name === "") {
        req.flash("error", "Please enter your name");
        res.redirect("/waiterPages");
        //  completed
      } else if (regex.test(name) === false) {
        req.flash("error", "Please enter a valid name");
        //completed
        res.redirect("/waiterPages");
      } else if (getTheWaiter === null) {
        req.flash("error", "Please sign up");
        //still busy with this
        res.redirect("/waiterPages");
      } else {
        await waiters.addWaiter(name);
        const waiter = await waiters.getWaiter(name);
        const user = waiter.name;
        res.redirect(`/waiters/${user}`);
      }
    } else if (button === "signup") {
      if (name === "") {
        req.flash("error", "Please enter your name");
        //  completed
      } else if (regex.test(name) === false) {
        req.flash("error", "Please enter a valid name");
        //  completed
      } else if (getTheWaiter === null) {
        await waiters.addWaiter(name);
        const waiter = await waiters.getWaiter(name);
        const user = waiter.name;
        req.flash("success", "You have successfully signed up");
        req.flash("user", user);
        res.redirect(`back`);
        return;
      } else {
        req.flash("error", "Please login");
        res.redirect("/waiterPages");
        return;
      }
      res.redirect("/waiterPages");
    }
  }

  async function getWaiter(req, res) {
    const userName = req.params.name;
    const waiter = await waiters.getWaiter(userName);
    const getIndividual = await waiters.getIndividualWaiterDays(waiter.id);
    const Monday = getIndividual.includes("monday") ? "checked" : "unchecked";
    const Tuesday = getIndividual.includes("tuesday") ? "checked" : "unchecked";
    const Wednesday = getIndividual.includes("wednesday")
      ? "checked"
      : "unchecked";
    const Thursday = getIndividual.includes("thursday")
      ? "checked"
      : "unchecked";
    const Friday = getIndividual.includes("friday") ? "checked" : "unchecked";
    const Saturday = getIndividual.includes("saturday")
      ? "checked"
      : "unchecked";
    const Sunday = getIndividual.includes("sunday") ? "checked" : "unchecked";
    await waiters.getWaiterAvailability(waiter.id);
    res.render("days", {
      userName,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday,
    });
  }

  async function postWaiter(req, res) {
    const userName = req.params.name;
    const { days } = req.body;
    const getTheWaiter = await waiters.getWaiter(userName);
    const waiterId = getTheWaiter.id;
    const getIndividual = await waiters.getIndividualWaiterDays(waiterId);
    let working_days = Array.isArray(days) ? days : [days];
    working_days = working_days.filter((item) => item);
    if (working_days.length === 0) {
      await db.none("delete from theSchedule where waiter_id = $1", [waiterId]);
    } else if (working_days.length > 0 && working_days.length < 3) {
      await db.none("delete from theSchedule where waiter_id = $1", [waiterId]);
      for (let i = 0; i < working_days.length; i++) {
        const day = working_days[i];
        const dayId = await db.oneOrNone(
          "select id from theDays where name = $1",
          [day]
        );
        const dayIdValue = dayId.id;
        const checkDay = await db.manyOrNone(
          "select * from theSchedule where waiter_id = $1 and day_id = $2",
          [waiterId, dayIdValue]
        );
        if (checkDay.length === 0) {
          const getId = dayId.id;
          await waiters.addWaiterAvailability(waiterId, getId);
        }
      }
      req.flash("error", "Please select at least 3 days");
    } else if (working_days.length >= 3) {
      await db.none("delete from theSchedule where waiter_id = $1", [waiterId]);
      for (let i = 0; i < working_days.length; i++) {
        const day = working_days[i];
        const dayId = await db.oneOrNone(
          "select id from theDays where name = $1",
          [day]
        );
        const dayIdValue = dayId.id;
        const checkDay = await db.manyOrNone(
          "select * from theSchedule where waiter_id = $1 and day_id = $2",
          [waiterId, dayIdValue]
        );
        if (checkDay.length === 0) {
          const getId = dayId.id;
          await waiters.addWaiterAvailability(waiterId, getId);
        }
      }
      req.flash("success", "Working days updated successfully");
    }
    res.redirect(`/waiters/${userName}`);
    await waiters.getWaiterAvailability(waiterId);
  }

  async function theReset(req, res) {
    await waiters.theReset();
    req.flash("success", "Database reset successfully");
    res.redirect("/admin");
  }

  async function theAdmin(req, res) {
    const selectAlLWaiter = await db.manyOrNone(
      "select waiter_id from theSchedule"
    );
    const selectDayId = await db.manyOrNone("select day_id from theSchedule");
    // console.log(selectAlLWaiter);
    const waiterNames = await waiters.getAllWaiters();
    const waiterList = [];
    const waiterList3 = [];
    for (let i = 0; i < waiterNames.length; i++) {
      const waiter = waiterNames[i];
      const theWaiter = await waiters.getWaiter(waiter);
      const waiterId = theWaiter.id;
      const getIndividual = await waiters.getIndividualWaiterDays(waiterId);
      //decrease code repetition
      const MondayChecked = getIndividual.includes("monday")
        ? "checked"
        : "unchecked";
      const TuesdayChecked = getIndividual.includes("tuesday")
        ? "checked"
        : "unchecked";
      const WednesdayChecked = getIndividual.includes("wednesday")
        ? "checked"
        : "unchecked";
      const ThursdayChecked = getIndividual.includes("thursday")
        ? "checked"
        : "unchecked";
      const FridayChecked = getIndividual.includes("friday")
        ? "checked"
        : "unchecked";
      const SaturdayChecked = getIndividual.includes("saturday")
        ? "checked"
        : "unchecked";
      const SundayChecked = getIndividual.includes("sunday")
        ? "checked"
        : "unchecked";
      const waiterName = theWaiter.name;
      const waiterObject = {
        waiterName,
        MondayChecked,
        TuesdayChecked,
        WednesdayChecked,
        ThursdayChecked,
        FridayChecked,
        SaturdayChecked,
        SundayChecked,
      };
      waiterList.push(waiterObject);
      const waiterList2 = waiterList[i];
      waiterList3.push(waiterList2);
    }
    const Monday = [];
    const Tuesday = [];
    const Wednesday = [];
    const Thursday = [];
    const Friday = [];
    const Saturday = [];
    const Sunday = [];
    for (let i = 0; i < selectDayId.length; i++) {
      const dayId = selectDayId[i];
      const dayIdValue = dayId.day_id;
      // console.log(dayIdValue);
      // lee davies
      const dayName = await db.oneOrNone(
        "select name from theDays where id = $1",
        [dayIdValue]
      );
      const waiterId = selectAlLWaiter[i].waiter_id;
      const waiterName = await db.oneOrNone(
        "select name from waiter where id = $1",
        [waiterId]
      );
      const waiterNameValue = waiterName.name;
      const dayNameValue = dayName.name;
      if (dayNameValue === "monday") {
        Monday.push(waiterNameValue);
      }
      if (dayNameValue === "tuesday") {
        Tuesday.push(waiterNameValue);
      }
      if (dayNameValue === "wednesday") {
        Wednesday.push(waiterNameValue);
      }
      if (dayNameValue === "thursday") {
        Thursday.push(waiterNameValue);
      }
      if (dayNameValue === "friday") {
        Friday.push(waiterNameValue);
      }
      if (dayNameValue === "saturday") {
        Saturday.push(waiterNameValue);
      }
      if (dayNameValue === "sunday") {
        Sunday.push(waiterNameValue);
      }
    }

    const days = [
      Monday.length,
      Tuesday.length,
      Wednesday.length,
      Thursday.length,
      Friday.length,
      Saturday.length,
      Sunday.length,
    ];
    const MondayColor = [];
    const TuesdayColor = [];
    const WednesdayColor = [];
    const ThursdayColor = [];
    const FridayColor = [];
    const SaturdayColor = [];
    const SundayColor = [];
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      if (day > 3) {
        // avoid code duplication
        if (i === 0) {
          MondayColor.push("red");
        }
        if (i === 1) {
          TuesdayColor.push("red");
        }
        if (i === 2) {
          WednesdayColor.push("red");
        }
        if (i === 3) {
          ThursdayColor.push("red");
        }
        if (i === 4) {
          FridayColor.push("red");
        }
        if (i === 5) {
          SaturdayColor.push("red");
        }
        if (i === 6) {
          SundayColor.push("red");
        }
      }
      if (day === 3) {
        if (i === 0) {
          MondayColor.push("orange");
        }
        if (i === 1) {
          TuesdayColor.push("orange");
        }
        if (i === 2) {
          WednesdayColor.push("orange");
        }
        if (i === 3) {
          ThursdayColor.push("orange");
        }
        if (i === 4) {
          FridayColor.push("orange");
        }
        if (i === 5) {
          SaturdayColor.push("orange");
        }
        if (i === 6) {
          SundayColor.push("orange");
        }
      }
      if (day < 3) {
        if (i === 0) {
          MondayColor.push("green");
        }
        if (i === 1) {
          TuesdayColor.push("green");
        }
        if (i === 2) {
          WednesdayColor.push("green");
        }
        if (i === 3) {
          ThursdayColor.push("green");
        }
        if (i === 4) {
          FridayColor.push("green");
        }
        if (i === 5) {
          SaturdayColor.push("green");
        }
        if (i === 6) {
          SundayColor.push("green");
        }
      }
    }
    res.render("admin", {
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
      SundayColor,
      names: waiterNames,
      waiterList,
      waiterList3,
    });
  }

  async function adminPost(req, res) {
    const waiterName = req.body.waiterName;
    // console.log(waiterName);
    const theCheckBoxes = req.body.checkbox;
    const waiterNames = await waiters.getAllWaiters();
    //update each waiter days
    for (let i = 0; i < waiterNames.length; i++) {
      const waiter = waiterNames[i];
      const theWaiter = await waiters.getWaiter(waiter);
      const waiterId = theWaiter.id;
      // console.log(theCheckBoxes)
      await waiters.adminUpdateWaiterDays(waiterId, theCheckBoxes);
    }
    // res.redirect('/admin');
  }

  async function resetIndividual(req, res) {
    // const  userName  = req.params.name;
    // console.log(userName);
    // const getTheWaiter = await waiters.getWaiter(userName);
    // const waiterId = getTheWaiter.id;
    // const waiterName = getTheWaiter.name;
    // await waiters.resetDays(waiterId);
    res.redirect(`/waiters/${waiterName}`);
  }

  async function adminLogin(req, res) {
    res.render("adminLogin");
  }

  async function adminLoginPost(req, res) {
    console.log(req.session.isAuth);
    const userName = req.body.username;
    const upperName = userName.toUpperCase();
    const password = req.body.password;
    const admin = await waiters.getAdmin(upperName);
    console.log(admin);
    if (admin) {
      if (admin.password === password) {
        req.session.admin = admin;
        req.session.isAuth = true;
        res.redirect("/admin");
      } else {
        res.render("adminLogin", { message: "Wrong password" });
      }
    } else {
      res.render("adminLogin", { message: "Wrong username" });
    }
  }

  async function adminSignupPost(req, res) {
    const userName = req.body.username;
    const upperName = userName.toUpperCase();
    const admin = await waiters.getAdmin(upperName);
    if (admin) {
      req.flash("error", "Username already exists");
      res.render("adminSignup");
      return;
    }
    await waiters.addAdmin(upperName, uid());
    const adminName = await db.manyOrNone(
      "select password from myAdmins where username = $1",
      [upperName]
    ); // `Your Password is ${thePassword}. Please save it for future use`
    const thePassword = adminName[0].password;
    req.flash("pass", `Your Password is `);
    req.flash("thePass", thePassword);
    req.flash("pass2", `. Please copy it for future use`);
    req.flash("success", "Admin successfully created");
    res.redirect("/adminLogin");
  }

  async function adminSignup(req, res) {
    res.render("adminSignup");
  }

  async function adminLogout(req, res) {
    req.session.destroy();
    res.redirect("/adminSignup");
  }

  async function adminReset(req, res) {
    await waiters.theReset();
    res.redirect("/admin");
  }

  async function theDeleteWaiter(req, res) {
    const waiterName = req.body.deleteName;
    console.log(waiterName);
    const getTheWaiter = await waiters.getWaiter(waiterName);
    const waiterId = getTheWaiter.id;
    await waiters.deleteWaiter(waiterId);
    res.redirect("/admin");
  }

  return {
    defaultRoute,
    getWaiter,
    theAdmin,
    theReset,
    postWaiter,
    addWaiter,
    resetIndividual,
    adminLogin,
    adminLoginPost,
    adminLogout,
    adminReset,
    adminSignup,
    adminSignupPost,
    adminPost,
    waiterPage,
    theDeleteWaiter,
  };
};

export default theWaiters;
