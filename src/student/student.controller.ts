import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  @UseInterceptors(FileInterceptor("documentoIdentidade", {
    limits: { fieldSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|pdf)$/)) {
        return cb(new Error("Somente imagens são permitidas"), false);
      }
      cb(null, true)
    } 
  }))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      return this.studentService.create(createStudentDto, file);
    } catch (e) {
      console.log(e)
    }
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Patch(":id/document")
  @UseInterceptors(FileInterceptor("file"))
  async updateDocument(
    @Param("id") id:number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.studentService.updateImage(id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
