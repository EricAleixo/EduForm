import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly cloudinaryService: CloudinaryService
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
  
    return this.studentRepository.save(student);
  }
  

  async findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: number) {
    return await this.studentRepository.findOne({where: {id: id}})
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    return await this.studentRepository.update(id, updateStudentDto);
  }

  async updateImage(id: number, file: Express.Multer.File): Promise<Student> {

    const student = await this.studentRepository.findOne({where: {id: id}});

    if(!student){
      throw new NotFoundException("Estudante não encontrado")
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
    student.documentosUrl = imageUrl

    return this.studentRepository.save(student);

  }

  async remove(id: number) {
    return await this.studentRepository.delete(id);
  }
}
