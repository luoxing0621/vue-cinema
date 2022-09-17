/****定义电影导演相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');

// 通过姓名关键字查询导演
// http://localhost:3000/movie-directors/name
router.post('/movie-directors/name',(req,res)=>{
  let {name}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    name:Joi.string().required() //name 必填项
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='select * from movie_director where director_name like ?'
  pool.query(sql,[`%${name}%`],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok(result))
  })
})

// 添加导演接口
 // http://localhost:3000/movie-director/add
router.post('/movie-director/add',(req,res)=>{
  let {directorName,directorAvatar}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    directorName:Joi.required(),  //page必须是数组 必填项
    directorAvatar:Joi.required()  
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='insert into movie_director (director_name,director_avatar) values (?,?)'
  pool.query(sql,[directorName,directorAvatar],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 删除导演接口
//http://localhost:3000/movie-director/del
router.post('/movie-director/del',(req,res)=>{
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
  let sql='delete from movie_director where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// http://localhost:3000/movie-directors?page=1&pagesize=10
router.get('/movie-directors',(req,res)=>{
  // 获取请求参数，get请求的参数封装在req.query中
  let {page,pagesize}=req.query
  // 服务器端的表单验证
  let schema=Joi.object({
    page:Joi.number().required(),  //page必须是数组 必填项
    pagesize:Joi.number().integer().max(100).required()  
  })
 let {error,value} =schema.validate(req.query)  //验证的是对象--- let {page,pagesize}=req.query
 if(error){
  res.send(Response.error(400,error))
  // return  //结束
 }
  // 查询数据库  movie-director
  let startIndex=(page-1)*10
  let size=parseInt(pagesize)
  let sql='select * from movie_director limit ?,?'
  pool.query(sql,[startIndex,size],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err;    ///如果有错误，服务器会崩
    }
    // 将结果封装，返回客户端
    res.send(Response.ok(result))
  })
})


// 将router对象暴露出去
module.exports=router;