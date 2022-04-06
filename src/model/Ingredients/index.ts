import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../User";

@Entity()
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  ingredientName: string;

  @Column("text", { nullable: true })
  ingredientRecipeId?: string;

  @ManyToOne(() => User, (user) => user.ingredients)
  user: User;
}
