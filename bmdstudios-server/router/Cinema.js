/****定义电影演员相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');


// 添加电影院接口
router.post('/cinema/add',(req,res)=>{
  let {cinema_name,address,province,city,district,longitude,latitude,tags}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    cinema_name:Joi.string().required(),  //page必须是数组 必填项
    address:Joi.string().required(),
    province:Joi.string().required(),
    city:Joi.string().required(),
    district:Joi.string().required(),
    longitude:Joi.number().required(),
    latitude:Joi.number().required(),
   tags:Joi.string().required()
   
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql=`insert into movie_cinema (cinema_name,address,province,city,district,longitude,latitude,tags) values (?,?,?,?,?,?,?,?)`
  pool.query(sql,[cinema_name,address,province,city,district,longitude,latitude,tags],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 查询电影院下的所有标签
router.get('/cinema/tags',(req,res)=>{
  let sql='select * from movie_cinema_tag'
  pool.query(sql,(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    res.send(Response.ok(result))
  })
})
// 查询所有电影院
router.get('/cinemas',(req,res)=>{
  let sql='select * from movie_cinema'
  pool.query(sql,(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    res.send(Response.ok(result))
  })
})
// 删除电影院接口

router.post('/cinema/del',(req,res)=>{
  let {id}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    id: Joi.string().required(),
  })
  let {error,value}=schema.validate(req.body)
  if(error){   
     res.send(Response.error(400,error))
    //  return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='delete from movie_cinema where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 通过Id查询电影院接口
router.get('/cinema/query',(req,res)=>{
  let {id}=req.query
  let schema=Joi.object({
    id: Joi.string().required(),
  })
  let {error,value}=schema.validate(req.query)
  if(error){   
     res.send(Response.error(400,error))
     return;  //结束
  }
  // 执行sql
  let sql=`select * from movie_cinema where id=?`
  pool.query(sql,[id],(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    if(result && result.length==0){
      // 没有查到
      res.send(Response.ok(null))
    }else{
      res.send(Response.ok(result[0]))
    }
  })
})
// 修改电影院接口
router.post('/cinema/update',(req,res)=>{
  let {cinema_name,address,province,city,district,longitude,latitude,tags,id}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    id:Joi.string().required(),
    cinema_name:Joi.string().required(), 
    address:Joi.string().required(),
    province:Joi.string().required(),
    city:Joi.string().required(),
    district:Joi.string().required(),
    longitude:Joi.number().required(),
    latitude:Joi.number().required(),
   tags:Joi.string().required()
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql=`update movie_cinema set 
  cinema_name=?,
  address=?,
  province=?,
  city=?,
  district=?,
  longitude=?,
  latitude=?,
  tags=?
  where id=?`
  pool.query(sql,[cinema_name,address,province,city,district,longitude,latitude,tags,id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 将router对象暴露出去
module.exports=router;