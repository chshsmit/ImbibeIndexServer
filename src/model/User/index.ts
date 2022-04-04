import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Collection } from "../Collection";

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

  @Column("text", { default: "testingForNow", select: false })
  hashedPassword: string;

  @OneToMany(() => Collection, (collectionEntry) => collectionEntry.user)
  collections: Collection[];
}
