var express = require('express');
var router = express.Router();
require('../util/util')

//User 模型
let User = require("../models/user")
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post("/login", function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        //req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      } else {
        res.json({
          status: '1',
          msg: '查询不到数据，账号密码错误'
        })
      }
    }
  });
});
//登出
router.post('/logout', function (req, res, next) {
  //清除cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '登出成功',
    result: ''
  })
})
//验证登录
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});
//购物车
// 查询当前用户购物车数据
router.get('/cartList', function (req, res, next) {
  let userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        ersult: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: 'success',
          result: doc.cartList
        })
      } else {
        res.json({
          status: '0',
          msg: '查询未空',
          result: ''
        })
      }
    }
  })
})
// 购物车商品删除
router.post('/cartDel', function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;

  //删除用户下的商品
  User.update(
    {userId: userId},
    {
      $pull:
        {
          'cartList':
            {'productId': productId}
        }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: "success"
        })
      }
    })
})
// 修改商品
router.post('/cartEdit', function (req, res, next) {
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;
    User.update(
      {
        "userId": userId,
        "carList.productId": productId
      },
      {
        "cartList.$.productNum": productNum,
        "cartList.$.productNum": checked
      },
      function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      }
    )
  }
)
//全选
router.post('/editCheckAll', function (req, res, next) {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        doc.cartList.forEach(item => {
          item.checked = checkAll
        })
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            })
          }
        })
      }

    }
  })
})
//地址列表
router.get('/addressList', function (req, res, next) {
  let userId = req.cookies.userId
  User.findOne({'userId': userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})
// 设置默认收货地址
router.post('/setDefault', function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  if (!addressId) {
    res.json({
      status: '1003',
      msg: '缺少参数,请重试',
      result: ''
    })
  }
  User.findOne({"userId": userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList
      addressList.forEach(item => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      })

    }
  })
})
//删除地址
router.post('/delAddress', function (req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId
  User.update(
    {'userId': userId},
    {
      $pull: {
        "addressList": {
          'addressId': addressId
        }
      }
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: res.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        })
      }
    })
})
//支付
router.post('/payMent', function (req, res, next) {
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let address = '';
      let goodsList = [];
      // let orderTotal = 0;
      //获取当前用户的地址信息
      doc.addressList.forEach(item => {
        if (item.addressId == addressId) {
          address = item
        }
      })
      // 获取用户购物车购买商品
      doc.cartList.filter(item => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })
      //util 工具类生成orderId
      let platfrom = '622'; // 当前系统平台
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platfrom + r1 + sysDate + r2;
      //创建订单
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        orderStatus: '1',
        createData: createDate
      }
      // 数据库存储订单
      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: res.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })

    }
  })
})
router.get('/orderDetail', function (req, res, next) {
  let userId = req.cookies.userId
  let orderId = req.query.orderId  //get 请求获取参数
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let orderList = doc.orderList
      let orderTotal = ''
      if (orderList.length > 0) {
        orderList.filter(item => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal > 0) {  //订单总额大于零
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '查询无此订单',
            result: ''
          })
        }
      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})


module.exports = router;
