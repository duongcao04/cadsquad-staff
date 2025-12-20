import { IsArray, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class DeliverJobDto {
	@IsOptional()
	@IsString()
	@MaxLength(1000, { message: 'Note is too long (max 1000 characters)' })
	note?: string;

	@IsOptional()
	@IsString()
	@IsUrl({}, { message: 'Link must be a valid URL (e.g., https://figma.com/...)' })
	link?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	// If you want to strictly validate that every item is a URL:
	// @IsUrl({}, { each: true, message: 'Each attachment must be a valid URL' })
	files?: string[];
}