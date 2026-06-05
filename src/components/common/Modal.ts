// src/components/common/Modal.ts
import { Component } from '../base/Component';

export class Modal extends Component<{ content: HTMLElement }> {
    protected _closeButton: HTMLButtonElement | null;
    protected _content: HTMLElement | null;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        
        this._closeButton = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');
        
        if (this._closeButton) {
            this._closeButton.addEventListener('click', onClose);
        }
        
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                onClose();
            }
        });
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }

    set content(value: HTMLElement) {
        if (this._content) {
            this._content.innerHTML = '';
            this._content.appendChild(value);
        }
    }
}