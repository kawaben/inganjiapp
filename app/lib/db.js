import { openDB } from 'idb';

const DB_NAME = 'ecommerceDB';
const STORE_NAMES = ['men', 'women', 'kids', 'accessories'];

export const initDB = async () => {
  return openDB('ecommerceDB', 2, { 
    upgrade(db, oldVersion, newVersion) {
      const stores = ['men', 'women', 'kids', 'accessories', 'wishlist'];

      for (const store of stores) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      }
    },
  });
};


export const addProductToCategory = async (category, product) => {
  const db = await initDB();
  await db.put(category, product);
};

export const deleteProductFromCategory = async (category, id) => {
  const db = await initDB();
  await db.delete(category, id);
};

export const getAllProductsFromAllCategories = async () => {
  const db = await initDB();
  let allProducts = [];
  for (const category of STORE_NAMES) {
    const tx = db.transaction(category, 'readonly');
    const store = tx.objectStore(category);
    const products = await store.getAll();
    allProducts = allProducts.concat(products.map(p => ({ ...p, category })));
  }
  return allProducts;
};

export const getProductsByCategory = async (category) => {
  const db = await initDB();
  const tx = db.transaction(category, 'readonly');
  const store = tx.objectStore(category);
  const products = await store.getAll();
  return products;
};

export const addProductToWishlist = async (product) => {
  const db = await initDB();
  await db.put('wishlist', product);
};

export const removeProductFromWishlist = async (productId) => {
  const db = await initDB();
  await db.delete('wishlist', productId);
};

export const getWishlistProducts = async () => {
  const db = await initDB();
  return await db.getAll('wishlist');
};

export const clearWishlistDB = async () => {
  const db = await initDB();
  await db.clear('wishlist');
};
