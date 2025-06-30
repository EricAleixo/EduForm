import { IsString, IsNotEmpty, MinLength, IsArray, IsOptional } from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
} 