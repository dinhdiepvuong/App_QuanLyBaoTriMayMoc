import { IResponse } from "../Interfaces/respone.interface";

export class ResponseCommon implements IResponse{
    constructor (code: number, isSuccess: boolean, message:string, data?: any) {
      this.code = code;
      this.success = isSuccess;
      this.message = message;
      this.data = data;
      console.warn(new Date().toString() + ' - [Response]: ' + message + (data ? ' - ' + JSON.stringify(data): ''));
    };
    code: number;
    message: string;
    data: any;
    errorMessage: any;
    success: boolean;
}