import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CollectionEntry } from "../CollectionEntry";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  email: string;

  @Column("text", { default: "testingForNow" })
  hashedPassword: string;

  @OneToMany(() => CollectionEntry, (collectionEntry) => collectionEntry.user)
  collections: CollectionEntry[];
}
