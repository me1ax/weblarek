import './scss/styles.scss';
import { CatalogModel } from './components/base/models/CatalogModel';
import { CartModel } from './components/base/models/CartModel';
import { BuyerModel } from './components/base/models/BuyerModel';
import { WebLarekAPI } from './components/base/WebLarekAPI';
import { API_URL } from './utils/constants';

console.log('=========================================');
console.log('ЗАПУСК ПРИЛОЖЕНИЯ WEBLAREK');
console.log('=========================================');

// Создаём экземпляры моделей
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Создаём экземпляр API
console.log('\nAPI URL:', API_URL);
const api = new WebLarekAPI(API_URL);

// Получаем товары с сервера
console.log('\n=== ЗАПРОС ТОВАРОВ С СЕРВЕРА ===');
api.getProducts()
  .then(products => {
    console.log('✓ Товары успешно получены!');
    console.log('  Количество товаров:', products.length);
    console.log('  Первый товар:', products[0]);
    
    // Сохраняем в модель каталога
    catalogModel.setProducts(products);
    console.log('\n✓ Товары сохранены в модель каталога');
    console.log('  В модели товаров:', catalogModel.getProducts().length);
    
    console.log('\n=========================================');
    console.log('ВСЕ РАБОТАЕТ!');
    console.log('=========================================');
  })
  .catch(error => {
    console.error('✗ Ошибка при получении товаров:', error);
    console.log('\nПроверьте:');
    console.log('1. Файл .env с VITE_API_ORIGIN');
    console.log('2. Константу API_URL в utils/constants.ts');
    console.log('3. Доступность сервера');
  });