import { Database } from 'https://deno.land/x/denodb/mod.ts';

import { User } from './user.ts';

export default (db: Database): void => {
    db.link([User]);
}