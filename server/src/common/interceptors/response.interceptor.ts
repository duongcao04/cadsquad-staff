import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  result?: T;
  timestamp?: string
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => ({
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        // stauts: context.switchToHttp().getResponse().statusCode,
        message:
          this.reflector.get<string>(
            'response_message',
            context.getHandler(),
          ) || '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result,
        timestamp: new Date().toISOString()
      })),
    );
  }
}
