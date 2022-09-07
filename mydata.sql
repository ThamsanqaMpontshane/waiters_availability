CREATE TABLE waiter (
    id serial primary key,
    name varchar(255) not null
);
CREATE TABLE theDays (
    id serial primary key,
    name varchar(255) not null
);

create table theSchedule (
    id serial primary key,
    waiter_id INTEGER NOT NULL,
    day_id INTEGER NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES waiter (id),
    FOREIGN KEY (day_id) REFERENCES theDays (id)
);

-- create a table similar to the one above, but the waiter_id is equal to the name of the waiter from waiter table and the day_id is equal to the name of the day

create table theSchedule2 (
    id serial primary key,
    waiter_name varchar(255) not null,
    day_name varchar(255) not null,
    FOREIGN KEY (waiter_name) REFERENCES waiter (name),
    FOREIGN KEY (day_name) REFERENCES theDays (name)
);


-- fix this table to have the correct foreign keys






INSERT INTO theDays (name) VALUES ('monday');
INSERT INTO theDays (name) VALUES ('tuesday');
INSERT INTO theDays (name) VALUES ('wednesday');
INSERT INTO theDays (name) VALUES ('thursday');
INSERT INTO theDays (name) VALUES ('friday');
INSERT INTO theDays (name) VALUES ('saturday');
INSERT INTO theDays (name) VALUES ('sunday');


INNER JOIN theDays on theSchedule.day_id = theDays.id;
INNER JOIN waiter on theSchedule.waiter_id = waiter.id




