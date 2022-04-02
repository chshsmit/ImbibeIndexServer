import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Collection } from "../Collection";

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryColumn("text")
  recipeId: string;

  @Column("boolean", { default: true })
  isPrivate: boolean;

  @Column("text")
  name: string;

  @Column("text", { default: "cocktail" })
  recipeType: "cocktail" | "syrup" | "liqeur" | "other";

  @ManyToOne(() => Collection, (collection) => collection.recipes)
  collection: Collection;
}
