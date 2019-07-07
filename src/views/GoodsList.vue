`
<template>
  <div>
    <nav-header></nav-header>
    <div class="nav-breadcrumb-wrap">
      <div class="container">
        <nav-bread>
          <span>goods</span>
        </nav-bread>
      </div>
    </div>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short" style="width: 50px;height: 30px">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="filterHandle">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" :class="{'filterby-show':showPrice}" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="selectAll"
                     :class="{'cur':currentPrice ==0}">All</a></dd>
              <dd v-for="(item,index) in priceFilter">
                <a href="javascript:void(0)" @click="selectPrice(item.id)"
                   :class="{'cur':item.id==currentPrice}">
                  {{item.startPrice}}
                  -
                  {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul class="clearfix">
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'../../static/'+item.productImage" alt="">
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <!--加载中...-->
                <img src="../assets/loading-spinning-bubbles.svg" v-if="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="maskdisplay" @click="closlePop"></div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <footer></footer>
  </div>
</template>

<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import NavHeader from '@/components/Header'
  import Fooder from '@/components/Footer'
  import NavBread from '@/components/NavBread'
  import Modal from '@/components/Modal'


  import axios from 'axios'


  export default {
    name: "GoodsList",
    components: {
      NavHeader,
      Fooder,
      NavBread,
      Modal
    },
    data() {
      return {
        goodsList: [],
        priceFilter: [
          {
            id: 1,
            startPrice: '0.00',
            endPrice: '500'
          },
          {
            id: 2,
            startPrice: '500.00',
            endPrice: '1000'
          },
          {
            id: 3,
            startPrice: '1000.00',
            endPrice: '3000'
          },
        ],
        currentPrice: 0,
        showPrice: false,
        maskdisplay: false,
        sortflag: true, //升序
        page: 1,
        pageSize: 8,
        busy: false,
        priceChecked: 'all',//价格区间
        loading: false,
        mdShow:false,
        mdShowCart:false
      }
    },
    mounted() {
      this.getGoodsList()
    },
    methods: {
      getGoodsList(flag) {
        this.loading = true
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortflag == true ? 1 : -1,
          priceLevel: this.priceChecked
        }
        axios.get('/goods/list', {
          params: param
        }).then(result => {
          let res = result.data;
          this.loading = true;
          if (flag) { // 分页 data 进行累加
            this.goodsList = this.goodsList.concat(res.result.list)
            if (this.result.count == 0) {
              this.busy = true //没有数据不在滚动
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = res.result.list
            this.busy = false
          }
        })
      },
      selectAll() {
        this.currentPrice = 0
        this.priceChecked = 'all'
        this.getGoodsList()
        this.closlePop()
      },
      selectPrice(priceId) {
        this.currentPrice = priceId
        this.priceChecked = priceId
        this.page = 1
        this.getGoodsList()
        this.closlePop()
      },
      filterHandle() {
        this.showPrice = true
        this.maskdisplay = true
      },
      closlePop() {
        this.showPrice = false
        this.maskdisplay = false
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      },
      //排序
      sortGoods() {
        this.sortflag = !this.sortflag
        this.page = 1
        this.getGoodsList()
      },
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.page++
          this.getGoodsList(true)
        }, 1000)
      },
      //添加购物车
      addCart(id) {
        axios.post('/goods/addCart', {
          productId: id
        }).then(res => {
          console.log(112, res)
          if (res.status == 200 && res.data.status == 0) {
            // alert('成功')
            this.mdShowCart=true
            this.$store.commit('updateCartCount',1)
          } else {
            // alert(res.data.msg)
            this.mdShow=true
          }
        })
      }
    }
  }
</script>

<style scoped>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
`
