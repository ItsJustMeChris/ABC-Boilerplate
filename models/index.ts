import { Database } from 'https://deno.land/x/denodb/mod.ts';

import User from './user.ts';
import RenewKey from './renew-key.ts';

const DB_HOST: string = Deno.env.get('DB_HOST') || '';
const DB_NAME: string = Deno.env.get('DB_NAME') || '';
const DB_USER: string = Deno.env.get('DB_USER') || '';
const DB_PORT: number = Number(Deno.env.get('DB_PORT') || 5432);
const DB_PASS: string = Deno.env.get('DB_PASS') || '';

const db: Database = new Database('postgres', {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
});

db.link([User, RenewKey]);

// await db.sync({ drop: false });

export {
    User,
    RenewKey
}