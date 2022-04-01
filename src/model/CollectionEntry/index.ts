import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "../User";

@Entity()
export class CollectionEntry extends BaseEntity {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  type: "recipe" | "collection";

  @Column("text")
  name: string;

  @ManyToOne(
    () => CollectionEntry,
    (collectionEntry) => collectionEntry.subCollections,
    { nullable: true }
  )
  parent: CollectionEntry;

  @OneToMany(() => CollectionEntry, (collectionEntry) => collectionEntry.parent)
  subCollections: CollectionEntry[];

  @ManyToOne(() => User, (user) => user.collections)
  user: User;
}
