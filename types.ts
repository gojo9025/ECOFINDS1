
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Not stored, only used for registration/login
}

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home & Garden',
  BOOKS = 'Books',
  SPORTS = 'Sports & Outdoors',
  OTHER = 'Other',
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  sellerId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: Product[];
  orderDate: string;
  total: number;
}

// FIX: Define a type for the application context to resolve type errors in consuming components.
export interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: { username: string; }) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  createProduct: (productData: Omit<Product, 'id' | 'sellerId'>) => Promise<void>;
  updateProduct: (id: string, productData: Omit<Product, 'id' | 'sellerId'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  checkout: () => Promise<void>;
}
