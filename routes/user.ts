import type { Group } from 'https://deno.land/x/abc@v1.0.3/mod.ts';

import { create, get, login } from '../controllers/user.ts';

export default (group: Group): void => {
    group.post('/new', create);
    group.get('/:id', get);
    group.post('/login', login);
}