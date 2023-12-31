import { createRequire } from "module";
const require = createRequire(import.meta.url);


const { Client }  = require ('pg');


const POSTGRES_HOST = "localhost";
const POSTGRES_PORT = "2698"
const POSTGRES_DB = "MMORPG";
const POSTGRES_USER = "User";
const POSTGRES_PASSWORD = "user123";


const client = new Client({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
});

client.connect();

export default client;