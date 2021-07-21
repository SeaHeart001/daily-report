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
            path: '/Axis',
            component: Axis
        },
        {
            name: 'AxisDetial',
            path: '/Axis/:id',
            component: Axis
        }
    ]
})