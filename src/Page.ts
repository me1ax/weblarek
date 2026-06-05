// src/components/Page.ts
import { Component } from './components/base/Component';

export class Page extends Component<{ counter: number; catalog: HTMLElement[] }> {
    protected _counter: HTMLElement | null;
    protected _catalog: HTMLElement | null;
    protected _cartIcon: HTMLElement | null;

    constructor(container: HTMLElement, onCartClick: () => void) {
        super(container);
        
        this._counter = container.querySelector('.header__basket-counter');
        this._catalog = container.querySelector('.gallery');
        this._cartIcon = container.querySelector('.header__basket');
        
        if (this._cartIcon) {
            this._cartIcon.addEventListener('click', onCartClick);
        }
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    set catalog(items: HTMLElement[]) {
        if (this._catalog) {
            this._catalog.replaceChildren(...items);
        }
    }
}