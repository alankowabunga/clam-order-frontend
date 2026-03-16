import axios from 'axios';
import type { Product, OrderCalculationRequest, OrderCalculationResponse, OrderSubmissionRequest, OrderSubmissionResponse, AdminDashboardStats, AdminOrdersResponse } from '../domain/models';

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

    async submitOrder(params: OrderSubmissionRequest): Promise<OrderSubmissionResponse> {
        const response = await apiClient.post('/order/submit', params);
        return response.data;
    }
};

export const AdminService = {
    async getDashboardStats(): Promise<AdminDashboardStats> {
        const response = await apiClient.get('/admin/dashboard/stats');
        return response.data;
    },

    async getOrders(params?: { page?: number; size?: number; status?: string; startDate?: string; endDate?: string }): Promise<AdminOrdersResponse> {
        const response = await apiClient.get('/admin/orders', { params });
        return response.data;
    },

    async exportOrders(params?: { groupBy?: string; startDate?: string; endDate?: string }) {
        const response = await apiClient.get('/admin/orders/export', {
            params,
            responseType: 'blob' // Required to handle binary file download
        });

        // Create a download link and trigger it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from Content-Disposition header if possible
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'orders_export.csv';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
