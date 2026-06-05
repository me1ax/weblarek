// src/components/CardModal.ts
import { Component } from './components/base/Component';
import { IProduct } from './types/index';

export interface IModalCardActions {
    onAddToCart?: (event: MouseEvent) => void;
    onRemoveFromCart?: (event: MouseEvent) => void;
}

export class CardModal extends Component<IProduct> {
    protected _title: HTMLElement | null;
    protected _description: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _price: HTMLElement | null;
    protected _button: HTMLButtonElement | null;
    protected _category: HTMLElement | null;
    private _id: string = '';
    private _actions?: IModalCardActions;

    constructor(container: HTMLElement, actions?: IModalCardActions) {
        super(container);
        
        this._actions = actions;
        this._title = container.querySelector('.card__title');
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.card__button');
        this._category = container.querySelector('.card__category');
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

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
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
            // Удаляем старые обработчики
            const oldButton = this._button.cloneNode(true) as HTMLButtonElement;
            this._button.parentNode?.replaceChild(oldButton, this._button);
            this._button = oldButton;
            
            this._button.textContent = value;
            
            // Добавляем новый обработчик в зависимости от текста кнопки
            if (value === 'В корзину' && this._actions?.onAddToCart) {
                this._button.addEventListener('click', this._actions.onAddToCart);
            } else if (value === 'Удалить из корзины' && this._actions?.onRemoveFromCart) {
                this._button.addEventListener('click', this._actions.onRemoveFromCart);
            }
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }
}