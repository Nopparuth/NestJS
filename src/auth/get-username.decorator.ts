import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUsername = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.username;
  },
);
