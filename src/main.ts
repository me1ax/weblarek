import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/base/WebLarekAPI';
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
console.log('setProducts() - товаров сохранено:', catalogModel.getProducts().length);

const testId = apiProducts.items[0]?.id;
console.log('getProductById() - поиск товара:', catalogModel.getProductById(testId)?.title);

catalogModel.setSelectedProduct(apiProducts.items[0]);
console.log('setSelectedProduct() / getSelectedProduct():', catalogModel.getSelectedProduct()?.title);

// Тестируем корзину
console.log('\n2. МОДЕЛЬ КОРЗИНЫ');
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('addItem() / getItemCount():', cartModel.getItemCount());
console.log('getTotalPrice():', cartModel.getTotalPrice());
console.log('hasItem():', cartModel.hasItem(testId));
cartModel.removeItem(testId);
console.log('removeItem():', cartModel.getItemCount());
cartModel.clear();
console.log('clear():', cartModel.getItemCount());

// Тестируем покупателя
console.log('\n3. МОДЕЛЬ ПОКУПАТЕЛЯ');
buyerModel.setData({ email: 'test@test.com', phone: '+79991234567' });
buyerModel.setData({ payment: 'card', address: 'Москва' });
console.log('setData() / getData():', buyerModel.getData());
console.log('validate():', buyerModel.validate());
buyerModel.clear();
console.log('clear():', buyerModel.getData());

// ========== РАБОТА С СЕРВЕРОМ ==========
console.log('\n=== ЧАСТЬ 2: РАБОТА С СЕРВЕРОМ ===');

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

console.log('API URL:', API_URL);
console.log('\nЗАПРОС ТОВАРОВ С СЕРВЕРА');

api.getProducts()
    .then(response => {
        console.log('Товары получены');
        console.log('total:', response.total);
        console.log('items.length:', response.items.length);
        
        catalogModel.setProducts(response.items);
        console.log('Сохранено в модель:', catalogModel.getProducts().length);
        
        console.log('\nВСЕ ПРОВЕРКИ ЗАВЕРШЕНЫ');
    })
    .catch(error => {
        console.error('Ошибка:', error);
        console.log('Проверьте .env файл и доступность сервера');
    });