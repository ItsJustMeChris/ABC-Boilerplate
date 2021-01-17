import type { Group } from 'https://deno.land/x/abc/mod.ts';

import { renew } from '../controllers/jwt.ts';

export default (group: Group): void => {
    group.post('/renew', renew);
}