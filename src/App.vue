<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from './store/order';

const store = useOrderStore();
onMounted(() => {
  store.fetchProducts();
});
</script>

<template>
  <header class="glass">
    <div class="container header-content">
      <div class="logo">
        <span class="logo-icon">🐚</span>
        <h1>海的女兒 蛤蠣專賣</h1>
      </div>
      <nav>
        <router-link to="/">首頁</router-link>
        <router-link to="/order">我要訂購</router-link>
        <router-link to="/admin">後台管理</router-link>
      </nav>
    </div>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <footer class="glass">
    <div class="container">
      <p>&copy; 2024 海的女兒 蛤蠣專賣 - 堅持新鮮，產地直送</p>
    </div>
  </footer>
</template>

<style>
@import './assets/styles/main.css';

header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  font-size: 1.25rem;
  color: var(--color-primary);
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: var(--color-text-light);
  font-weight: 500;
  transition: color 0.2s;
}

nav a.router-link-active {
  color: var(--color-primary);
}

main {
  flex: 1;
  padding: 2rem 0;
}

footer {
  padding: 2rem 0;
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-top: auto;
}
</style>
