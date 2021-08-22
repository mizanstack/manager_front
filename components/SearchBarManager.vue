<template>
	<b-nav-form>
	    <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="keyword"></b-form-input>
	    <b-button size="sm" class="my-2 my-sm-0" type="submit" @click.prevent="hitSearch();">Search</b-button>
	  </b-nav-form>
</template>
<script>

	  import { EventBus } from '@/plugins/global'
	export default {
		data(){
			return {
				keyword : ''
			}
		},
		method : {
			hitSearch(){
		        EventBus.$emit('hit-search', this.keyword);
			}
		},
		mounted(){
			EventBus.$on('reset-search', ()=> {
				this.keyword = '';
			})
		}
	}
</script>