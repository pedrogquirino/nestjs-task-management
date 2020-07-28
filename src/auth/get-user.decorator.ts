import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { runInNewContext } from "vm";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});