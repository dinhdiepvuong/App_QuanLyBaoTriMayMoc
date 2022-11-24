import { ResponseCommon } from 'src/common/dto/respone.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../../../../common/constants';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/modules/users/users.service';
import { LocalStragetyDto } from '../dto/local-stragety.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<LocalStragetyDto> {
        const user = await this.userService.findByPayload(email);
        if (!user) {
            throw new UnauthorizedException('INVALID_CREDENTIALS');
        }

        if (user.status === UserStatus.LOCK) {
            throw new ForbiddenException('USER_LOCKED');
        }

        if (user.isDelete === true){
            throw new ForbiddenException("USER_IS_DELETED");
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new ForbiddenException('USER_NOT_ACTIVE');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('INVALID_CREDENTIALS')
        }       
        
        const result = plainToClass(LocalStragetyDto, {
            sub: user.id,
            email: user.id,
            role: user.role,
            status: user.status,
        });
        return result;
    }
}