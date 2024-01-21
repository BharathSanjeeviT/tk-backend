-- CREATE DATABASE tk;
-- USE tk;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    clg_name VARCHAR(100),
    phone_no VARCHAR(20)
);

CREATE TABLE events (
    name VARCHAR(100),
    event_id SERIAL PRIMARY KEY,
    description TEXT,
    tag_line TEXT,
    rules TEXT,
    img_link TEXT,
    date DATE,
    team_size INTEGER,
    fee INTEGER,
    youtube TEXT,
    instagram TEXT,
    first_prize INTEGER,
    second_prize INTEGER,
    third_prize INTEGER
);

CREATE TABLE incharges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    phone_no VARCHAR(20)
);

CREATE TABLE incharge_event (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    incharge_id INTEGER,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (incharge_id) REFERENCES incharges (id)
);

CREATE TABLE batch (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    venue TEXT,
    date DATE,
    reg_count INTEGER,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE users_events (
    event_id INTEGER,
    user_id INTEGER,
    is_present BOOLEAN,
    paid BOOLEAN,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
