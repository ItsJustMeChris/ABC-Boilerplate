import type { Context } from 'https://deno.land/x/abc@v1.0.3/mod.ts';

import { tryMake } from '../helpers/jwt.ts';
import createStatus from '../helpers/status.ts';
import StatusInterface from '../interfaces/status.ts';
import { RenewKey } from '../models/index.ts';
import UserInterface from '../interfaces/user.ts';
import RenewKeyInterface from '../interfaces/renew-key.ts';

const renew = async (context: Context): Promise<StatusInterface> => {
    try {
        const { renewKey = '' } = await context.body();

        if (!renewKey) return createStatus({ status: 'error', message: 'A' });

        const key: RenewKeyInterface = await RenewKey.where('key', renewKey).first();
        const renewKeyUser: UserInterface = await RenewKey.where('id', key.id).user();

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr

        if (key.ip !== String(ip.hostname)) {
            return createStatus({ status: 'error', message: 'V' });
        }

        const jwt = await tryMake(renewKeyUser);
        return createStatus({ status: 'success', message: 'Renewed JWT', payload: jwt });
    } catch (error) {
        return createStatus({ status: 'error', message: 'C' });
    }
}

export {
    renew,
}