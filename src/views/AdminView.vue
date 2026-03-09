<script setup lang="ts">
import { ref } from 'vue';
import { Download, FileSpreadsheet, LayoutDashboard, Truck } from 'lucide-vue-next';

// Mock Admin Data
const orders = ref([
  { id: 'ORD-20240315-001', customer: '王小明', phone: '0912345678', district: '南區', weight: 15, amount: 2625, status: '待核帳' },
  { id: 'ORD-20240315-002', customer: '李小美', phone: '0987654321', district: '西屯', weight: 5, amount: 1000, status: '已付款' },
  { id: 'ORD-20240315-003', customer: '張大華', phone: '0911222333', district: '外縣市', weight: 10, amount: 2250, status: '待出貨' },
]);

const exportOrders = () => {
  alert('正在匯出訂單清單 (Excel/CSV)...');
};
</script>

<template>
  <div class="admin-view container">
    <div class="admin-header">
      <div class="title">
        <LayoutDashboard :size="24" />
        <h2>管理員控制台</h2>
      </div>
      <button @click="exportOrders" class="btn btn-primary">
        <Download :size="18" /> 匯出出貨清單
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass">
        <span class="label">今日訂單</span>
        <span class="value">24</span>
      </div>
      <div class="stat-card glass">
        <span class="label">總斤數</span>
        <span class="value">158 斤</span>
      </div>
      <div class="stat-card glass">
        <span class="label">待處理</span>
        <span class="value">8</span>
      </div>
    </div>

    <div class="order-table-container glass mt-4">
      <table class="order-table">
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>訂購人</th>
            <th>地區</th>
            <th>斤數</th>
            <th>金額</th>
            <th>狀態</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.district }}</td>
            <td>{{ order.weight }}斤</td>
            <td>${{ order.amount }}</td>
            <td><span :class="['status-badge', order.status]">{{ order.status }}</span></td>
            <td><button class="btn-text">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
}

.stat-card .label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.stat-card .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.order-table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.order-table th, .order-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.待核帳 { background: #fef3c7; color: #92400e; }
.status-badge.已付款 { background: #d1fae5; color: #065f46; }
.status-badge.待出貨 { background: #dbeafe; color: #1e40af; }

.btn-text {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  font-weight: 500;
}

.mt-4 { margin-top: 1.5rem; }
</style>
