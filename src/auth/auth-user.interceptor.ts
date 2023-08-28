import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    constructor(private authService: AuthService) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        console.log('AuthUserInterceptor');
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        console.log({ token123: request.headers.authorization });

        if (request.headers.authorization) {
            console.log({ token123: request.headers.authorization });
            const user = await this.authService.validateUser(request.headers.authorization)
            request.user = user;
        }

        return next.handle();
    }
}
