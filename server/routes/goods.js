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

router.get('/', function (req, res, next) {
  Goods.find({}, function (err, doc) {
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

module.exports = router;
