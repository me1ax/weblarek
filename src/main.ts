import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

console.log('=========================================');
console.log('ПРОВЕРКА МОДЕЛЕЙ ДАННЫХ');
console.log('=========================================');

// Создаём экземпляры моделей
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// ========== ТЕСТИРОВАНИЕ НА ТЕСТОВЫХ ДАННЫХ ИЗ utils/data ==========
console.log('\n=== ЧАСТЬ 1: ТЕСТИРОВАНИЕ МОДЕЛЕЙ НА ТЕСТОВЫХ ДАННЫХ ===');

// Тестируем каталог
console.log('\n1. МОДЕЛЬ КАТАЛОГА');
catalogModel.setProducts(apiProducts.items);
console.log('setProducts() - список товаров:', catalogModel.getProducts());

const testId = apiProducts.items[0]?.id;
console.log('getProductById() - результат поиска:', catalogModel.getProductById(testId));

catalogModel.setSelectedProduct(apiProducts.items[0]);
console.log('getSelectedProduct() - выбранный товар:', catalogModel.getSelectedProduct());

// Тестируем корзину
console.log('\n2. МОДЕЛЬ КОРЗИНЫ');
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('getItems() - список товаров в корзине:', cartModel.getItems());
console.log('getItemCount() - количество товаров:', cartModel.getItemCount());
console.log('getTotalPrice() - общая стоимость:', cartModel.getTotalPrice());
console.log('hasItem() - проверка наличия товара:', cartModel.hasItem(testId));

cartModel.removeItem(testId);
console.log('getItems() - после удаления товара:', cartModel.getItems());
console.log('getItemCount() - количество после удаления:', cartModel.getItemCount());

cartModel.clear();
console.log('getItems() - после очистки корзины:', cartModel.getItems());
console.log('getItemCount() - количество после очистки:', cartModel.getItemCount());

// Тестируем покупателя
console.log('\n3. МОДЕЛЬ ПОКУПАТЕЛЯ');
buyerModel.setData({ email: 'test@test.com', phone: '+79991234567' });
buyerModel.setData({ payment: 'card', address: 'Москва' });
console.log('getData() - полные данные:', buyerModel.getData());
console.log('validate() - валидация заполненных данных:', buyerModel.validate());

buyerModel.clear();
console.log('getData() - после очистки:', buyerModel.getData());
console.log('validate() - валидация пустых данных:', buyerModel.validate());

// ========== РАБОТА С СЕРВЕРОМ ==========
console.log('\n=== ЧАСТЬ 2: РАБОТА С СЕРВЕРОМ ===');

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

console.log('API URL:', API_URL);
console.log('\nЗАПРОС ТОВАРОВ С СЕРВЕРА');

api.getProducts()
    .then(response => {
        console.log('Полный ответ сервера:', response);
        console.log('total:', response.total);
        console.log('items:', response.items);
        
        catalogModel.setProducts(response.items);
        console.log('Товары сохранены в модель:', catalogModel.getProducts());
        
        console.log('\nВСЕ ПРОВЕРКИ ЗАВЕРШЕНЫ');
    })
    .catch(error => {
        console.error('Ошибка:', error);
        console.log('Проверьте .env файл и доступность сервера');
    });