/****定义电影演员相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');


// 添加放映厅接口
router.post('/cinema-room/add',(req,res)=>{
  let {movie_cinema_id,room_name,room_type}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    movie_cinema_id:Joi.string().required(),  
    room_name:Joi.string().required(),
    room_type:Joi.string().required(),
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql=`insert into movie_cinema_room (movie_cinema_id,room_name,room_type) values (?,?,?)`
  pool.query(sql,[movie_cinema_id,room_name,room_type],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 查询电放映厅下的所有类型
router.get('/cinema-room/types',(req,res)=>{
  let sql='select * from movie_cinema_room_type'
  pool.query(sql,(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    res.send(Response.ok(result))
  })
})
// 查询当前电影院下所有放映厅
router.get('/cinema-rooms/cinemaid',(req,res)=>{
  let {cinema_id}=req.query
  // 服务器表单验证
  let schema=Joi.object({
    cinema_id:Joi.required(),  
  })
  let {error,value}=schema.validate(req.query)
  if(error){    res.send(Response.error(400,error))
   // return;  //结束
  }
  let sql='select * from movie_cinema_room  where movie_cinema_id=?'
  pool.query(sql,[cinema_id],(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    res.send(Response.ok(result))
  })
})
// 删除放映厅接口

router.post('/cinema-room/del',(req,res)=>{
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
  let sql='delete from movie_cinema_room where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
router.post('/cinema-room/edit-seat-template',(req,res)=>{
  let {id,seat_template,room_size}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    id: Joi.string().required(),
    seat_template: Joi.string().required(),
    room_size: Joi.string().required(),
  })
  let {error,value}=schema.validate(req.body)
  if(error){   
     res.send(Response.error(400,error))
      return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='update movie_cinema_room set seat_template=?,room_size=? where id=?'
  pool.query(sql,[seat_template,room_size,id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 通过Id查询放映厅
router.get('/cinema-room/query',(req,res)=>{
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
  let sql=`select 
  mcr.room_name cinema_room_name,
  mcr.room_size cinema_room_size,
  mcr.movie_cinema_id cinema_room_id,
  mcr.room_type cinema_room_type,
  mc.cinema_name cinema_name
  from 
  movie_cinema_room mcr join movie_cinema mc on mcr.movie_cinema_id=mc.id where mcr.id=?`
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

// 将router对象暴露出去
module.exports=router;