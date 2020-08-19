import type { Context } from "https://deno.land/x/abc@v1.0.3/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from '../models/user.ts';

const get = async (context: Context): Promise<User> => {
    try {
        const { id } = context.params;
        const user = await User.select('name').find(id);
        return user || {};
    } catch (error) {
        return error;
    }
}

const create = async (context: Context): Promise<User> => {
    const { name, password } = await context.body();
    const hashed = await bcrypt.hash(password);
    try {
        const user: User = await User.create({
            name,
            password: hashed,
        });
        return user;
    } catch (error) {
        return error;
    }
}

export {
    get,
    create
}