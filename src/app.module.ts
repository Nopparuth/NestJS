import { typeOrmConfig } from './config/typeorm.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostsModule, TypeOrmModule.forRoot(typeOrmConfig), CommentsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
