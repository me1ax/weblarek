// src/components/common/Card.ts
import { Component } from '../base/Component';
import { IProduct } from '../../types/index';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export class Card<T extends IProduct> extends Component<T> {
    protected _id: string = '';
    protected _title: HTMLElement | null = null;
    protected _price: HTMLElement | null = null;
    protected _image: HTMLImageElement | null = null;
    protected _category: HTMLElement | null = null;
    protected _button: HTMLButtonElement | null = null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Недоступно');
            if (this._button) {
                this._button.disabled = true;
                this._button.textContent = 'Недоступно';
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryMap: Record<string, string> = {
                'софт-скил': 'card__category_soft',
                'хард-скил': 'card__category_hard',
                'кнопка': 'card__category_button',
                'дополнительное': 'card__category_additional',
                'другое': 'card__category_other',
            };
            this._category.className = `card__category ${categoryMap[value] || ''}`;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
}