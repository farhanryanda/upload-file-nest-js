import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';

@Module({
    imports: [],
    controllers: [FileUploadController],
    providers: [],
})
export class FileUploadModule {}
