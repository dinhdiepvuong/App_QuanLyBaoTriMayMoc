import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
    @Get('upload/equipment/:imgpath')
    async serveFileEquipmentUploaded(@Param('imgpath') imgpath: string, @Res() res: Response): Promise<any> {
        return res.sendFile(imgpath, { root: 'upload/equipment' });
    }

    @Get('upload/avatar/:imgpath')
    async serveFileUserUploaded(@Param('imgpath') imgpath: string, @Res() res: Response): Promise<any> {
        return res.sendFile(imgpath, { root: 'upload/avatar' });
    }
}
