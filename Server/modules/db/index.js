

import { createRequire } from "module";
const require = createRequire(import.meta.url);


const { Client }  = require ('pg');

const POSTGRES_HOST = process.env.POSTGRES_HOST
const POSTGRES_PORT = process.env.POSTGRES_PORT
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD


const client = new Client({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
});

client.connect();

export default client;