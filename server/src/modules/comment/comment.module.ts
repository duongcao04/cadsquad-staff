import { Module } from '@nestjs/common';
import { JobCommentService } from './job-comment.service';
import { JobCommentController } from './job-comment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [JobCommentController],
  providers: [JobCommentService],
  exports: [JobCommentService],
})
export class CommentModule { }
