import Vue from 'vue';
import VueRouter from 'vue-router';

import Axis from '../components/Axis/index.vue'

export default {
    mode: 'hash',
    routes: [
        {
            path: '/axis',
            component: Axis
        }
    ]
}