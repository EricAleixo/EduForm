import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) {}

  async create(createStudentDto: CreateStudentDto) {

    const existsUser = await this.studentRepository.findOne({where: {email: createStudentDto.email}})

    if(existsUser) {
      throw new ConflictException("Email já existente");
    }

    return this.studentRepository.save(createStudentDto);
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

  async remove(id: number) {
    return await this.studentRepository.delete(id);
  }
}
