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
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangeStringCasePipe } from 'src/pipes/change-string-case.pipe';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments-dto';
import { extname } from 'path';
import * as fsExtra from 'fs-extra';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  getComments(@Query('keyword') keyword: string, @Req() req) {
    // console.log('Added by Middleware : ' + req.timestamp);
    return this.commentsService.getComments(keyword);
  }

  @Get('/:id')
  getCommentsById(@Param('id') id: number) {
    return this.commentsService.getCommentsById(id);
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
  async addComments(
    @UploadedFile() file,
    @Body() createCommentsDto: CreateCommentsDto,
  ) {
    const product = await this.commentsService.addComments(createCommentsDto);
    const imageFile = product.id + extname(file.filename);
    fsExtra.move(file.path, `upload/${imageFile}`);
    product.image = imageFile;
    await product.save();
    return product;
  }

  @Delete('/:id')
  deleteCommentsById(@Param('id') id: number) {
    return this.commentsService.deleteComments(id);
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
  async updateCommentsById(
    @UploadedFile() file,
    @Param('id') id: number,
    @Body() createCommentsDto: CreateCommentsDto,
  ) {
    const comments = await this.commentsService.updateComments(
      id,
      createCommentsDto,
    );
    if (file) {
      fsExtra.remove(`upload/${comments.image}`);
      const imageFile = id + extname(file.filename);
      fsExtra.move(file.path, `upload/${imageFile}`);
      comments.image = imageFile;
      await comments.save();
    }

    return comments;
  }
}
