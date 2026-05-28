// Временно определяем интерфейс здесь
export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
  }
  
  export class CatalogModel {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
  
    setProducts(products: IProduct[]): void {
      this._products = products;
    }
  
    getProducts(): IProduct[] {
      return this._products;
    }
  
    getProductById(id: string): IProduct | undefined {
      return this._products.find(product => product.id === id);
    }
  
    setSelectedProduct(product: IProduct): void {
      this._selectedProduct = product;
    }
  
    getSelectedProduct(): IProduct | null {
      return this._selectedProduct;
    }
  }