// src/components/Success.ts
import { Component } from './components/base/Component';

export interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected _total: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        
        this._total = container.querySelector('.order-success__description');
        this._button = container.querySelector('.order-success__close');
        
        if (this._button) {
            this._button.addEventListener('click', onClose);
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `Списано ${value} синапсов`;
        }
    }
}