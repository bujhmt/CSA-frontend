import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
    },
];

const unAuthedRoutes = ['Login', 'Register'];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthed'];
    const routeName = to.name;
    if (routeName) {
        if (isAuthenticated && unAuthedRoutes.includes(routeName.toString())) {
            next({name: 'Home'});
        } else if (!unAuthedRoutes.includes(routeName.toString()) && !isAuthenticated) {
            next({name: 'Login'});
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
