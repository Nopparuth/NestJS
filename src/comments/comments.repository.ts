import { CreateCommentsDto } from './dto/create-comments-dto';
import { Repository, EntityRepository } from 'typeorm';
import { Comments } from './comments.entity';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {
  async addComments(createCommentsDto: CreateCommentsDto): Promise<Comments> {
    const { title, desc } = createCommentsDto;
    const comment = new Comments();
    comment.title = title;
    comment.desc = desc;
    await comment.save();
    return comment;
  }
}
