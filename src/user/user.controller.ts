import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { EmailToLowerCasePipe } from "../shared/pipes/validation-pipes";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(AuthGuard())
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post("/checkJWTValidity")
  public async checkJWTValidity(
    @Body(new EmailToLowerCasePipe())
    email: string,
  ): Promise<string | undefined> {
    return this.userService.checkJWTValidity(email);
  }
}
