import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  test: string;

  @Column("text")
  message: string;
}
