// src/components/common/Basket.ts
import { Component } from '../base/Component';

export class Basket extends Component<object> {
    protected _items: HTMLElement | null;
    protected _totalPrice: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);
        
        this._items = container.querySelector('.basket__list');
        this._totalPrice = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');
        
        // Сразу блокируем кнопку при создании
        if (this._button) {
            this._button.disabled = true;
            this._button.addEventListener('click', onCheckout);
        }
    }

    set items(items: HTMLElement[]) {
        if (this._items) {
            if (items.length === 0) {
                this._items.innerHTML = '';
            } else {
                this._items.replaceChildren(...items);
            }
        }
    }

    set buttonState(enabled: boolean) {
        if (this._button) {
            this._button.disabled = !enabled;
        }
    }

    set total(value: number) {
        if (this._totalPrice) {
            this._totalPrice.textContent = `${value} синапсов`;
        }
    }
}