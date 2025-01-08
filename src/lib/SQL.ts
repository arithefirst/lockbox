import postgres from "postgres";

const sql = postgres({
  host: "127.0.0.1",
  username: "postgres",
  password: "postgres",
  database: "lockbox",
  debug: true,
});

export default sql;
