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

export interface OrderSubmissionResponse {
  orderId: string;
  status: string;
  totalPay: string;
  message: string;
}

export interface AdminDashboardStats {
  todayOrdersCount: number;
  totalWeight: number;
  pendingOrdersCount: number;
}

export interface AdminOrder {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  address: string;
  district: string;
  totalWeight: number;
  items: string;
  isManagementOfficeCollect: boolean;
  paymentLastFive: string;
  status: string;
  statusChinese: string;
  finalAmount: number;
  notes: string;
  createdAt: string;
}

export interface AdminOrdersResponse {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: AdminOrder[];
}
