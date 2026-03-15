<script setup lang="ts">
import { useOrderStore } from '../store/order';
import { ShoppingCart, Shell } from 'lucide-vue-next';

const store = useOrderStore();
</script>

<template>
  <div class="home-view">
    <section class="hero glass">
      <div class="container hero-grid">
        <div class="hero-text">
          <h2 class="badge">產地直送 • 極致新鮮</h2>
          <h3>來自大海的饋贈<br/>品質保證的<span class="highlight">新鮮蛤蠣</span></h3>
          <p>我們堅持每天早晨從海港直送，為您挑選最肥美、吐沙乾淨的頂級蛤蠣。不論是大顆飽滿還是限定款式，都能滿足您的味蕾。</p>
          <div class="hero-actions">
            <router-link to="/order" class="btn btn-primary">
              <ShoppingCart :size="20" />
              立即訂購
            </router-link>
            <a href="#products" class="btn btn-outline">查看品項</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">
             <Shell :size="120" color="var(--color-primary-light)" />
          </div>
        </div>
      </div>
    </section>

    <section id="products" class="products-section container">
      <div class="section-header">
        <h2>今日供應品項</h2>
        <p>目前在庫狀態一覽</p>
      </div>

      <div v-if="store.isLoading && store.products.length === 0" class="loading">
        讀取中...
      </div>

      <div v-else class="product-grid">
        <div v-for="product in store.products" :key="product.id" class="product-card glass">
          <div class="product-badge" v-if="product.isLimited">限量</div>
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="desc">{{ product.description }}</p>
            <div class="price-row">
              <span class="price">${{ product.pricePerCatty }} <span>/ 斤</span></span>
              <button @click="store.addItem(product.id)" class="btn-icon">
                <ShoppingCart :size="18" />
              </button>
            </div>
            <div class="stock" v-if="product.isLimited">
              剩餘庫存: {{ product.stockRemaining }} 斤
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  margin-bottom: 4rem;
  padding: 4rem 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
  color: white;
  border-radius: 0 0 32px 32px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.hero h3 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--color-secondary);
}

.hero p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-white);
  color: var(--color-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-outline {
  border: 1px solid var(--color-white);
  color: var(--color-white);
  background: transparent;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(5px);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.product-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.3s;
  padding: 1.5rem;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-danger);
  color: white;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
}

.product-info h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.product-info .desc {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.price span {
  font-size: 0.875rem;
  color: var(--color-text-light);
  font-weight: 400;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: var(--color-accent);
}

.stock {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-warning);
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero h3 {
    font-size: 2.25rem;
  }
}
</style>
