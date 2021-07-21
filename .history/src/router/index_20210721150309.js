import Vue from 'vue';
import VueRouter from 'vue-router';

import login from '../components/default/login.vue'
import Axis from '../components/Axis/index.vue'


Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            name: 'login',
            path: '/login',
            component: login
        },
        {
            name: 'Axis',
            path: '/axis',
            component: Axis
        },
        {
            name: 'Axis',
            path: '/axis/:id',
            component: Axis
        }
    ]
})