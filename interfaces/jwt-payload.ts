import UserInterface from "./user.ts";

export default interface JWTPayloadInterface {
    exp: number;
    user: UserInterface;
}