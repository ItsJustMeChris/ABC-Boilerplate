import { Application } from 'https://deno.land/x/abc/mod.ts';

import userGroup from './user.ts';
import tokenGroup from './token.ts';

export default (app: Application): void => {
    userGroup(app.group('user'));
    tokenGroup(app.group('token'));
}