<template>
	<ul>
  		<li v-for="menu in menuNode"><span @click="selectTree(menu.id)"><i class="icon-folder-close"></i> {{ menu.name }}</span>
  			<tree v-if="menu.children" :menuNode="menu.children"></tree>
		</li>
	</ul>
</template>   
<script>
	import { EventBus } from '@/plugins/global'
	export default {
		props : ['menuNode'],
		methods : {
			selectTree(directoryId){
				EventBus.$emit('selectTree', directoryId);
				EventBus.$emit('hideSidebar');
				this.$root.$emit('bv::hide::modal', 'sidebar-backdrop')
			}
		}
	}
</script>