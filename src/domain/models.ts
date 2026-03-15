export interface Product {
  id: string;
  name: string;
  pricePerCatty: number;
  description: string;
  isLimited: boolean;
  stockRemaining?: number;
}

export interface OrderItem {
  productId: string;
  qty: number;
}

export interface OrderCalculationRequest {
  items: OrderItem[];
  deliveryMethod: 'taichung_delivery' | 'pickup' | 'other_county';
  district?: string;
  address?: string;
}

export interface OrderCalculationResponse {
  totalWeight: number;
  subtotal: number;
  bulkDiscount: number;
  pickupDiscount: number;
  shippingFee: number;
  finalAmount: number;
  isValid: boolean;
  message: string;
}

export interface OrderSubmissionRequest extends OrderCalculationRequest {
  customerName: string;
  phone: string;
  address: string;
  isManagementOfficeCollect: boolean;
  paymentLastFive: string;
}
