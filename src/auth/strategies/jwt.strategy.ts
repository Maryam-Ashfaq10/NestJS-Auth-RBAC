import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    // Re-fetch the user from DB rather than trusting the token blindly.
    // This ensures a deleted/deactivated user is rejected even with a valid token.
    const user = await this.usersService.findById(payload.sub).catch(() => null);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    // Whatever is returned here becomes `request.user` in your controllers
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}