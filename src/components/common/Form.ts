// src/components/common/Form.ts
import { Component } from '../base/Component';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form extends Component<object> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errors: HTMLElement | null;

    constructor(container: HTMLFormElement) {
        super(container);
        
        this._submitButton = container.querySelector('button[type=submit]');
        this._errors = container.querySelector('.form__errors');
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    setInputValue(name: string, value: string) {
        const input = this.container.querySelector(`[name=${name}]`) as HTMLInputElement | null;
        if (input) {
            input.value = value;
        }
    }
}