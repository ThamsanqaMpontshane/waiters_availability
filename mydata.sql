CREATE TABLE waiter
(
    id   serial primary key,
    name varchar(255) not null
);
CREATE TABLE theDays
(
    id   serial primary key,
    name varchar(255) not null
);
create table theSchedule
(
    id        serial primary key,
    waiter_id INTEGER NOT NULL,
    day_id    INTEGER NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES waiter (id),
    FOREIGN KEY (day_id) REFERENCES theDays (id)
);
create table myAdmins
(
    id       serial primary key,
    username varchar(255) not null,
    password varchar(255) not null
);


INSERT INTO theDays (dayName)
VALUES ('monday');
INSERT INTO theDays (name)
VALUES ('tuesday');
INSERT INTO theDays (name)
VALUES ('wednesday');
INSERT INTO theDays (name)
VALUES ('thursday');
INSERT INTO theDays (name)
VALUES ('friday');
INSERT INTO theDays (name)
VALUES ('saturday');
INSERT INTO theDays (name)
VALUES ('sunday');

-- insert into waiter (name)
-- values ('Mpho');
-- insert into waiter (name)
-- values ('Musa');
-- insert into waiter (name)
-- values ('Mandla');
--
-- insert into theSchedule (waiter_id, day_id)
-- values (24, 1);
-- insert into theSchedule (waiter_id, day_id)
-- values (24, 2);
-- insert into theSchedule (waiter_id, day_id)
-- values (24, 5);
-- insert into theSchedule (waiter_id, day_id)
-- values (25, 6);
-- insert into theSchedule (waiter_id, day_id)
-- values (25, 7);
-- insert into theSchedule (waiter_id, day_id)
-- values (26, 3);
-- insert into theSchedule (waiter_id, day_id)
-- values (26, 4);
-- insert into theSchedule (waiter_id, day_id)
-- values (26, 5);

-- INNER JOIN theDays on theSchedule.day_id = theDays.id;
-- INNER JOIN waiter on theSchedule.waiter_id = waiter.id

-- delete from theSchedule where id > 0;
-- delete from waiter where id > 0;





