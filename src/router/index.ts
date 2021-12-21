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
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue'),
    },
];

const unAuthedRoutes = ['Login', 'Register'];
const protectedRoutes = ['Registrator', 'RequestFulfill'];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeResolve((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthed'];
    const role = store.getters['auth/userRole'];
    const routeName = to.name;
    if (routeName) {
        const route = routeName.toString();
        if (!isAuthenticated) {
            if (unAuthedRoutes.includes(route)) {
                next();
            } else {
                next({name: 'Login'});
            }
        } else if (unAuthedRoutes.includes(route) && isAuthenticated) {
            switch (role) {
            case 'ADMIN':
                next({name: 'Admin'});
                break;
            case 'REGISTER':
                next({name: 'Registrator'});
                break;
            case 'USER':
            default:
                next({name: 'Home'});
            }
        } else {
            switch (role) {
            case 'ADMIN':
                if (route !== 'Admin') { next({name: 'Admin'}); } else { next(); }
                break;
            case 'REGISTER':
                if (!protectedRoutes.includes(route)) {
                    next({name: 'Registrator'});
                }
                next();
                break;
            case 'USER':
            default:
                if (protectedRoutes.includes(route) || route === 'Admin') { next({name: 'Home'}); } else { next(); }
            }
        }
    } else {
        next();
    }
});

export default router;
