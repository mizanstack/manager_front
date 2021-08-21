import Vue from 'vue'

import TreeMenu from '~/components/TreeMenu.vue';
import Tree from '~/components/Tree.vue';
import SidebarToggle from '~/components/SidebarToggle.vue';
Vue.component('tree-menu', TreeMenu);
Vue.component('tree', Tree);
Vue.component('sidebar-toggle', SidebarToggle);

export const EventBus = new Vue()