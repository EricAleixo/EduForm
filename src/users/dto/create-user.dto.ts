import { IsString, IsNotEmpty, MinLength, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsOptional()
    roles?: string[];
}
