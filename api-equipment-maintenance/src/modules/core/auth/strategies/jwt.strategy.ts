import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { jwtConfigs } from '../../../../common/configs'
import { UserStatus } from '../../../../common/constants';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfigs.secret,
        });
    }

    async validate(payload: any, done: Function) {
        const account = await this.userService.findByPayload(payload.email);
        if (!account) {
            return done(new UnauthorizedException(), false);
        }

        if (account.status === UserStatus.LOCK) {
            return done(new ForbiddenException('USER_LOCKED'), false);
        }

        done(null, account);
    }
}