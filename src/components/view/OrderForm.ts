// src/components/OrderForm.ts
import { Form } from '../common/Form';
import { TPayment } from '../../types/index';
import { EventEmitter } from '../base/events';

export class OrderForm extends Form {
    protected _cardButton: HTMLButtonElement | null;
    protected _cashButton: HTMLButtonElement | null;
    protected _address: HTMLInputElement | null;
    private _events: EventEmitter;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        
        this._events = events;
        this._cardButton = container.querySelector('button[name=card]');
        this._cashButton = container.querySelector('button[name=cash]');
        this._address = container.querySelector('[name=address]');
        
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                this._events.emit('order:payment', { payment: 'card' });
                this.setPaymentActive('card');
            });
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                this._events.emit('order:payment', { payment: 'cash' });
                this.setPaymentActive('cash');
            });
        }
        if (this._address) {
            this._address.addEventListener('input', () => {
                this._events.emit('order:address', { address: this._address?.value || '' });
            });
        }
        
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this._events.emit('order:next');
        });
    }

    setPaymentActive(value: TPayment) {
        if (value === 'card' && this._cardButton && this._cashButton) {
            this._cardButton.classList.add('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        } else if (value === 'cash' && this._cardButton && this._cashButton) {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        if (this._address) {
            this._address.value = value;
        }
    }
}