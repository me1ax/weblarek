// src/components/CardCatalog.ts
import { Card } from '../common/Card';

export class CardCatalog extends Card {
    protected _image: HTMLImageElement | null = null;
    protected _category: HTMLElement | null = null;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        
        this.container.addEventListener('click', onClick);
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
}