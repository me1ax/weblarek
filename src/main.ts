import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder } from './types/index';
import { TPayment } from './types/index';

// Компоненты представления
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardModal } from './components/view/CardModal';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

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

// Компоненты представления (создаем один раз)
const page = new Page(document.querySelector('.page') as HTMLElement, () => {
    events.emit('basket:open');
});

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalContainer, () => {
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

// Создаем экземпляр корзины (один раз)
const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, () => {
    events.emit('order:open');
});

// Создаем экземпляр формы заказа (один раз)
const orderFormElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

// Создаем экземпляр формы контактов (один раз)
const contactsFormElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

// Создаем экземпляр сообщения об успехе (один раз)
const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const success = new Success(successElement, () => {
    modal.close();
});

// Создаем экземпляр карточки превью (один раз)
const previewCardElement = cardPreviewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const previewCard = new CardModal(previewCardElement, events);

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Загрузка товаров с сервера
api.getProducts()
    .then(response => {
        catalogModel.setProducts(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// 1. Обработка изменения каталога
events.on('catalog:changed', () => {
    const products = catalogModel.getProducts();
    const cards = products.map(product => {
        const cardElement = cardCatalogTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, () => {
            events.emit('card:select', { id: product.id });
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;
        return card.render();
    });
    page.catalog = cards;
});

// 2. Выбор карточки для просмотра
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        catalogModel.setSelectedProduct(product);
    }
});

// 3. Обработка выбора товара для просмотра
events.on('catalog:selected', (data: { product: IProduct }) => {
    const product = data.product;
    const isInCart = cartModel.hasItem(product.id);
    
    previewCard.title = product.title;
    previewCard.description = product.description;
    previewCard.price = product.price;
    previewCard.category = product.category;
    previewCard.image = CDN_URL + product.image;
    previewCard.buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';
    
    modal.content = previewCard.render();
    modal.open();
});

// 4. Обработчик кнопки в модальном окне (добавить/удалить из корзины)
events.on('preview:toggle', () => {
    const selectedProduct = catalogModel.getSelectedProduct();
    if (!selectedProduct) return;
    
    const isInCart = cartModel.hasItem(selectedProduct.id);
    
    if (isInCart) {
        cartModel.removeItem(selectedProduct.id);
    } else {
        cartModel.addItem(selectedProduct);
    }
    
    modal.close();
});

// 5. Удаление товара из корзины (из карточки) - больше не нужно, заменено на preview:toggle
// оставлен для совместимости, но не используется
events.on('card:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
    modal.close();
});

// 6. Обработка изменения корзины
events.on('cart:changed', () => {
    const count = cartModel.getItemCount();
    const total = cartModel.getTotalPrice();
    const items = cartModel.getItems();
    
    page.counter = count;
    
    if (items.length === 0) {
        basket.items = [];
        basket.buttonState = false;
    } else {
        const cardElements = items.map((item, index) => {
            const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            const card = new CardBasket(cardElement, () => {
                events.emit('basket:remove', { id: item.id });
            });
            card.index = index + 1;
            card.title = item.title;
            card.price = item.price;
            return card.render();
        });
        basket.items = cardElements;
        basket.buttonState = true;
    }
    basket.total = total;
});

// 7. Удаление товара из корзины (из списка)
events.on('basket:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
});

// 8. Открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

// 9. Обработчики событий форм
events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setData({ payment: data.payment });
});

events.on('order:address', (data: { address: string }) => {
    buyerModel.setData({ address: data.address });
});

events.on('contacts:email', (data: { email: string }) => {
    buyerModel.setData({ email: data.email });
});

events.on('contacts:phone', (data: { phone: string }) => {
    buyerModel.setData({ phone: data.phone });
});

// 10. Открытие формы заказа
events.on('order:open', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    const isValid = Object.keys(errors).length === 0;
    
    orderForm.address = buyerData.address;
    if (buyerData.payment) {
        orderForm.setPaymentActive(buyerData.payment);
    }
    orderForm.valid = isValid;
    orderForm.errors = errors.address || errors.payment || '';
    
    modal.content = orderForm.render();
    modal.open();
});

// 11. Переход к форме контактов
events.on('order:next', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    const isValid = Object.keys(errors).length === 0;
    
    if (isValid && buyerData.address && buyerData.payment) {
        events.emit('order:open-contacts');
    }
});

events.on('order:open-contacts', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    const isValid = Object.keys(errors).length === 0;
    
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = isValid;
    contactsForm.errors = errors.email || errors.phone || '';
    
    modal.content = contactsForm.render();
});

// 12. Отправка заказа
events.on('contacts:pay', () => {
    submitOrder();
});

// 13. Изменение данных покупателя
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    const isValid = Object.keys(errors).length === 0;
    
    orderForm.address = buyerData.address;
    if (buyerData.payment) {
        orderForm.setPaymentActive(buyerData.payment);
    }
    orderForm.valid = isValid;
    orderForm.errors = errors.address || errors.payment || '';
    
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = isValid;
    contactsForm.errors = errors.email || errors.phone || '';
});

// 14. Отправка заказа на сервер
async function submitOrder() {
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
    
    try {
        const result = await api.postOrder(order);
        success.total = result.total;
        modal.content = success.render();
        
        cartModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
}

// 15. Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
});