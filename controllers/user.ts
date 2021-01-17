import type { Context } from 'https://deno.land/x/abc/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

import { User, RenewKey } from '../models/index.ts';

import { tryMake } from '../helpers/jwt.ts';

import createStatus from '../helpers/status.ts';
import StatusInterface from '../interfaces/status.ts';
import RenewKeyInterface from '../interfaces/renew-key.ts';
import UserInterface from "../interfaces/user.ts";

const get = async (context: Context): Promise<UserInterface | StatusInterface | any> => {
    try {
        const { id = 0 }: UserInterface = context.params;
        const user: UserInterface = await User.select('name').find(id) as UserInterface;

        if (!user) return createStatus({ status: 'error', message: 'User not found' });

        return user;

    } catch (error) {
        return createStatus({ status: 'error', message: 'User not found' });
    }
}

const create = async (context: Context): Promise<UserInterface | StatusInterface | any> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body as UserInterface;
        if (!name || !password) return createStatus({ status: 'error', message: 'Username or password is missing' });

        const hashed = await bcrypt.hash(password);
        const user: UserInterface = await User.create({
            name,
            password: hashed,
        }) as UserInterface;

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr;

        const jwt = await tryMake({ user: { name: user.name, id: user.id } });

        const renewJWT = await tryMake({ user: { id: user.id, name: user.name } }, 60 * 60 * 24 * 31);

        const renewKey: RenewKeyInterface = await RenewKey.create({ key: renewJWT, ip: ip.hostname, userId: Number(user.id) }) as RenewKeyInterface;

        return createStatus({ status: 'success', message: 'Created User', payload: { jwt, renewKey } });
    } catch (error) {
        return createStatus({ status: 'error', message: 'Username already taken' });
    }
}

const login = async (context: Context): Promise<StatusInterface | any> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body as UserInterface;

        if (!name || !password) return createStatus({ status: 'error', message: 'Username or password is missing' });

        const user: UserInterface = await User.where({ name }).first() as UserInterface;

        const valid: boolean = await bcrypt.compare(password, String(user.password));
        if (!valid) return createStatus({ status: 'error', message: 'Password is invalid' });

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr;


        const jwt = await tryMake({ user: { id: user.id, name: user.name } });
        const renewJWT = await tryMake({ user: { id: user.id, name: user.name } }, 60 * 60 * 24 * 31);

        const renewKey: RenewKeyInterface = await RenewKey.create({ key: renewJWT, ip: ip.hostname, userId: Number(user.id) }) as RenewKeyInterface;

        return createStatus({ status: 'success', message: 'Logged In', payload: { jwt, renewKey } });
    } catch (error) {
        return createStatus({ status: 'error', message: 'Username or password is invalid' });
    }
}

export {
    get,
    create,
    login,
}