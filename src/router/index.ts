import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
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
    {
        path: '/registrator',
        name: 'Registrator',
        component: () => import('../views/Registrator.vue'),
    },
    {
        path: '/request',
        name: 'Request',
        component: () => import('../views/Request.vue'),
    },
    {
        path: '/requestFulfill/:id', name: 'RequestFulfill', component: () => import('../views/RequestFulfill.vue'), props: true,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
    },
];

const unAuthedRoutes = ['Login', 'Register'];
const registerOnlyRoutes = ['ьуьу'];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthed'];
    const role = store.getters['auth/userRole'];
    const routeName = to.name;
    if (routeName) {
        const isAllowed = !registerOnlyRoutes.includes(routeName.toString()) || role === 'REGISTER';
        if (isAuthenticated && unAuthedRoutes.includes(routeName.toString())) {
            if (role === 'USER') { next({name: 'Home'}); } else if (role === 'REGISTER') { next({name: 'Registrator'}); }
        } else if (!unAuthedRoutes.includes(routeName.toString()) && !isAuthenticated) {
            next({name: 'Login'});
        } else if (isAllowed) {
            next();
        } else {
            next({name: 'Home'});
        }
    } else {
        next();
    }
});

export default router;
