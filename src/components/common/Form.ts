// src/components/common/Form.ts
import { Component } from '../base/Component';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errors: HTMLElement | null;

    constructor(container: HTMLFormElement, onSubmit: (data: T) => void) {
        super(container);
        
        this._submitButton = container.querySelector('button[type=submit]');
        this._errors = container.querySelector('.form__errors');
        
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit(this.getData());
        });
    }

    protected abstract getData(): T;

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    clear() {
        (this.container as HTMLFormElement).reset();
    }

    setInputValue(name: string, value: string) {
        const input = this.container.querySelector(`[name=${name}]`) as HTMLInputElement | null;
        if (input) {
            input.value = value;
        }
    }
}