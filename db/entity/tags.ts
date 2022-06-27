import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Article } from './article';
import { User } from './user';

@Entity('tags')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  title!: string;

  @Column()
  icon!: string;

  @Column()
  follow_count!: number;

  @Column()
  article_count!: number;

  @ManyToMany(() => User, {
    cascade: true
  })
  @JoinTable({
    name: 'tags_users_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users?: User[];

  @ManyToMany(() => Article, {
    cascade: true
  })
  @JoinTable({
    name: 'tags_article_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles?: Article[];
}
