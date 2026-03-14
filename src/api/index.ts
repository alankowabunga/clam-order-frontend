import axios from 'axios';
import type { Product, OrderCalculationRequest, OrderCalculationResponse, OrderSubmissionRequest } from '../domain/models';

const API_BASE = '/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

export const ProductService = {
    async getProducts(): Promise<Product[]> {
        const response = await apiClient.get('/products');
        return response.data;
    }
};

export const OrderService = {
    async calculatePrice(params: OrderCalculationRequest): Promise<OrderCalculationResponse> {
        const response = await apiClient.post('/order/calculate', params);
        return response.data;
    },

    async submitOrder(params: OrderSubmissionRequest) {
        const response = await apiClient.post('/order/submit', params);
        return response.data;
    }
};
