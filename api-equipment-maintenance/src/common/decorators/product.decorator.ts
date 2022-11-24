import { createParamDecorator } from '@nestjs/common';

export const Product = createParamDecorator((data: string, req) => {
    return data ? req.product && req.product[data] : req.product;
});