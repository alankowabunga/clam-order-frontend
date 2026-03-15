<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../store/order';
import { ShoppingCart, MapPin, User, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-vue-next';
import { OrderService } from '../api';

const store = useOrderStore();
const step = ref(1);
const isSubmitting = ref(2);

const customerInfo = ref({
  name: '',
  phone: '',
  address: '',
  paymentLastFive: '',
  isManagementOfficeCollect: false
});

const submissionResult = ref<any>(null);

const nextStep = () => {
  if (step.value < 3) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const submitOrder = async () => {
  isSubmitting.value = 1;
  try {
    const res = await OrderService.submitOrder({
      items: store.currentItems,
      deliveryMethod: store.deliveryMethod,
      district: store.district,
      address: customerInfo.value.address,
      customerName: customerInfo.value.name,
      phone: customerInfo.value.phone,
      isManagementOfficeCollect: customerInfo.value.isManagementOfficeCollect,
      paymentLastFive: customerInfo.value.paymentLastFive
    });
    submissionResult.value = res;
    step.value = 4;
  } catch (err) {
    alert('提交訂單失敗，請稍後再試');
  } finally {
    isSubmitting.value = 2;
  }
};

const totalWeight = computed(() => store.calculationResult?.totalWeight || 0);

const canGoNext = computed(() => {
  if (step.value === 1) return store.currentItems.length > 0 && store.calculationResult?.isValid;
  if (step.value === 2) return store.deliveryMethod === 'pickup' || (store.district && customerInfo.value.address);
  if (step.value === 3) return customerInfo.value.name && customerInfo.value.phone && customerInfo.value.paymentLastFive;
  return false;
});

const districts = ['南區', '西區', '西屯', '北區', '北屯', '南屯', '東區', '中區', '大里', '烏日', '太平', '外縣市'];
</script>

<template>
  <div class="order-view container">
    <div class="step-indicator">
      <div v-for="i in 3" :key="i" :class="['step-dot', { active: step >= i }]">
        <span v-if="step > i">✓</span>
        <span v-else>{{ i }}</span>
      </div>
    </div>

    <div v-if="step === 1" class="step-content">
      <h3>選擇品項</h3>
      <div class="product-list">
        <div v-for="product in store.products" :key="product.id" class="order-item-card glass">
          <div class="item-name">
            <strong>{{ product.name }}</strong>
            <span>${{ product.pricePerCatty }}/斤</span>
          </div>
          <div class="item-controls">
            <button @click="store.removeItem(product.id)" class="btn-qty">-</button>
            <span class="qty">{{ store.currentItems.find(i => i.productId === product.id)?.qty || 0 }}</span>
            <button @click="store.addItem(product.id)" class="btn-qty">+</button>
          </div>
        </div>
      </div>
      
      <div v-if="store.currentItems.length > 0" class="mini-summary glass">
        <div class="row"><span>總斤數:</span> <strong>{{ totalWeight }} 斤</strong></div>
        <div class="info-msg" v-if="store.calculationResult?.message">💡 {{ store.calculationResult.message }}</div>
      </div>
    </div>

    <div v-if="step === 2" class="step-content">
      <h3>配送方式</h3>
      <div class="delivery-options">
        <label class="option-card glass" :class="{ selected: store.deliveryMethod === 'taichung_delivery' }">
          <input type="radio" value="taichung_delivery" v-model="store.deliveryMethod" @change="store.updateCalculation" />
          <MapPin />
          <span>台中配送</span>
        </label>
        <label class="option-card glass" :class="{ selected: store.deliveryMethod === 'pickup' }">
          <input type="radio" value="pickup" v-model="store.deliveryMethod" @change="store.updateCalculation" />
          <ShoppingCart />
          <span>門市自取</span>
        </label>
      </div>

      <div v-if="store.deliveryMethod === 'taichung_delivery'" class="form-group mt-4">
        <label>配送地區</label>
        <select v-model="store.district" @change="store.updateCalculation" class="form-input">
          <option value="">請選擇地區</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
        
        <label class="mt-4">詳細地址</label>
        <input type="text" v-model="customerInfo.address" placeholder="請輸入完整地址" class="form-input" />
      </div>
    </div>

    <div v-if="step === 3" class="step-content">
      <h3>訂購資訊</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>姓名</label>
          <input type="text" v-model="customerInfo.name" class="form-input" placeholder="請輸入姓名" />
        </div>
        <div class="form-group">
          <label>電話</label>
          <input type="tel" v-model="customerInfo.phone" class="form-input" placeholder="09xx-xxx-xxx" />
        </div>
        <div class="form-group">
          <label>匯款後五碼</label>
          <input type="text" v-model="customerInfo.paymentLastFive" class="form-input" placeholder="12345" />
        </div>
        <label class="checkbox-group mt-4">
          <input type="checkbox" v-model="customerInfo.isManagementOfficeCollect" />
          <span>管理室代收</span>
        </label>
      </div>

      <div class="final-calc glass mt-4" v-if="store.calculationResult">
         <div class="calc-row"><span>小計:</span> <span>${{ store.calculationResult.subtotal }}</span></div>
         <div class="calc-row discount"><span>量販優惠:</span> <span>{{ store.calculationResult.bulkDiscount }}</span></div>
         <div class="calc-row discount" v-if="store.calculationResult.pickupDiscount"><span>自取優惠:</span> <span>{{ store.calculationResult.pickupDiscount }}</span></div>
         <div class="calc-row"><span>運費:</span> <span>${{ store.calculationResult.shippingFee }}</span></div>
         <hr/>
         <div class="calc-row total"><span>總計:</span> <span>${{ store.calculationResult.finalAmount }}</span></div>
      </div>
    </div>

    <div v-if="step === 4" class="step-content success-view">
      <CheckCircle :size="64" color="var(--color-success)" />
      <h3>訂單提交成功！</h3>
      <p>訂單編號：{{ submissionResult?.order_id }}</p>
      <p>狀態：{{ submissionResult?.status }}</p>
      <router-link to="/" class="btn btn-primary mt-4">回到首頁</router-link>
    </div>

    <div class="navigation-actions" v-if="step < 4">
      <button v-if="step > 1" @click="prevStep" class="btn btn-outline">
        <ChevronLeft :size="20" /> 上一步
      </button>
      <button v-if="step < 3" @click="nextStep" class="btn btn-primary" :disabled="!canGoNext">
        下一步 <ChevronRight :size="20" />
      </button>
      <button v-else @click="submitOrder" class="btn btn-primary" :disabled="!canGoNext || isSubmitting === 1">
        {{ isSubmitting === 1 ? '提交中...' : '確認訂購' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.order-view {
  max-width: 600px;
  padding-bottom: 5rem;
}

.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.step-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  z-index: 2;
  transition: all 0.3s;
}

.step-dot.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
}

.step-content {
  margin-bottom: 2rem;
}

.step-content h3 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--color-primary);
}

.order-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
}

.item-name {
  display: flex;
  flex-direction: column;
}

.item-name span {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-qty {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
}

.mini-summary {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-top: 2rem;
  background: var(--color-secondary);
}

.delivery-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.option-card input {
  display: none;
}

.option-card.selected {
  border-color: var(--color-primary);
  background: rgba(30, 58, 138, 0.05);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.final-calc {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
}

.calc-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.discount {
  color: var(--color-success);
}

.total {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 1rem;
}

.navigation-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.navigation-actions .btn {
  flex: 1;
}

.success-view {
  text-align: center;
  padding: 3rem 0;
}

.mt-4 { margin-top: 1.5rem; }
</style>
