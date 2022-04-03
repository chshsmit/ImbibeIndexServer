import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Collection } from "../Collection";
import { RecipeTake } from "../RecipeTake";

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryColumn("text")
  recipeId: string;

  @Column("boolean", { default: true })
  isPrivate: boolean;

  @Column("text")
  name: string;

  @Column("text", { default: "cocktail" })
  recipeType: "cocktail" | "syrup" | "liqueur" | "other";

  @ManyToOne(() => Collection, (collection) => collection.recipes)
  collection: Collection;

  @OneToMany(() => RecipeTake, (recipeTake) => recipeTake.recipe)
  takes: RecipeTake[];
}
