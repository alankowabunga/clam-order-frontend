import { defineStore } from 'pinia';
import { ProductService, OrderService } from '../api';
import type { Product, OrderItem, OrderCalculationResponse, OrderCalculationRequest } from '../domain/models';

export const useOrderStore = defineStore('order', {
    state: () => ({
        products: [] as Product[],
        currentItems: [] as OrderItem[],
        calculationResult: null as OrderCalculationResponse | null,
        deliveryMethod: 'taichung_delivery' as OrderCalculationRequest['deliveryMethod'],
        district: '',
        address: '',
        isLoading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchProducts() {
            this.isLoading = true;
            try {
                this.products = await ProductService.getProducts();
            } catch (err) {
                this.error = '無法取得商品資訊';
            } finally {
                this.isLoading = false;
            }
        },

        async updateCalculation() {
            if (this.currentItems.length === 0) {
                this.calculationResult = null;
                return;
            }

            this.isLoading = true;
            try {
                this.calculationResult = await OrderService.calculatePrice({
                    items: this.currentItems,
                    deliveryMethod: this.deliveryMethod,
                    district: this.district,
                    address: this.address
                });
            } catch (err) {
                this.error = '試算金額失敗';
            } finally {
                this.isLoading = false;
            }
        },

        addItem(productId: string) {
            const item = this.currentItems.find(i => i.productId === productId);
            if (item) {
                item.qty++;
            } else {
                this.currentItems.push({ productId: productId, qty: 1 });
            }
            this.updateCalculation();
        },

        removeItem(productId: string) {
            const index = this.currentItems.findIndex(i => i.productId === productId);
            if (index > -1) {
                if (this.currentItems[index].qty > 1) {
                    this.currentItems[index].qty--;
                } else {
                    this.currentItems.splice(index, 1);
                }
                this.updateCalculation();
            }
        }
    }
});
