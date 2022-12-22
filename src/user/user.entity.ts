import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { IsEmail } from "class-validator";

@Entity({ name: "User" })
@Unique(["email"])
export class UserEntity {
  @PrimaryColumn({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
}
