import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto, CreateUserDto } from "../user/user.dto";
import { UserEntity } from "../user/user.entity";
import { JwtPayload } from "../shared/types/jwt-payloadTypes";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async createUser(user: CreateUserDto): Promise<UserEntity> {
    const newUser: UserEntity = new UserEntity();
    newUser.email = user.email;
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const hashedRepeatedPassword = await bcrypt.hash(user.repeatPassword, salt);
    if (hashedPassword === hashedRepeatedPassword) {
      newUser.password = hashedPassword;
    } else {
      throw new InternalServerErrorException("Passwords do not match");
    }

    try {
      return await this.usersRepository.save({ ...newUser });
    } catch (error) {
      if (error.code === "23505") throw new ConflictException("Email is already in use");
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string; user: UserEntity }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken, user };
    } else {
      throw new UnauthorizedException("Incorrect login details");
    }
  }
}
