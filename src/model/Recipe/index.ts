import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CollectionEntry } from "../CollectionEntry";

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  rowId: number;

  @Column("boolean", { default: true })
  isPrivate: boolean;

  @Column("text", { nullable: false })
  collectionEntryId: string;

  @OneToOne(() => CollectionEntry)
  @JoinColumn()
  collectionEntry: CollectionEntry;
}
