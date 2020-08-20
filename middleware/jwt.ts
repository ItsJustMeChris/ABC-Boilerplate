import { Context } from "https://deno.land/x/abc@v1.0.3/context.ts";
import { HandlerFunc } from "https://deno.land/x/abc@v1.0.3/types.ts";

import { tryValidate } from '../helpers/jwt.ts';
import { HttpException } from "https://deno.land/x/abc@v1.0.3/http_exception.ts";
import { Status } from "https://deno.land/std@0.65.0/http/http_status.ts";

export default (next: HandlerFunc): HandlerFunc => async (context: Context) => {
    const { token } = context.params;
    if (!token) {
        const { token } = await context.body();
        if (!token) {
            const { token } = context.queryParams;
            const payload = await tryValidate(token);
            context.set('jwt-payload', payload);
            return next(context);
        }
        const payload = await tryValidate(token);
        context.set('jwt-payload', payload);
        return next(context);
    } else {
        const payload = await tryValidate(token);
        context.set('jwt-payload', payload);
    }
    throw new HttpException("Forbidden", Status.Forbidden);
};