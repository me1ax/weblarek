import { IBuyer, TPayment, TValidationErrors } from '../../types/index';

export class BuyerModel {
    private _payment: TPayment = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validate(): TValidationErrors<IBuyer> {
        const errors: TValidationErrors<IBuyer> = {};

        if (this._payment === '') {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (this._address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        if (this._email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (this._phone.trim() === '') {
            errors.phone = 'Укажите номер телефона';
        }

        return errors;
    }
}