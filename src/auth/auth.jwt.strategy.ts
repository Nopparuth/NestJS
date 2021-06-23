import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { read } from 'fs';

export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'codemobile555',
    });
  }

  async validate(payload) {
    const { username } = payload;
    const user = await this.userRepository.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
