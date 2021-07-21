import Vue from 'vue';
import VueRouter from 'vue-router';

import Axis from '../components/Axis/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/axis',
            component: Axis
        }
    ]
})