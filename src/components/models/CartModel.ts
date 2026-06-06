import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CartModel {
    private _items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.events.emit('cart:changed', {
            items: this.getItems(),
            count: this.getItemCount(),
            total: this.getTotalPrice()
        });
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('cart:changed', {
            items: this.getItems(),
            count: this.getItemCount(),
            total: this.getTotalPrice()
        });
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed', {
            items: this.getItems(),
            count: this.getItemCount(),
            total: this.getTotalPrice()
        });
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}