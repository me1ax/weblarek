// src/components/CardModal.ts
import { Card } from '../common/Card';
import { EventEmitter } from '../base/events';

export class CardModal extends Card {
    protected _description: HTMLElement | null;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        
        this._events = events;
        this._description = container.querySelector('.card__text');
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                this._events.emit('preview:toggle');
            });
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
}