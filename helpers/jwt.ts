import { validateJwt, JwtValidation } from "https://deno.land/x/djwt/validate.ts";
import { HttpException } from "https://deno.land/x/abc@v1.0.3/http_exception.ts";
import { Status } from "https://deno.land/std@0.65.0/http/http_status.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
};

const secret: string | undefined = Deno.env.get('JWT_SECRET') || undefined;

if (!secret) {
    throw new Error("JWT Secret not set");
}

const tryValidate = async (token: string) => {
    const jwt: JwtValidation = await validateJwt({ jwt: token, key: secret, algorithm: "HS256" });
    if (!jwt.isValid) {
        if (jwt.isExpired) {
            throw new HttpException("Login Time-out", Status.Forbidden);
        }
        throw new HttpException("Forbidden", Status.Forbidden);
    } else {
        return jwt.payload;
    }
};

const tryMake = async (data: any, exp: number = 300) => {
    const payload: Payload = { ...data, exp: setExpiration(exp) };
    const jwt = await makeJwt({ header, payload, key: secret });

    return jwt;
}

export {
    tryValidate,
    tryMake
}