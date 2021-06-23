import { PostsRepository } from './posts.repository';
import { CreatePostsDto } from './dto/create-posts-dto';
import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fsExtra from 'fs-extra';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  addPosts(createPostsDto: CreatePostsDto) {
    // console.log(`title: ${title}, desc: ${desc}`);
    return this.postsRepository.addPosts(createPostsDto);
  }

  getPosts(keyword: string) {
    if (keyword) {
      const query = this.postsRepository.createQueryBuilder('posts');
      query.andWhere('posts.name LIKE :keyword', { keyword: `%${keyword}%` });
      return query.getMany();
    } else {
      return this.postsRepository.find();
    }
  }

  async getPostsById(id: number) {
    const found = await this.postsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Product ${id} is not found!`);
    }
    return found;
  }

  async deletePosts(id: number) {
    const found = await this.getPostsById(id);
    const { image } = found;
    await fsExtra.remove(`upload/${image}`);
    return await this, this.postsRepository.delete(id);
  }

  async updatePosts(id: number, CreatePostsDto: CreatePostsDto) {
    const posts = await this.getPostsById(id);
    const { title, desc } = CreatePostsDto;
    posts.title = title;
    posts.desc = desc;
    await posts.save();
    return posts;
  }
}
