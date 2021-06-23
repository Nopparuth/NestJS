import { CreatePostsDto } from './dto/create-posts-dto';
import { Repository, EntityRepository } from 'typeorm';
import { Posts } from './posts.entity';

@EntityRepository(Posts)
export class PostsRepository extends Repository<Posts> {
  async addPosts(createPostsDto: CreatePostsDto): Promise<Posts> {
    const { title, desc } = createPostsDto;

    const post = new Posts();
    post.title = title;
    post.desc = desc;
    await post.save();

    return post;
  }
}
