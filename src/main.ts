import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder } from './types/index';

// Компоненты представления
import { Page } from './/Page';
import { Modal } from './components/common/Modal';
import { CardCatalog } from './CardCatalog';
import { CardModal } from './CardModal';
import { CardBasket } from './CardBasket';
import { Basket } from './components/common/Basket';
import { OrderForm } from './OrderForm';
import { ContactsForm } from './ContactsForm';
import { Success } from './Success';

// Типы для форм
import { IOrderFormData } from './OrderForm';
import { IContactsFormData } from './ContactsForm';

// ========== ОТЛАДОЧНЫЕ КОНСОЛЬ ЛОГИ ==========
console.log('Приложение запущено');

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Брокер событий
const events = new EventEmitter();

// Модели данных
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// API
const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

// Компоненты представления
const page = new Page(document.querySelector('.page') as HTMLElement, () => {
    console.log('Событие: клик по иконке корзины');
    events.emit('basket:open');
});

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalContainer, () => {
    console.log('Событие: закрытие модального окна (крестик или оверлей)');
    events.emit('modal:close');
});

// Темплейты
const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Загрузка товаров с сервера
api.getProducts()
    .then(response => {
        console.log('Загрузка товаров с сервера:', response.items.length, 'товаров');
        catalogModel.setProducts(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// 1. Обработка изменения каталога
events.on('catalog:changed', () => {
    console.log('Событие catalog:changed - каталог обновлен');
    const products = catalogModel.getProducts();
    console.log('  Товаров в каталоге:', products.length);
    
    const cards = products.map(product => {
        const cardElement = cardCatalogTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, () => {
            console.log('Событие: клик по карточке товара:', product.title);
            catalogModel.setSelectedProduct(product);
        });
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;
        return card.render();
    });
    page.catalog = cards;
    console.log('  Карточки отрендерены:', cards.length);
});

// 2. Обработка выбора товара для просмотра
events.on('catalog:selected', (data: { product: IProduct }) => {
    const product = data.product;
    const isInCart = cartModel.hasItem(product.id);
    console.log('Событие catalog:selected - выбран товар для просмотра:', product.title);
    console.log('  В корзине:', isInCart ? 'да' : 'нет');
    
    const cardElement = cardPreviewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const card = new CardModal(cardElement, {
        onAddToCart: () => {
            console.log('Событие: добавление в корзину - товар:', product.title);
            cartModel.addItem(product);
            modal.close();
        },
        onRemoveFromCart: () => {
            console.log('Событие: удаление из корзины - товар:', product.title);
            cartModel.removeItem(product.id);
            modal.close();
        }
    });
    
    card.id = product.id;
    card.title = product.title;
    card.description = product.description;
    card.price = product.price;
    card.category = product.category;
    card.image = CDN_URL + product.image;
    card.buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';
    
    modal.content = card.render();
    modal.open();
    console.log('  Модальное окно открыто с карточкой товара');
});

// 3. Обработка изменения корзины
events.on('cart:changed', () => {
    const count = cartModel.getItemCount();
    const total = cartModel.getTotalPrice();
    console.log('Событие cart:changed - корзина обновлена');
    console.log('  Количество товаров:', count);
    console.log('  Общая сумма:', total);
    
    page.counter = count;
    
    // Обновляем корзину, если она открыта
    const basketElement = document.querySelector('.basket');
    if (basketElement) {
        console.log('  Обновление отображения корзины');
        renderBasket();
    }
});

// 4. Открытие корзины
events.on('basket:open', () => {
    console.log('Событие basket:open - открытие корзины');
    renderBasket();
    modal.open();
});

function renderBasket() {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    console.log('  Рендер корзины, товаров:', items.length, 'сумма:', total);
    
    const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const basket = new Basket(basketElement, () => {
        console.log('Событие: клик по кнопке "Оформить"');
        events.emit('order:open');
    });
    
    if (items.length === 0) {
        basket.items = [];
        basket.total = 0;
        modal.content = basket.render();
        console.log('  Корзина пуста');
        return;
    }
    
    const cardElements = items.map((item, index) => {
        const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, {
            onRemove: () => {
                console.log('Событие: удаление товара из корзины:', item.title);
                cartModel.removeItem(item.id);
                renderBasket();
            }
        });
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price;
        return card.render();
    });
    
    basket.items = cardElements;
    basket.total = total;
    modal.content = basket.render();
    console.log('  Корзина отрендерена, товаров:', cardElements.length);
}

// 5. Открытие формы заказа
events.on('order:open', () => {
    console.log('Событие order:open - открытие формы заказа (адрес и оплата)');
    const orderFormElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    const orderForm = new OrderForm(orderFormElement, (data: IOrderFormData) => {
        console.log('Событие: отправка формы заказа, данные:', data);
        buyerModel.setData(data);
        events.emit('order:submit');
    }, events);
    
    const buyerData = buyerModel.getData();
    if (buyerData.address) {
        orderForm.address = buyerData.address;
    }
    if (buyerData.payment) {
        orderForm.setPayment(buyerData.payment);
    }
    
    modal.content = orderForm.render();
});

// 6. Открытие формы контактов
events.on('order:submit', () => {
    console.log('Событие order:submit - переход к форме контактов');
    const contactsFormElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    const contactsForm = new ContactsForm(contactsFormElement, (data: IContactsFormData) => {
        console.log('Событие: отправка формы контактов, данные:', data);
        buyerModel.setData(data);
        submitOrder();
    }, events);
    
    const buyerData = buyerModel.getData();
    if (buyerData.email) {
        contactsForm.email = buyerData.email;
    }
    if (buyerData.phone) {
        contactsForm.phone = buyerData.phone;
    }
    
    modal.content = contactsForm.render();
});

// 7. Отправка заказа
async function submitOrder() {
    console.log('Отправка заказа на сервер...');
    const buyerData = buyerModel.getData();
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    
    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        items: items.map(item => item.id),
        total: total
    };
    
    console.log('  Данные заказа:', order);
    
    try {
        const result = await api.postOrder(order);
        console.log('Заказ успешно оформлен! ID заказа:', result.id, 'Сумма:', result.total);
        
        // Показываем сообщение об успехе
        const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const success = new Success(successElement, () => {
            console.log('Закрытие сообщения об успехе');
            modal.close();
        });
        success.total = result.total;
        modal.content = success.render();
        
        // Очищаем корзину и данные покупателя
        cartModel.clear();
        buyerModel.clear();
        
        // Обновляем счетчик на иконке корзины
        page.counter = 0;
        console.log('Корзина и данные покупателя очищены');
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
}

// 8. Закрытие модального окна
events.on('modal:close', () => {
    console.log('Событие modal:close - закрытие модального окна');
    modal.close();
});

// 9. Событие изменения данных покупателя
events.on('buyer:changed', (data) => {
    console.log('Событие buyer:changed - данные покупателя обновлены:', data);
});

events.on('buyer:validated', (errors) => {
    console.log('Событие buyer:validated - результаты валидации:', errors);
});

// 10. Событие изменения формы
events.on('buyer:changed', (data: any) => {
    console.log('Событие buyer:changed - данные покупателя обновлены:', data);
});

events.on('buyer:validated', (errors: any) => {
    console.log('Событие buyer:validated - результаты валидации:', errors);
});

events.on('form:changed', (data: any) => {
    console.log('Событие form:changed - форма', data.formName, ': валидна =', data.isValid, data.data);
});
console.log('Приложение готово к работе!');