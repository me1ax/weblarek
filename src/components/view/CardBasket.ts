// src/components/view/CardBasket.ts
import { Card } from '../common/Card'

export class CardBasket extends Card {
    protected _index: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);
        
        this._index = container.querySelector('.basket__item-index');
        this._button = container.querySelector('.basket__item-delete');
        
        if (this._button) {
            this._button.addEventListener('click', onRemove);
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = value.toString();
        }
    }

    // Переопределяем price для формата "Бесплатно" вместо "Недоступно"
    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесплатно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }
}
