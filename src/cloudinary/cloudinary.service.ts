import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { configureCloudinary } from './cloudinary.config';

@Injectable()
export class CloudinaryService {

    constructor(private configService:ConfigService) {
        configureCloudinary(this.configService);
    }

    async uploadImage(buffer: Buffer, filename: string): Promise<string> {

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { public_id: filename, folder: "students_documents" },
                (err, result) => {
                    if (err){
                        return reject(err)
                    }

                    if(!result) {
                        return reject(new Error("Nenhum resultado do cloudnary"))
                    }
                    
                    resolve(result.secure_url);
                }
            )
            Readable.from(buffer).pipe(stream);
        })

    }

}
