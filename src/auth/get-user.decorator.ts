import { createParamDecorator } from "@nestjs/common";
import { runInNewContext } from "vm";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, req): User => {
    return req.user;
});