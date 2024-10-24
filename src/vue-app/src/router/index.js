import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import WorkflowPage from '@/components/WorkflowPage.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: WorkflowPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
