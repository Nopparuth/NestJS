import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { AuthJwtStrategy } from './auth.jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'codemobile555',
      signOptions: {
        expiresIn: 5000,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtStrategy],
  exports: [AuthJwtStrategy, PassportModule],
})
export class AuthModule {}
