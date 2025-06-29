import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    telefone: string;

    @IsString()
    @IsNotEmpty()
    dataNascimento: string;

    @IsString()
    @IsNotEmpty()
    turma: string;

    @IsString()
    @IsNotEmpty()
    serie: string;

    @IsString()
    @IsNotEmpty()
    turno: string;

    @IsString()
    @IsNotEmpty()
    responsavel: string;

    @IsString()
    @IsNotEmpty()
    pizzaPreferida: string;

    @IsString()
    @IsOptional()
    endereco?: string;

    @IsString()
    @IsOptional()
    observacoes?: string;
}
