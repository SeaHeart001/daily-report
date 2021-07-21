import Vue from 'vue';
import VueRouter from 'vue-router';

import login from '../components/default/login.vue;'
import Axis from '../components/Axis/index.vue'


Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {

        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/axis',
            component: Axis
        }
    ]
})