import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Recipe } from "../Recipe";
import { User } from "../User";

@Entity()
export class Collection extends BaseEntity {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  name: string;

  @Column("boolean", { default: true })
  isPrivateCollection: boolean;

  @ManyToOne(
    () => Collection,
    (collectionEntry) => collectionEntry.subCollections,
    { nullable: true }
  )
  parent: Collection;

  @OneToMany(() => Collection, (collectionEntry) => collectionEntry.parent)
  subCollections: Collection[];

  @OneToMany(() => Recipe, (recipe) => recipe.collection)
  recipes: Recipe[];

  @ManyToOne(() => User, (user) => user.collections)
  user: User;
}
