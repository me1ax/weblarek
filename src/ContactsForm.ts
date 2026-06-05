// src/components/ContactsForm.ts
import { Form } from './components/common/Form';
import { EventEmitter } from './components/base/events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _email: HTMLInputElement | null;
    protected _phone: HTMLInputElement | null;
    private _events: EventEmitter;

    constructor(container: HTMLFormElement, onSubmit: (data: IContactsFormData) => void, events: EventEmitter) {
        super(container, onSubmit);
        
        this._events = events;
        this._email = container.querySelector('[name=email]');
        this._phone = container.querySelector('[name=phone]');
        
        if (this._email) {
            this._email.addEventListener('input', () => {
                this.validate();
                this._events.emit('form:changed', {
                    formName: 'contacts',
                    data: this.getData(),
                    isValid: this.validate()
                });
            });
        }
        if (this._phone) {
            this._phone.addEventListener('input', () => {
                this.validate();
                this._events.emit('form:changed', {
                    formName: 'contacts',
                    data: this.getData(),
                    isValid: this.validate()
                });
            });
        }
    }

    protected getData(): IContactsFormData {
        return {
            email: this._email?.value || '',
            phone: this._phone?.value || ''
        };
    }

    set email(value: string) {
        if (this._email) {
            this._email.value = value;
        }
        this.validate();
        this._events.emit('form:changed', {
            formName: 'contacts',
            data: this.getData(),
            isValid: this.validate()
        });
    }

    set phone(value: string) {
        if (this._phone) {
            this._phone.value = value;
        }
        this.validate();
        this._events.emit('form:changed', {
            formName: 'contacts',
            data: this.getData(),
            isValid: this.validate()
        });
    }

    validate(): boolean {
        const isValid = (this._email?.value?.trim() !== '') && (this._phone?.value?.trim() !== '');
        this.valid = isValid;
        this.errors = isValid ? '' : 'Заполните все поля';
        return isValid;
    }
}