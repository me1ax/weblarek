// src/components/OrderForm.ts
import { Form } from './components/common/Form';
import { TPayment } from './types/index';
import { EventEmitter } from './components/base/events';

export interface IOrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _cardButton: HTMLButtonElement | null;
    protected _cashButton: HTMLButtonElement | null;
    protected _address: HTMLInputElement | null;
    private _payment: TPayment = '';
    private _events: EventEmitter;

    constructor(container: HTMLFormElement, onSubmit: (data: IOrderFormData) => void, events: EventEmitter) {
        super(container, onSubmit);
        
        this._events = events;
        this._cardButton = container.querySelector('button[name=card]');
        this._cashButton = container.querySelector('button[name=cash]');
        this._address = container.querySelector('[name=address]');
        
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => this.setPayment('card'));
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => this.setPayment('cash'));
        }
        if (this._address) {
            this._address.addEventListener('input', () => {
                this.validate();
                this._events.emit('form:changed', { 
                    formName: 'order', 
                    data: this.getData(),
                    isValid: this.validate()
                });
            });
        }
    }

    protected getData(): IOrderFormData {
        return {
            payment: this._payment,
            address: this._address?.value || ''
        };
    }

    setPayment(value: TPayment) {
        this._payment = value;
        
        if (value === 'card' && this._cardButton && this._cashButton) {
            this._cardButton.classList.add('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        } else if (value === 'cash' && this._cardButton && this._cashButton) {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }
        
        this.validate();
        this._events.emit('form:changed', { 
            formName: 'order', 
            data: this.getData(),
            isValid: this.validate()
        });
    }

    set address(value: string) {
        if (this._address) {
            this._address.value = value;
        }
        this.validate();
        this._events.emit('form:changed', { 
            formName: 'order', 
            data: this.getData(),
            isValid: this.validate()
        });
    }

    validate(): boolean {
        const isValid = this._payment !== '' && (this._address?.value?.trim() !== '');
        this.valid = isValid;
        this.errors = isValid ? '' : 'Заполните все поля';
        return isValid;
    }
}