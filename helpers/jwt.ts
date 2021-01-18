import { verify, create, getNumericDate, Payload } from "https://deno.land/x/djwt/mod.ts";
import { HttpException } from "https://deno.land/x/abc/http_exception.ts";
import { Status } from "https://deno.land/std/http/http_status.ts";

const secret: string | undefined = Deno.env.get('JWT_SECRET') || undefined;

if (!secret) {
    throw new Error("JWT Secret not set");
}

const tryValidate = async (token: string) => {
    try {
        const jwt: Payload = await verify(token, secret, "HS512");
        return jwt;
    } catch (error) {
        if (error.message === 'The jwt is expired.') {
            throw new HttpException("Login Time-out", Status.Gone);
        }
        throw new HttpException("Forbidden", Status.Forbidden);
    }
};

const tryMake = async (data: any, exp: number = 300) => {
    const jwt = await create(
        {
            alg: "HS512",
            typ: "JWT"
        },
        {
            exp: getNumericDate(exp),
            ...data

        },
        secret
    )
    return jwt;
}

export {
    tryValidate,
    tryMake
}