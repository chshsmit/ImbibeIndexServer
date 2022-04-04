import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Recipe } from "../Recipe";
import { TakeIngredients } from "../TakeIngredients";

@Entity()
export class RecipeTake extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("boolean", { default: false })
  isPrivate: boolean;

  @Column("text")
  name: string;

  @Column("integer")
  takeNumber: number;

  @Column("boolean", { default: false })
  isPublished: boolean;

  @Column("text", { nullable: true })
  takeNotes: string;

  @OneToMany(
    () => TakeIngredients,
    (takeIngredients) => takeIngredients.recipeTake
  )
  ingredients: TakeIngredients[];

  @ManyToOne(() => Recipe, (recipe) => recipe.takes)
  recipe: Recipe;
}
