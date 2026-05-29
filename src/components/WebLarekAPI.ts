import { IApi } from '../../types/index';
import { IOrder, IOrderResult, IProductsResponse } from '../../types/index';

export class WebLarekAPI {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProductsResponse> {
        return await this.api.get('/product');
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post('/order', order);
    }
}