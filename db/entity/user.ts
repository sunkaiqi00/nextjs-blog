import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  nickname!: string;

  @Column()
  job!: string;

  @Column()
  avatar!: string;

  @Column()
  introduce!: string;
}