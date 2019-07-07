/**
 * +----------------------------------------------------------------------
 * | goods
 * +----------------------------------------------------------------------
 * | Author: 1009239228@qq.com
 * +----------------------------------------------------------------------
 */
  //1.引入router
var express = require("express")
var router = express.Router()
// 2.引入mongoose 数据模块
var mongoose = require('mongoose')
var Goods = require('../models/goods')

//3.连接数据库
mongoose.connect('mongodb://localhost:27017/du_mall')

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})
mongoose.connection.on('error', () => {
  console.log('数据库连接失败')
})
mongoose.connection.on('disconnected', () => {
  console.log("数据库连接断开")
})

// 4. 获取路由
// 查询列表数据
router.get('/list', function (req, res, next) {
  //分页 借用mongodb 的skip 和limit
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  //价格区间
  let priceLevel = req.param("priceLevel");
  let priceGt = '', priceLte = ''
  let skip = (page - 1) * pageSize;
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '1':
        priceGt = 0;
        priceLte = 100;
        break;
      case '2':
        priceGt = 100;
        priceLte = 500;
        break;
      case '3':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '4':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }


  //排序
  let sort = req.param('sort')

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort}); //排序条件
  // Goods.find({}, function (err, doc) {
  //修改查询方式
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })

})

// 加入购物车

router.post('/addCart', function (req, res, next) {

  let userId = '100000077';
  let productId = req.body.productId   //post 方式取参数

  let User = require('../models/user');

  // 获取用户信息
  // User.find()//获取所有的
  User.findOne(   //查询当前第一个
    {
      userId: userId,
    },
    function (err, userDoc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        if (userDoc) {
          let goodsItem = '';
          userDoc.cartList.forEach(item => {
            if (item.productId == productId) {
              goodsItem = item
              parseInt(item.productNum++);
            }
          })
          if (goodsItem) {
            userDoc.save(function (err_2, doc_2) {
              if (err_2) {
                res.json({
                  status: '1',
                  msg: err.message
                })
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: 'suc '
                })
              }
            })
          } else {
            Goods.findOne({productId: productId}, function (err, doc) {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message
                })
              } else {
                if (doc) {
                  doc.procductNum = 1;
                  doc.checked = 1; //1是选中
                  userDoc.cartList.push(doc) //添加到数据库
                  userDoc.save(function (err_2, doc_2) {
                    if (err_2) {
                      res.json({
                        status: '1',
                        msg: err.message
                      })
                    } else {
                      res.json({
                        status: '0',
                        msg: '',
                        result: 'suc '
                      })
                    }
                  })
                }
              }
            })
          }

        }
      }
    }
  )
})

module.exports = router;
