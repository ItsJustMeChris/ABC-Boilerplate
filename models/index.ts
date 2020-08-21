import { Database } from 'https://deno.land/x/denodb/mod.ts';

import User from './user.ts';
import RenewKey from './renew-key.ts';

const db: Database = new Database('postgres', {
    host: 'localhost',
    username: 'dev',
    password: 'dev',
    database: 'cntnt',
});

db.link([User, RenewKey]);

// await db.sync({ drop: false });

export {
    User,
    RenewKey
}