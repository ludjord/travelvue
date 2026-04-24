import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/destinations', name: 'Destinations', component: () => import('../pages/Destinations.vue') },
  { path: '/destinations/:id', name: 'DestinationDetail', component: () => import('../pages/DestinationDetail.vue') },
  { path: '/packages', name: 'Packages', component: () => import('../pages/Packages.vue') },
  { path: '/packages/:id', name: 'PackageDetail', component: () => import('../pages/PackageDetail.vue') },
  { path: '/booking/:packageId', name: 'Booking', component: () => import('../pages/Booking.vue'), meta: { requiresAuth: true } },
  { path: '/my-bookings', name: 'MyBookings', component: () => import('../pages/MyBookings.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue'), meta: { guestOnly: true } },
  { path: '/admin', name: 'AdminDashboard', component: () => import('../pages/admin/Dashboard.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/destinations', name: 'AdminDestinations', component: () => import('../pages/admin/ManageDestinations.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/packages', name: 'AdminPackages', component: () => import('../pages/admin/ManagePackages.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/bookings', name: 'AdminBookings', component: () => import('../pages/admin/ManageBookings.vue'), meta: { requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')
  if (to.meta.requiresAdmin && (!auth.isLoggedIn || !auth.isAdmin)) return next('/')
  if (to.meta.guestOnly && auth.isLoggedIn) return next('/')
  next()
})

export default router
