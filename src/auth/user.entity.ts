import { Comments } from './../comments/comments.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Posts } from 'src/posts/posts.entity';
// import { Comments } from 'src/comments/comments.entity';

@Entity() // Optional set naming
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany((type) => Posts, (post) => post.user, { eager: true })
  posts: Posts;

  @OneToMany((type) => Comments, (comment) => comment.user, { eager: true })
  comments: Comments;

  async verifyPassword(password) {
    const hashPassword = await bcrypt.hash(password, this.salt);
    return this.password === hashPassword;
  }
}
