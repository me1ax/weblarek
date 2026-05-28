import { Api } from './Api';
import { IProduct, IOrder, IOrderResult } from '../../types/index';

// Добавь этот интерфейс временно или импортируй из types
interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export class WebLarekAPI extends Api {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.get('/product') as IProductsResponse;
    return response.items;
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    const response = await this.post('/order', order);
    return response as IOrderResult;
  }
}