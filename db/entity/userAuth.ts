import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './user';

@Entity('user_auths')
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  identity_type!: string;

  @Column()
  identifier!: string;

  @Column()
  credential!: string;

  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
