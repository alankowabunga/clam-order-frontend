import axios from 'axios';
import type { Product, OrderCalculationRequest, OrderCalculationResponse, OrderSubmissionRequest } from '../domain/models';

const API_BASE = '/api/v1';

// Mock Data for Development
const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', name: '大', price_per_catty: 170, description: '約40顆/斤', is_limited: false },
    { id: 'p2', name: '特大', price_per_catty: 200, description: '約30顆/斤', is_limited: false },
    { id: 'p3', name: '冬季限定款', price_per_catty: 220, description: '約23顆/斤', is_limited: true, stock_remaining: 50 }
];

export const apiClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

export const ProductService = {
    async getProducts(): Promise<Product[]> {
        // In dev mode, return mock data
        if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_PRODUCTS;
        }
        const response = await apiClient.get('/products');
        return response.data;
    }
};

export const OrderService = {
    async calculatePrice(params: OrderCalculationRequest): Promise<OrderCalculationResponse> {
        if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const total_weight = params.items.reduce((sum, item) => sum + item.qty, 0);
            let subtotal = 0;
            params.items.forEach(item => {
                const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
                if (product) subtotal += product.price_per_catty * item.qty;
            });

            const bulk_discount = total_weight >= 20 ? total_weight * 10 : (total_weight >= 10 ? total_weight * 5 : 0);
            const is_pickup = params.delivery_method === 'pickup';
            const pickup_discount = is_pickup ? total_weight * 10 : 0;

            let shipping_fee = 0;
            if (!is_pickup) {
                if (params.district === '南區') {
                    shipping_fee = total_weight >= 3 ? 0 : 100; // Simplified
                } else {
                    shipping_fee = total_weight >= 5 ? 0 : 250;
                }
            }

            const final_amount = subtotal - bulk_discount - pickup_discount + shipping_fee;

            return {
                total_weight,
                subtotal,
                bulk_discount: -bulk_discount,
                pickup_discount: -pickup_discount,
                shipping_fee,
                final_amount,
                is_valid: true,
                message: "計算成功 (Mock)"
            };
        }
        const response = await apiClient.post('/order/calculate', params);
        return response.data;
    },

    async submitOrder(params: OrderSubmissionRequest) {
        if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { order_id: `ORD-${Date.now()}`, status: 'pending_payment', message: '訂單已收到 (Mock)' };
        }
        const response = await apiClient.post('/order/submit', params);
        return response.data;
    }
};
