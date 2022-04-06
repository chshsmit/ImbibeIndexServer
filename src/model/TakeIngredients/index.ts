import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ingredient } from "../Ingredients";
import { RecipeTake } from "../RecipeTake";

@Entity()
export class TakeIngredients extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  ingredientAmount: string;

  @ManyToOne(() => RecipeTake, (recipeTake) => recipeTake.ingredients)
  recipeTake: RecipeTake;

  @ManyToOne(() => Ingredient)
  ingredient: Ingredient;
}
