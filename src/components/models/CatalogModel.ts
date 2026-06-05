import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CatalogModel {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(private events: EventEmitter) {}

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed', { products: this._products });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('catalog:selected', { product: this._selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}