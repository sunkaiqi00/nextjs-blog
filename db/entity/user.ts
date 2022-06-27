import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
// import { Tag } from './tag';

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

  // @ManyToMany(() => Tag, tag => tag.users, {
  //   cascade: true
  // })
  // tags!: Tag[];
}
