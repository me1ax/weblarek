/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Установить текстовое содержимое
    protected setText(element: HTMLElement | null, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement | null, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Переключить класс
    protected toggleClass(element: HTMLElement | null, className: string, force?: boolean) {
        if (element) {
            element.classList.toggle(className, force);
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}