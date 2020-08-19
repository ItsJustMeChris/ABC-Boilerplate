import { Application } from 'https://deno.land/x/abc@v1.0.3/mod.ts';

import userGroup from './user.ts';

export default (app: Application): void => {
    userGroup(app.group('user'));
}