// src/components/CardCatalog.ts
import { Card } from '../common/Card';

export class CardCatalog extends Card {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.container.addEventListener('click', onClick);
    }
}