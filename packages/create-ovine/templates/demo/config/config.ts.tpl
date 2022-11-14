import { defineConfig } from '@ovine/next';

export default defineConfig({
  npmClient: '{{{ npmClient }}}',
  antd: {},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
  ],
});

