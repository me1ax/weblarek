// src/components/CardBasket.ts
import { Component } from './components/base/Component';
import { IProduct } from './types/index';

export interface IBasketCardActions {
    onRemove?: (event: MouseEvent) => void;
}

export class CardBasket extends Component<IProduct> {
    protected _index: HTMLElement | null;
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: IBasketCardActions) {
        super(container);
        
        this._index = container.querySelector('.basket__item-index');
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.basket__item-delete');
        
        if (actions?.onRemove && this._button) {
            this._button.addEventListener('click', actions.onRemove);
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