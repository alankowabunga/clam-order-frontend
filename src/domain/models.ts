export interface Product {
  id: string;
  name: string;
  price_per_catty: number;
  description: string;
  is_limited: boolean;
  stock_remaining?: number;
}

export interface OrderItem {
  product_id: string;
  qty: number;
}

export interface OrderCalculationRequest {
  items: OrderItem[];
  delivery_method: 'taichung_delivery' | 'pickup' | 'other_county';
  district?: string;
  address?: string;
}

export interface OrderCalculationResponse {
  total_weight: number;
  subtotal: number;
  bulk_discount: number;
  pickup_discount: number;
  shipping_fee: number;
  final_amount: number;
  is_valid: boolean;
  message: string;
}

export interface OrderSubmissionRequest extends OrderCalculationRequest {
  customer_name: string;
  phone: string;
  address: string;
  is_management_office_collect: boolean;
  payment_last_five: string;
}
