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

  @ManyToOne(() => Collection, (collection) => collection.recipes)
  collection: Collection;
}
