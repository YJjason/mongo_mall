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
          <a href="javascript:void(0)" class="price">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
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
              <ul>
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
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="maskdisplay" @click="closlePop"></div>
    <fooder></fooder>
  </div>
</template>

<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import NavHeader from '@/components/Header'
  import Fooder from '@/components/Fooder'
  import NavBread from '@/components/NavBread'


  import axios from 'axios'


  export default {
    name: "GoodsList",
    components: {
      NavHeader,
      Fooder,
      NavBread
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
        maskdisplay: false
      }
    },
    mounted() {
      this.getGoodsList()
    },
    methods: {
      getGoodsList() {
        axios.get('/goods').then(result => {
          let res = result.data;
          this.goodsList = res.result.list
        })
      },
      selectAll() {
        this.currentPrice = 0
        this.closlePop()
      },
      selectPrice(priceId) {
        this.currentPrice = priceId
        this.closlePop()
      },
      filterHandle() {
        this.showPrice = true
        this.maskdisplay = true
      },
      closlePop() {
        this.showPrice = false
        this.maskdisplay = false
      }
    }
  }
</script>

<style scoped>

</style>
`
