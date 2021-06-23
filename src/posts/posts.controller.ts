import { ChangeStringCasePipe } from './../pipes/change-string-case.pipe';
import { CreatePostsDto } from './dto/create-posts-dto';
import { PostsService } from './posts.service';
import { diskStorage } from 'multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { title } from 'process';
import { Posts } from './posts.entity';
import * as fsExtra from 'fs-extra';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getPosts(@Query('keyword') keyword: string, @Req() req) {
    // console.log('Added by Middleware : ' + req.timestamp);
    return this.postsService.getPosts(keyword);
  }

  @Get('/:id')
  getPostsById(@Param('id') id: number) {
    return this.postsService.getPostsById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString())
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(ValidationPipe)
  @UsePipes(new ChangeStringCasePipe())
  async addPosts(@UploadedFile() file, @Body() createPostsDto: CreatePostsDto) {
    const product = await this.postsService.addPosts(createPostsDto);

    const imageFile = product.id + extname(file.filename);
    fsExtra.move(file.path, `upload/${imageFile}`);
    product.image = imageFile;
    await product.save();
    return product;
    // return this.postsService.addPosts(createPostsDto);
  }

  @Delete('/:id')
  deletePostsById(@Param('id') id: number) {
    return this.postsService.deletePosts(id);
  }

  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString());
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updatePostsById(
    @UploadedFile() file,
    @Param('id') id: number,
    @Body() createPostsDto: CreatePostsDto,
  ) {
    const posts = await this.postsService.updatePosts(id, createPostsDto);
    if (file) {
      fsExtra.remove(`upload/${posts.image}`);
      const imageFile = id + extname(file.filename);
      fsExtra.move(file.path, `upload/${imageFile}`);
      posts.image = imageFile;
      await posts.save();
    }

    return posts;
  }
}
