// src/components/Basket.ts
import { Component } from '../base/Component';
export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected _items: HTMLElement | null;
    protected _totalPrice: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);
        
        this._items = container.querySelector('.basket__list');
        this._totalPrice = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');
        
        if (this._button) {
            this._button.addEventListener('click', onCheckout);
        }
    }

    set items(items: HTMLElement[]) {
        if (this._items) {
            if (items.length === 0) {
                this._items.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
                if (this._button) this._button.disabled = true;
            } else {
                this._items.replaceChildren(...items);
                if (this._button) this._button.disabled = false;
            }
        }
    }

    set total(value: number) {
        if (this._totalPrice) {
            this._totalPrice.textContent = `${value} синапсов`;
        }
    }
}