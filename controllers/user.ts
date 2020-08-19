import type { Context } from 'https://deno.land/x/abc@v1.0.3/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

import { User } from '../models/user.ts';

import createStatus from '../helpers/status.ts';
import UserInterface from '../interfaces/user.ts';
import StatusInterface from '../interfaces/status.ts';

const get = async (context: Context): Promise<UserInterface | StatusInterface> => {
    try {
        const { id = 0 }: UserInterface = context.params;
        const user: UserInterface = await User.select('name').find(id);

        if (!user) return createStatus({ status: 'error', message: 'User not found' });

        return user;

    } catch (error) {
        return createStatus({ status: 'error', message: 'User not found' });
    }
}

const create = async (context: Context): Promise<UserInterface | StatusInterface> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body();

        if (!name || !password) return createStatus({ status: 'error', message: 'Username or password is missing' });

        const hashed = await bcrypt.hash(password);

        const user: UserInterface = await User.create({
            name,
            password: hashed,
        });

        return user;
    } catch (error) {
        return createStatus({ status: 'error', message: 'Username already taken' });
    }
}

const login = async (context: Context): Promise<StatusInterface> => {
    try {
        const { name = '', password = '' }: UserInterface = await context.body();

        if (!name || !password) return createStatus({ status: 'error', message: 'Username or password is missing' });

        const { password: fromDB = '' }: UserInterface = await User.where({ name }).select('password').first();
        const valid: boolean = await bcrypt.compare(password, fromDB);

        if (!valid) return createStatus({ status: 'error', message: 'Password is invalid' });

        return createStatus({ status: 'success', message: 'Logged In' });
    } catch (error) {
        return createStatus({ status: 'error', message: 'Username or password is invalid' });
    }
}

export {
    get,
    create,
    login,
}