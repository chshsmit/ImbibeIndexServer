import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RecipeTake } from "../RecipeTake";

@Entity()
export class TakeIngredients extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  ingredientName: string;

  @Column("text")
  ingredientUnit: string;

  @Column("decimal")
  ingredientAmount: number;

  // We can use a recipe that we have for simple syrup for example
  @Column("text", { nullable: true })
  ingredientRecipeId?: string;

  @ManyToOne(() => RecipeTake, (recipeTake) => recipeTake.ingredients)
  recipeTake: RecipeTake;
}
