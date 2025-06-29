import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly queueService: QueueService
  ) {}

  async create(createStudentDto: CreateStudentDto, file?: Express.Multer.File): Promise<Student> {
    const existsUser = await this.studentRepository.findOne({
      where: { email: createStudentDto.email },
    });
  
    if (existsUser) {
      throw new ConflictException('Email já existente');
    }
  
    let documentosUrl: string | undefined = undefined;
  
    if (file) {
      documentosUrl = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
    }
  
    const student = this.studentRepository.create({
      ...createStudentDto,
      documentosUrl,
    });
  
    const savedStudent = await this.studentRepository.save(student);

    // Adicionar emails na fila para processamento em background
    // Isso torna a resposta da API muito mais rápida!
    try {
      // Email de confirmação para o estudante
      await this.queueService.addConfirmationEmail(
        savedStudent.email,
        savedStudent.nome,
        savedStudent.id
      );

      // Notificação para o admin
      await this.queueService.addAdminNotificationEmail(
        savedStudent.nome,
        savedStudent.email,
        savedStudent.id
      );

      console.log('📧 Emails adicionados na fila para processamento em background');
    } catch (error) {
      console.error('Erro ao adicionar emails na fila:', error);
      // Não falha a criação se a fila falhar
    }

    return savedStudent;
  }

  async findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: number) {
    return await this.studentRepository.findOne({where: {id: id}})
  }

  async update(id: number, updateStudentDto: UpdateStudentDto, file?: Express.Multer.File) {
    const student = await this.studentRepository.findOne({where: {id: id}});

    if(!student){
      throw new NotFoundException("Estudante não encontrado")
    }

    // Criar objeto de atualização
    const updateData: any = { ...updateStudentDto };

    // Se há um arquivo, processar o upload
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
      updateData.documentosUrl = imageUrl;
    }

    // Atualizar o estudante com os novos dados
    await this.studentRepository.update(id, updateData);
    
    // Retornar o estudante atualizado
    return await this.studentRepository.findOne({where: {id: id}});
  }

  async remove(id: number) {
    return await this.studentRepository.delete(id);
  }

  async approveStudent(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({where: {id: id}});

    if(!student){
      throw new NotFoundException("Estudante não encontrado")
    }

    if(student.approved){
      throw new BadRequestException("Estudante já foi aprovado")
    }

    // Atualizar status de aprovação
    student.approved = true;
    const updatedStudent = await this.studentRepository.save(student);

    // Enviar email de aprovação em background
    try {
      await this.queueService.addApprovalEmail(
        student.email,
        student.nome,
        student.id
      );
      console.log('📧 Email de aprovação adicionado na fila para processamento em background');
    } catch (error) {
      console.error('Erro ao adicionar email de aprovação na fila:', error);
      // Não falha a aprovação se o email falhar
    }

    return updatedStudent;
  }
}
