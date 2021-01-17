import type { Context } from 'https://deno.land/x/abc/mod.ts';

import { tryMake } from '../helpers/jwt.ts';
import createStatus from '../helpers/status.ts';
import type StatusInterface from '../interfaces/status.ts';
import { RenewKey } from '../models/index.ts';
import type UserInterface from '../interfaces/user.ts';
import type RenewKeyInterface from '../interfaces/renew-key.ts';

interface JWTBody {
    renewKey: string;
}

const renew = async (context: Context): Promise<StatusInterface | any> => {
    try {
        const { renewKey = '' } = await context.body as JWTBody;

        if (!renewKey) return createStatus({ status: 'error', message: 'Error Renewing Token' });

        const key: RenewKeyInterface = await RenewKey.where('key', renewKey).first() as RenewKeyInterface;
        const renewKeyUser: UserInterface = await RenewKey.where('id', key.id).user() as UserInterface;

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr

        const jwt = await tryMake({ user: { id: renewKeyUser.id, name: renewKeyUser.name } }, 60 * 60 * 24 * 31);
        return createStatus({ status: 'success', message: 'Renewed JWT', payload: jwt });
    } catch (error) {
        return createStatus({ status: 'error', message: 'Error Renewing Token' });
    }
}

export {
    renew,
}