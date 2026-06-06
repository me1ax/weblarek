// src/components/view/CardBasket.ts
import { Component } from '../base/Component';

export class CardBasket extends Component<object> {
    protected _index: HTMLElement | null;
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);
        
        this._index = container.querySelector('.basket__item-index');
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.basket__item-delete');
        
        if (this._button) {
            this._button.addEventListener('click', onRemove);
        }
    }

    protected setText(element: HTMLElement | null, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесплатно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}