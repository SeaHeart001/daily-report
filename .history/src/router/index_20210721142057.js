import Vue from 'vue';
import VueRouter from 'vue-router';

import Axis from '../components/Axis/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/axis',
            component: Axis
        }
    ]
})