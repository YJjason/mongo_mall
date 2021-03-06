/**
 * +----------------------------------------------------------------------
 * | user
 * +----------------------------------------------------------------------
 * | Author: 1009239228@qq.com
 * +----------------------------------------------------------------------
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "productNum": String,
      "checked": String,
    }
  ],
  "addressList": [
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": String,
      "tel": String,
      "isDefault": Boolean
    }
  ]

});
module.exports = mongoose.model('Users', userSchema)
