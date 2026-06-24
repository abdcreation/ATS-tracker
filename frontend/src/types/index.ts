export interface ProductConfig {
  material: string;
  color: string;
  text: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  features: string[];
  defaultConfig: ProductConfig;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  config: ProductConfig;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  billing: AddressInfo;
  shipping?: AddressInfo;
  total: number;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
}
