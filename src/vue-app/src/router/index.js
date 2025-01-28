import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import WorkflowPage from '@/components/WorkflowPage.vue';
import IntakeForm from '@/components/IntakeForm.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/workflow/:instanceid',
    name: 'workflow',
    component: WorkflowPage,
    props: true // Pass route params as props
  },
  {
    path: '/intake-form',
    name: 'intakeForm',
    component: IntakeForm
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
