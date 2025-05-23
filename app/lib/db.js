import { openDB } from 'idb';

const DB_NAME = 'ecommerceDB';
const STORE_NAMES = ['men', 'women', 'kids', 'accessories'];
const CART_STORE = 'cart';

export const initDB = async () => {
  return openDB('ecommerceDB', 3, {
    upgrade(db) {
      const stores = ['men', 'women', 'kids', 'accessories', 'wishlist', 'cart'];

      for (const store of stores) {
        if (!db.objectStoreNames.contains(store)) {
          if (store === 'cart') {
            db.createObjectStore("cart");
          } else {
            db.createObjectStore(store, { keyPath: 'id' });
          }
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

export async function getCartItems() {
  const db = await initDB();
  return (await db.getAll(CART_STORE)) || [];
}

export const addCartItem = async (item) => {
  const db = await initDB();

  // Ensure id, color, size are present and strings
  if (!item?.id || !item?.color || !item?.size) {
    console.error('Invalid cart item. Must have id, color, and size:', item);
    return;
  }

  
  const key = [String(item.id), String(item.color), String(item.size)];

  // TODO: Debug DataError when calling store.put with compound keys
// It doesn’t seem to break functionality, but might cause issues later.

 try {
  const tx = db.transaction('cart', 'readwrite');
  const store = tx.objectStore('cart');

  const key = [String(item.id), String(item.color), String(item.size)];
  const existing = await store.get(key);

  if (existing) {
    existing.quantity += item.quantity || 1;
    await store.put(existing, key);
  } else {
    await store.put({ ...item, quantity: item.quantity || 1 }, key);
  }

  await tx.done;
} catch (error) {
  if (error.name !== "DataError") {
    console.error('🔥 Failed to add/update cart item:', error);
  }
}

};








export async function removeCartItem(key) {
  const db = await initDB();
  await db.delete(CART_STORE, key);
}

export async function clearCart() {
  const db = await initDB();
  await db.clear(CART_STORE);
}