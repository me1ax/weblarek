// src/components/ContactsForm.ts
import { Form } from '../common/Form';
import { EventEmitter } from '../base/events';

export class ContactsForm extends Form {
    protected _email: HTMLInputElement | null;
    protected _phone: HTMLInputElement | null;
    private _events: EventEmitter;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        
        this._events = events;
        this._email = container.querySelector('[name=email]');
        this._phone = container.querySelector('[name=phone]');
        
        if (this._email) {
            this._email.addEventListener('input', () => {
                this._events.emit('contacts:email', { email: this._email?.value || '' });
            });
        }
        if (this._phone) {
            this._phone.addEventListener('input', () => {
                this._events.emit('contacts:phone', { phone: this._phone?.value || '' });
            });
        }
        
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this._events.emit('contacts:pay');
        });
    }

    set email(value: string) {
        if (this._email) {
            this._email.value = value;
        }
    }

    set phone(value: string) {
        if (this._phone) {
            this._phone.value = value;
        }
    }
}