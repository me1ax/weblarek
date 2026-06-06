// src/components/view/Basket.ts
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
        
        if (this._button) {
            this._button.addEventListener('click', onCheckout);
        }
    }

    protected setText(element: HTMLElement | null, value: unknown) {
        if (element) {
            element.textContent = String(value);
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
        this.setText(this._totalPrice, `${value} синапсов`);
    }
}