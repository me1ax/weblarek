// src/components/CardCatalog.ts
import { Card } from './components/common/Card';
import { IProduct } from './types/index';

export class CardCatalog extends Card<IProduct> {
    constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
        super(container, { onClick });
        // Убираем обработчик с кнопки, вешаем на контейнер
        if (this._button) {
            this._button.removeEventListener('click', onClick);
        }
        container.removeEventListener('click', onClick);
        container.addEventListener('click', onClick);
    }
}