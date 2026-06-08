// src/components/CardModal.ts
import { Card } from '../common/Card';
import { EventEmitter } from '../base/events';

export class CardModal extends Card {
    protected _description: HTMLElement | null = null;
    protected _image: HTMLImageElement | null = null;
    protected _category: HTMLElement | null = null;
    protected _button: HTMLButtonElement | null = null;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        
        this._events = events;
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                this._events.emit('preview:toggle');
            });
        }
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
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

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    // Переопределяем price для возможности блокировки кнопки
    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Недоступно';
                if (this._button) {
                    this._button.disabled = true;
                    this._button.textContent = 'Недоступно';
                }
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }
}