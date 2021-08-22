<template>
    <ul class="pagination" v-if="pageData.last_page > 1">
        <li v-if="pageData.current_page > 1">
            <a href="javascript:void(0)" aria-label="Previous" v-on:click.prevent="changePage(1)">
                <span aria-hidden="true">FIRST</span>
            </a>
        </li>
        <li v-if="pageData.current_page > 1">
            <a href="javascript:void(0)" aria-label="Previous" v-on:click.prevent="changePage(pageData.current_page - 1)">
                <span aria-hidden="true">PREVIOUS</span>
            </a>
        </li>
        <li v-for="page in pagesNumber" :class="{'active': page == pageData.current_page}">
            <a href="javascript:void(0)" v-on:click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li v-if="pageData.current_page < pageData.last_page">
            <a href="javascript:void(0)" aria-label="Next" v-on:click.prevent="changePage(pageData.current_page + 1)">
            <span aria-hidden="true">NEXT</span>
            </a>
        </li>
        <li v-if="pageData.current_page < pageData.last_page">
            <a href="javascript:void(0)" aria-label="Previous" v-on:click.prevent="changePage(pageData.last_page)">
                <span aria-hidden="true">LAST</span>
            </a>
        </li>
    </ul>
</template>
<script>
  import { EventBus } from '@/plugins/global'
  export default{
      props: {
      pageData: {
          type: Object,
          required: true
      },
      offset: {
          type: Number,
          default: 4
      }
    },
    computed: {
      pagesNumber() {
        if (!this.pageData.to) {
          return [];
        }
        let from = this.pageData.current_page - this.offset;
        if (from < 1) {
          from = 1;
        }
        let to = from + (this.offset * 2);
        if (to >= this.pageData.last_page) {
          to = this.pageData.last_page;
        }
        let pagesArray = [];
        for (let page = from; page <= to; page++) {
          pagesArray.push(page);
        }
          return pagesArray;
      }
    },
    methods : {
      changePage(page) {
        this.pageData.current_page = page;
        EventBus.$emit('hit-pagination', page)
        // this.$parent.pageClicked(page);
        // this.$emit('paginate');
      }
    }
  }
</script>