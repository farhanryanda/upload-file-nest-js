import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('file-upload')
export class FileUploadController {
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads', // folder tujuan upload
            filename: (req, file, callback) => {
                // Ganti nama file agar unik
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExt = extname(file.originalname);
                const fileName = `${file.originalname}-${uniqueSuffix}${fileExt}`;
                callback(null, fileName);
            }
        }),
        fileFilter: (req, file, callback) => {
            // Filter file yang bisa diupload (misalnya hanya gambar)
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        }
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Uploaded file:', file);
        return {
            message: 'File uploaded successfully!',
            filePath: file.path
        };
    }


    @Get('files')
    getUploadedFiles() {
        const uploadFolder = join(__dirname, '..', '..', 'uploads');
        const files = readdirSync(uploadFolder);
        const fileUrls = files.map(file => `http://localhost:3000/${file}`);
        
        return {
            message: 'List of uploaded files',
            files: fileUrls,
        };
    }
}
