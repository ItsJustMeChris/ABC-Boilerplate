import { Context } from 'https://deno.land/x/abc/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

import { User, RenewKey } from '../models/index.ts';

import { tryMake } from '../helpers/jwt.ts';

import StatusInterface from '../interfaces/status.ts';
import UserInterface from "../interfaces/user.ts";
import JWTPayloadInterface from "../interfaces/jwt-payload.ts";
import { Status } from "https://deno.land/std@0.81.0/http/http_status.ts";

const get = async (context: Context): Promise<UserInterface | StatusInterface | any> => {
    try {
        const { id = 0 }: UserInterface = context.params;
        const user: UserInterface = await User.select('name').find(id) as UserInterface;

        if (!user) return context.json(
            {
                status: 'error',
                message: 'User not found'
            },
            Status.NotFound
        );

        return user;
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'User not found'
            }
            ,
            Status.NotFound
        );
    }
}

const create = async (context: Context): Promise<UserInterface | StatusInterface | any> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body as UserInterface;
        if (!name || !password) return context.json({ status: 'error', message: 'Username or password is missing' }, Status.BadRequest);

        const hashed = await bcrypt.hash(password);

        const user: User = await User.create({
            name,
            password: hashed,
        }) as User;

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr;

        const jwt = await tryMake({ user: { ...user.toJSON() } });
        const renewJWT = await tryMake({ user: { ...user.toJSON() } }, 60 * 60 * 24 * 31);

        const renewKey: RenewKey = await RenewKey.create(
            {
                key: renewJWT,
                ip: ip.hostname,
                userId: user.id
            }
        ) as RenewKey;

        return context.json(
            {
                status: 'success',
                message: 'Created User',
                jwt,
                renewKey
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Username already taken'
            },
            Status.Conflict
        );
    }
}

const login = async (context: Context): Promise<StatusInterface | any> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body as UserInterface;

        if (!name || !password) return context.json({ status: 'error', message: 'Username or password is missing' }, Status.BadRequest);

        const user: User = await User.where({ name }).first() as User;

        const valid: boolean = await bcrypt.compare(password, String(user.password));
        if (!valid) return context.json({ status: 'error', message: 'Password is invalid' }, Status.Unauthorized);

        const ip: Deno.NetAddr = <Deno.NetAddr>context.request.conn.remoteAddr;

        const jwt = await tryMake({ user: { ...user.toJSON() } });
        const renewJWT = await tryMake({ user: { ...user.toJSON() } }, 60 * 60 * 24 * 31);

        const renewKey: RenewKey = await RenewKey.create({ key: renewJWT, ip: ip.hostname, userId: user.id }) as RenewKey;

        return context.json(
            {
                status: 'success',
                message: 'Logged In',
                jwt,
                renewKey
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Username or password is invalid'
            },
            Status.Unauthorized
        );
    }
}

const update = async (context: Context): Promise<StatusInterface | any> => {
    try {
        const { id }: { id?: number } = context.params;
        const { name = '', password = '' }: UserInterface = await context.body as UserInterface;

        if (!name || !password) return context.json({ status: 'error', message: 'Username or password is missing' }, Status.BadRequest);

        const jwt: JWTPayloadInterface = context.get('jwt-payload') as JWTPayloadInterface;

        if (jwt.user.id != id) {
            return context.json(
                {
                    status: 'error',
                    message: 'Failed to update user'
                },
                Status.Forbidden
            );
        }

        const user: User = await User.where({ id: id as number }).first() as User;;

        const hashed = await bcrypt.hash(password);

        if (name !== '') {
            user.name = name;
        }

        if (password != '') {
            user.password = hashed;
        }

        user.update();

        return context.json(
            {
                status: 'success',
                message: 'Updated User',
                user: {
                    ...user.toJSON()
                }
            }
        );
    } catch (error) {
        return context.json(
            {
                status: 'error',
                message: 'Failed to update user'
            },
            Status.InternalServerError
        );
    }
}

export {
    get,
    create,
    login,
    update,
}