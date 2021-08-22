import Vue from 'vue'

import TreeMenu from '~/components/TreeMenu.vue';
import Tree from '~/components/Tree.vue';
import SidebarToggle from '~/components/SidebarToggle.vue';
import SearchBarManager from '~/components/SearchBarManager.vue';
Vue.component('tree-menu', TreeMenu);
Vue.component('tree', Tree);
Vue.component('sidebar-toggle', SidebarToggle);
Vue.component('search-bar-manager', SearchBarManager);

export const EventBus = new Vue()