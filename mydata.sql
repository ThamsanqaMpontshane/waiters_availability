CREATE TABLE waiter (
    id serial primary key,
    name varchar(255) not null
);
CREATE TABLE theDays (
    id serial primary key,
    name varchar(255) not null
);

INSERT INTO theDays (name) VALUES ('Monday');
INSERT INTO theDays (name) VALUES ('Tuesday');
INSERT INTO theDays (name) VALUES ('Wednesday');
INSERT INTO theDays (name) VALUES ('Thursday');
INSERT INTO theDays (name) VALUES ('Friday');
INSERT INTO theDays (name) VALUES ('Saturday');
INSERT INTO theDays (name) VALUES ('Sunday');


create table theSchedule (
    id INTEGER PRIMARY KEY,
    waiter_id INTEGER NOT NULL,
    day_id INTEGER NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES waiter (id),
    FOREIGN KEY (day_id) REFERENCES theDays (id)
);

INNER JOIN theDays on theSchedule.day_id = theDays.id;
INNER JOIN waiter on theSchedule.waiter_id = waiter.id




