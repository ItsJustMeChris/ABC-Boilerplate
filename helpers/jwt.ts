import { validateJwt, JwtValidation } from "https://deno.land/x/djwt/validate.ts";
import { HttpException } from "https://deno.land/x/abc@v1.0.3/http_exception.ts";
import { Status } from "https://deno.land/std@0.65.0/http/http_status.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
};

const secret = "0iwgi0j3g9024gh034gh0g34h0g34h0g34j0g34j0vrnvnovsji0hfwj02fgh0g3noirb3nog4j0fwoinvd";

const tryValidate = async (token: string) => {
    const jwt: JwtValidation = await validateJwt({ jwt: token, key: secret, algorithm: "HS256" });
    if (!jwt.isValid) {
        if (jwt.isExpired) {
            throw new HttpException("Login Time-out", 440);
        }
        throw new HttpException("Forbidden", Status.Forbidden);
    } else {
        return jwt.payload;
    }
};

const tryMake = async (data: any) => {
    const payload: Payload = { ...data, exp: setExpiration(60 * 5) };
    const jwt = await makeJwt({ header, payload, key: secret });

    return jwt;
}

export {
    tryValidate,
    tryMake
}