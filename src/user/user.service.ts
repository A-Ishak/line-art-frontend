import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  public async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({ where: { email: email } });
  }

  public async checkJWTValidity(email: string) {
    if (await this.userRepository.findOneBy({ email: email })) {
      return "true";
    }
  }
}
