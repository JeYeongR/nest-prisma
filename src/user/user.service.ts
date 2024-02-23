import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    createUserDto.password = hashedPassword;

    await this.prisma.user.create({ data: createUserDto });
  }

  async doLogin(loginDto: LoginDto): Promise<TokenDto> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!foundUser) {
      throw new NotFoundException('NOT_FOUND_USER');
    }

    const isMatch = await bcrypt.compare(loginDto.password, foundUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('INVALID_PASSWORD');
    }

    const token = this.generateAccessToken(foundUser.id);

    return new TokenDto(token);
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async findOneById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  private generateAccessToken(userId: number): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '1h' });
  }
}
