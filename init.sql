CREATE TABLE passwords (
    password text PRIMARY KEY UNIQUE,
    max_uses int,
    times_used int,
    access_ips text[],
    uploads text[]
);