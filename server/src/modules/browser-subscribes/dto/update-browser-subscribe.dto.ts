import { PartialType } from '@nestjs/mapped-types';
import { CreateBrowserSubscribeDto } from './create-browser-subscribe.dto';

export class UpdateBrowserSubscribeDto extends PartialType(
	CreateBrowserSubscribeDto,
) { }