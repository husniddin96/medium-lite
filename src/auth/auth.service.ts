// auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserInput } from './dto/login-input';

interface TokenPayload {
    email: string;
    sub: number;
    role: string;
    id?: number
}
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private userService: UserService, private configService: ConfigService) { }

    async validateUser(token: string): Promise<any> {
        const payload: TokenPayload = await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_SECRET') });
        const user = this.userService.findOneByEmail(payload.email);
        return user;
    }

    async login(credentials: LoginUserInput) {
        const user = await this.userService.findOneByEmail(credentials.email);
        const payload = { email: user.email, sub: user.id, role: user.role };
        const t = {
            ...this.generateAccessToken(payload),
            ...this.generateRefreshToken(payload), // Refresh token with a longer validity.
        };

        console.log({ t, user, payload })

        return {
            ...this.generateAccessToken(payload),
            ...this.generateRefreshToken(payload), // Refresh token with a longer validity.
        };
    }

    generateAccessToken(user: User | TokenPayload) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: '1h',
                secret: this.configService.getOrThrow('JWT_SECRET')
            })
        };
        console.log({ token })
        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: '1h',
                secret: this.configService.getOrThrow('JWT_SECRET')
            })
        };
    }

    async generateAccessTokenWithRefToken(refreshToken: string) {
        const data: TokenPayload = await this.jwtService.verifyAsync(refreshToken, {secret: this.configService.getOrThrow('JWT_SECRET')});
        return this.generateAccessToken(data);
    }

    generateRefreshToken(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, };
        return {
            refreshToken: this.jwtService.sign(payload, {
                expiresIn: '30d',
                secret: this.configService.getOrThrow('JWT_SECRET')
            })
        };
    }
}
