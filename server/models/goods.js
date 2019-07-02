/**
 * +----------------------------------------------------------------------
 * | goods
 * +----------------------------------------------------------------------
 * | Author: 1009239228@qq.com
 * +----------------------------------------------------------------------
 */

//加载mongoose 模块
var mongoose = require("mongoose");
//schema 模型  获取 mongoose 的schema
var Schema = mongoose.Schema

//定义商品模型
var produtSchema = new Schema({
  "productId": String,
  "productName": String,
  "prodcutPrice": Number,
  "prodcutImg": String
});


module.exports = mongoose.model('Goods',produtSchema)
