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


INSERT INTO theDays (name)
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





