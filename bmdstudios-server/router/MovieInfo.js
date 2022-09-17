/****定义电影相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');
// 添加电影接口
 // http://localhost:3000/movie-actor/add
router.post('/movie-info/add',(req,res)=>{
  let {categoryId,cover,title,type,starActor,showingon,score,description,duration}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    categoryId:Joi.number().required(),
    cover:Joi.string().required(),
    title:Joi.string().required(),
    type:Joi.string().required(),
    starActor:Joi.string().required(),
    showingon:Joi.string().required(),
    score:Joi.string().required(),
    description:Joi.string().required(),
    duration:Joi.number().required()
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql=`insert into movie_info (category_id,cover,title,type,star_actor,showingon,score,description,duration) values (?,?,?,?,?,?,?,?,?)`
  pool.query(sql,[categoryId,cover,title,type,starActor,showingon,score,description,duration],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 查询所有电影类型
router.get('/movie-types',(req,res)=>{
  let sql='select * from movie_type'
  pool.query(sql,(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
    res.send(Response.ok(result))
  })
})
// 查询所有电影
router.get('/movie-infos',async(req,res)=>{
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
  //  执行查询数组任务
  try{
    let startIndex=(page-1)*pagesize
    let size=parseInt(pagesize)
    let sql=`select * from movie_info limit ?,?`
    let result=await pool.querySync(sql,[startIndex,size])
    // 执行查询总数
    let sql2=`select count(*) as count from movie_info`
    let result2=await pool.querySync(sql2,[startIndex,size])
    let total=result2[0].count
    res.send(Response.ok(
      {page:parseInt(page),pagesize:size,total,result})
      )
  }catch(error){
    res.send(Response.error(error))
  }
})
// 通过根据电影名称模糊查询带分页 name page pagesize
router.post('/movie-infos/name',async(req,res)=>{
  // 获取请求参数，get请求的参数封装在req.query中
  let {name,page,pagesize}=req.body
  // 服务器端的表单验证
  let schema=Joi.object({
    name:Joi.string().required(),
    page:Joi.number().required(),  //page必须是数组 必填项
    pagesize:Joi.number().integer().max(100).required() 
  })
  let {error,value} =schema.validate(req.body)  //验证的是对象--- let {page,pagesize}=req.query
   if(error){
    res.send(Response.error(400,error))
    // return  //结束
   }
  //  执行查询数组任务
  try{
    let startIndex=(page-1)*pagesize
    let size=parseInt(pagesize)
    let sql=`select * from movie_info where title like ?limit ?,?`
    let result=await pool.querySync(sql,[`%${name}%`,startIndex,size])
    // 执行查询总数
    let sql2=`select count(*) as count from movie_info`
    let result2=await pool.querySync(sql2,[`%${name}%`])
    let total=result2[0].count
    res.send(Response.ok(
      {page:parseInt(page),pagesize:size,total,result})
      )
  }catch(error){
    res.send(Response.error(error))
  }
})
// 删除电影接口
router.post('/movie-info/del',(req,res)=>{
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
  let sql='delete from movie_info where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 通过Id查询电影接口
router.get('/movie-info/query',(req,res)=>{
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
  let sql=`select * from movie_info where id=?`
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
// 更新电影接口
router.post('/movie-info/update',(req,res)=>{
  let {id,category_id,cover,title,type,star_actor,showingon,score,description,duration}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    category_id:Joi.number().required(),
    id:Joi.number().required(),
    cover:Joi.string().required(),
    title:Joi.string().required(),
    type:Joi.string().required(),
    star_actor:Joi.string().required(),
    showingon:Joi.string().required(),
    score:Joi.string().required(),
    description:Joi.string().required(),
    duration:Joi.number().required()
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行更新操作
  let sql=`update movie_info set category_id=?, cover=?,title=?,type=?,star_actor=?,showingon=?,score=?,description=?,duration=? where id=?`
  pool.query(sql,[category_id,cover,title,type,star_actor,showingon,score,description,duration,id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok(result))
  })
})

// 为电影绑定演员列表接口
router.post('/movie-info/bind-actors',async(req,res)=>{
  let {movie_id,actor_ids}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    movie_id: Joi.string().required(),
    actor_ids: Joi.allow(),
  })
  let {error,value}=schema.validate(req.body)
  if(error){   
     res.send(Response.error(400,error))
    //  return;  //结束
  }
  
  try{
    // 执行sql，批量插入数据
  // 执行sql，将movie_id的数据全部删除
    let sql='delete from movie_info_map_actor where movie_id=?'
    await pool.querySync(sql,[movie_id])
    if(!actor_ids){
      res.send(Response.ok())
      return
    }
     // 执行sql，将movie_id与actor_id绑定在一起，全部插入数据库
     let params=""
     let paramsArray=[]
     let ids=actor_ids.split(',') //所有的演员ID
     for(let i=0;i<ids.length;i++){
      params+="(?,?),"
      paramsArray.push(movie_id)
      paramsArray.push(ids[i])
     }

     let sql2='insert into movie_info_map_actor (movie_id,actor_id) values'+params
     sql2=sql2.substring(0,sql2.length-1)
    await pool.querySync(sql2,paramsArray)
    res.send(Response.ok())
  }catch(error){
    res.send(Response.error(500,error))
  }
})
// 将router对象暴露出去
module.exports=router;