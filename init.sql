CREATE TABLE passwords (
    password text PRIMARY KEY UNIQUE,
    max_uses int,
    times_used int,
    access_ips text[],
    uploads text[]
);

CREATE TABLE adminkeys (
    key text PRIMARY KEY UNIQUE,
    expires bigint
);