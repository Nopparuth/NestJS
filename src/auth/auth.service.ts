import { UserCredentialDto } from './dto/user-credential.dto';
import { UserRepository } from './user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getUsersById(id: number) {
    const found = await this.userRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`User ${id} is not found`);
    }
    return found;
  }

  async getUsersPostsById(id: number) {
    console.log('test');
    const found = await this.userRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`User ${id} is not found`);
    }
    return found;
    console.log(found);
  }

  signUp(userCredentialDto: UserCredentialDto) {
    return this.userRepository.createUser(userCredentialDto);
  }

  async signIn(userCredentialDto: UserCredentialDto) {
    const username = this.userRepository.verifyUserPassword(userCredentialDto);
    if (!username) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username };
    const token = await this.jwtService.sign(payload);
    return { token };
  }
}
