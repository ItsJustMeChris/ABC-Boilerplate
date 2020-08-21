import type { Group } from 'https://deno.land/x/abc@v1.0.3/mod.ts';

import { renew } from '../controllers/jwt.ts';

export default (group: Group): void => {
    group.post('/renew', renew);
}