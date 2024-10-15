CREATE TABLE passwords (
    password text PRIMARY KEY UNIQUE,
    max_uses int,
    times_used int,
    access_ips text[],
    uploads text[]
);

CREATE TABLE admin_keys (
                       key text PRIMARY KEY UNIQUE,
                       expires bigint
);

CREATE TABLE admin_logins (
                       username text unique,
                       salt text,
                       hash text
);
