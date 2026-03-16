<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Download, FileSpreadsheet, LayoutDashboard, Truck } from 'lucide-vue-next';
import { AdminService } from '../api';
import type { AdminDashboardStats, AdminOrder } from '../domain/models';

const stats = ref<AdminDashboardStats>({
  todayOrdersCount: 0,
  totalWeight: 0,
  pendingOrdersCount: 0
});

const orders = ref<AdminOrder[]>([]);
const isLoading = ref(true);

const fetchAdminData = async () => {
  isLoading.value = true;
  try {
    const [statsRes, ordersRes] = await Promise.all([
      AdminService.getDashboardStats(),
      AdminService.getOrders({ page: 1, size: 50 })
    ]);
    stats.value = statsRes;
    orders.value = ordersRes.content;
  } catch (err) {
    console.error('Failed to fetch admin data', err);
    alert('無法載入後台數據，請檢查後端連線');
  } finally {
    isLoading.value = false;
  }
};

const exportOrders = async () => {
  try {
    await AdminService.exportOrders();
  } catch (err) {
    console.error('Failed to export orders', err);
    alert('匯出清單失敗');
  }
};

onMounted(() => {
  fetchAdminData();
});
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
        <span class="value">{{ stats.todayOrdersCount }}</span>
      </div>
      <div class="stat-card glass">
        <span class="label">總斤數</span>
        <span class="value">{{ stats.totalWeight }} 斤</span>
      </div>
      <div class="stat-card glass">
        <span class="label">待處理</span>
        <span class="value">{{ stats.pendingOrdersCount }}</span>
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
        <tbody v-if="!isLoading">
          <tr v-for="order in orders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.customerName }}<br/><small>{{ order.phone }}</small></td>
            <td>{{ order.district }}</td>
            <td>{{ order.totalWeight }}斤</td>
            <td>${{ order.finalAmount }}</td>
            <td><span :class="['status-badge', order.status]">{{ order.statusChinese }}</span></td>
            <td><button class="btn-text">查看</button></td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="7" class="text-center">目前沒有訂單</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="text-center">載入中...</td>
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

.status-badge.PENDING_PAYMENT, .status-badge.待核帳 { background: #fef3c7; color: #92400e; }
.status-badge.PAID, .status-badge.已付款 { background: #d1fae5; color: #065f46; }
.status-badge.READY_TO_SHIP, .status-badge.待出貨 { background: #dbeafe; color: #1e40af; }
.status-badge.COMPLETED { background: #f3f4f6; color: #4b5563; }
.status-badge.CANCELLED { background: #fee2e2; color: #b91c1c; }

.btn-text {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  font-weight: 500;
}

.mt-4 { margin-top: 1.5rem; }
</style>
