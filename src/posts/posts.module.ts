import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
