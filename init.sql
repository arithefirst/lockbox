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

-- Set default login of "admin" and "changeme"
INSERT INTO admin_logins (username, salt, hash) VALUES (admin, 2mm75gadHfyz8jEg,
221ebd6085bb510914a295e7285b9a8dcbc957762ee844a7a9b3ff058bbbb687);
