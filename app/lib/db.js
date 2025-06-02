import { openDB } from 'idb';

const DB_NAME = 'ecommerceDB';
const DB_VERSION = 5; 
const STORE_NAMES = ['men', 'women', 'kids', 'accessories'];
const CART_STORE = 'cart';
const WISHLIST_STORE = 'wishlist';
const ORDERS_STORE = 'orders';

const USERS_STORE = 'users';



export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const allStores = [...STORE_NAMES, CART_STORE, WISHLIST_STORE, ORDERS_STORE, USERS_STORE];

      for (const store of allStores) {
        if (!db.objectStoreNames.contains(store)) {
          if (store === CART_STORE) {
            db.createObjectStore(CART_STORE, { keyPath: null });
          } else if (store === ORDERS_STORE) {
            db.createObjectStore(ORDERS_STORE, { keyPath: 'id' });
          } else if (store === USERS_STORE) {
            db.createObjectStore(USERS_STORE, { keyPath: 'email' });
          } else if (store === WISHLIST_STORE) {
           
            db.createObjectStore(WISHLIST_STORE, { keyPath: null});
          } else {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        }
      }
    },
  });
};




//
// Product Category Functions
//

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
  return await store.getAll();
};

export const getProductById = async (category, id) => {
  const db = await initDB();
  const tx = db.transaction(category, 'readonly');
  const store = tx.objectStore(category);
  return await store.get(id);
};

export const getProductByIdAcrossStores = async (id) => {
  const db = await initDB();

  for (const store of STORE_NAMES) {
    const tx = db.transaction(store, 'readonly');
    const objStore = tx.objectStore(store);
    const result = await objStore.get(id);
    if (result) return result;
  }

  return null; 
};


//
// Wishlist Functions
//

export const addProductToWishlist = async (product) => {
  const db = await initDB();
  await db.put(WISHLIST_STORE, product);
};

export const removeProductFromWishlist = async (productId) => {
  const db = await initDB();
  await db.delete(WISHLIST_STORE, productId);
};

export const getWishlistProducts = async () => {
  const db = await initDB();
  return await db.getAll(WISHLIST_STORE);
};

export const clearWishlistDB = async () => {
  const db = await initDB();
  await db.clear(WISHLIST_STORE);
};

//
// Cart Functions
//

// 🛒 Get items for one user
export async function getCartItems(userEmail) {
  const db = await initDB();
  const tx = db.transaction(CART_STORE, 'readonly');
  const store = tx.objectStore(CART_STORE);

  const items = [];

  let cursor = await store.openCursor();
  while (cursor) {
    if (cursor.value.userEmail === userEmail) {
      items.push({ ...cursor.value, key: cursor.key });
    }
    cursor = await cursor.continue();
  }

  await tx.done;
  return items;
}

// ➕ Add or update a cart item for the user
export const addCartItem = async (item) => {
  const db = await initDB();

  if (!item?.id || !item?.color || !item?.size || !item?.userEmail) {
    console.error('Invalid cart item. Must have id, color, size, and userEmail:', item);
    return;
  }

  const key = [
    String(item.id),
    String(item.color),
    String(item.size),
    String(item.userEmail),
  ];

  try {
    const tx = db.transaction(CART_STORE, 'readwrite');
    const store = tx.objectStore(CART_STORE);

    const existing = await store.get(key);

    if (existing) {
      existing.quantity += item.quantity || 1;
      await store.put(existing, key);
    } else {
      await store.put({ ...item, quantity: item.quantity || 1 }, key);
    }

    await tx.done;
  } catch (error) {
    if (error.name !== 'DataError') {
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

//
// Order Functions
//

export const addOrder = async (order) => {
  const db = await initDB();
  await db.put(ORDERS_STORE, order);
};

export const getAllOrders = async () => {
  const db = await initDB();
  return await db.getAll(ORDERS_STORE);
};

//
// Stock Adjustment for Orders
//

export const updateStockForOrder = async (items) => {
  const db = await initDB();

  for (const item of items) {
    const category = item.category;
    if (!STORE_NAMES.includes(category)) continue;

    const tx = db.transaction(category, 'readwrite');
    const store = tx.objectStore(category);

    const product = await store.get(item.id);
    if (product) {
      product.stock = Math.max(0, (product.stock || 0) - item.quantity);
      await store.put(product);
    }

    await tx.done;
  }
};


//
// // USERS
//

export const addUser = async (user) => {
  const db = await initDB();
  return await db.put(USERS_STORE, user);
};

export const getUserByEmail = async (email) => {
  const db = await initDB();
  return await db.get(USERS_STORE, email);
};

export const getAllUsers = async () => {
  const db = await initDB();
  return await db.getAll(USERS_STORE);
};

export const updateUser = async (user) => {
  const db = await initDB();
  if (!user?.email) {
    throw new Error("User must have a valid email to update.");
  }
  return await db.put(USERS_STORE, user); 
};

