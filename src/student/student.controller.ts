import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Res, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService, private readonly authService: AuthService) { }

  @Post()
  @UseInterceptors(FileInterceptor("documentoIdentidade", {
    limits: { 
      fileSize: 5 * 1024 * 1024, // 5MB
      fieldSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
      if (!file) {
        return cb(null, true); // Arquivo é opcional
      }
      
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|pdf)$/)) {
        return cb(new BadRequestException("Somente imagens (JPEG, PNG, JPG, PDF) são permitidas"), false);
      }
      
      cb(null, true);
    } 
  }))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      console.log('Dados recebidos:', createStudentDto);
      console.log('Arquivo recebido:', file ? file.originalname : 'Nenhum arquivo');
      
      return await this.studentService.create(createStudentDto, file);
    } catch (error) {
      console.error('Erro ao criar estudante:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor("documentoIdentidade", {
    limits: { 
      fileSize: 5 * 1024 * 1024, // 5MB
      fieldSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
      if (!file) {
        return cb(null, true); // Arquivo é opcional
      }
      
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|pdf)$/)) {
        return cb(new BadRequestException("Somente imagens (JPEG, PNG, JPG, PDF) são permitidas"), false);
      }
      
      cb(null, true);
    } 
  }))
  async update(
    @Param('id') id: string, 
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.studentService.update(+id, updateStudentDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveStudent(@Param('id') id: string) {
    return this.studentService.approveStudent(+id);
  }

  @Get('approve/:id')
  async approveByEmail(
    @Param('id') id: string,
    @Query('token') token: string,
    @Res() res: Response
  ) {
    try {
      // Validar token (deve ser igual ao gerado no StudentService)
      // O método validateToken do AuthService retorna o payload se válido
      await this.authService.validateToken(token);
      await this.studentService.approveStudent(+id);
      // Redirecionar para a home do frontend
      return res.redirect(process.env.APP_URL || 'http://localhost:3001');
    } catch (error) {
      return res.status(400).send('Link de aprovação inválido ou expirado.');
    }
  }
}
