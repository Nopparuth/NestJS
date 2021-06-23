import { CommentsRepository } from './comments.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentsDto } from './dto/create-comments-dto';
import * as fsExtra from 'fs-extra';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentsRepository: CommentsRepository,
  ) {}

  addComments(createCommentsDto: CreateCommentsDto) {
    return this.commentsRepository.addComments(createCommentsDto);
  }

  getComments(keyword: string) {
    if (keyword) {
      const query = this.commentsRepository.createQueryBuilder('comments');
      query.andWhere('comments.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
      return query.getMany();
    } else {
      return this.commentsRepository.find();
    }
  }

  async getCommentsById(id: number) {
    const found = await this.commentsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Product ${id} is not found!`);
    }
    return found;
  }

  async deleteComments(id: number) {
    const found = await this.getCommentsById(id);
    const { image } = found;
    await fsExtra.remove(`upload/${image}`);
    return await this, this.commentsRepository.delete(id);
  }

  async updateComments(id: number, CreateCommentsDto: CreateCommentsDto) {
    const comments = await this.getCommentsById(id);
    const { title, desc } = CreateCommentsDto;
    comments.title = title;
    comments.desc = desc;
    await comments.save();
    return comments;
  }
}
