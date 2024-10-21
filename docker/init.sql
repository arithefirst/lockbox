CREATE TABLE IF NOT EXISTS passwords (
                       password text PRIMARY KEY UNIQUE,
                       max_uses int,
                       times_used int,
                       access_ips text[],
                       uploads text[],
                       date bigint
);

CREATE TABLE IF NOT EXISTS admin_keys (
                       key text PRIMARY KEY UNIQUE,
                       username text,
                       expires bigint
);

CREATE TABLE IF NOT EXISTS admin_logins (
                       username text PRIMARY KEY UNIQUE,
                       salt text,
                       hash text
);

-- Set default login of "admin" and "changeme"
INSERT INTO admin_logins (username, salt, hash) VALUES ('admin', '2mm75gadHfyz8jEg',
'221ebd6085bb510914a295e7285b9a8dcbc957762ee844a7a9b3ff058bbbb687');
