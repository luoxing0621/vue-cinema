const express=require('express')
// 引入响应信息
const Response=require('./utils/Response.js')
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = 'JWT_SECRET_KEY'
const app=express()
// const port=3000  //服务端口
const cors=require('cors')
app.use(cors({
  origin:"*"
}))
// 解析post请求参数
app.use(express.urlencoded())

// 自定义token全局验证中间件
const tokenTools=function(req,res,next){
  // 若请求路径是/user/login则不拦截，直接向后执行即可
if(req.path=='/user/login'){
  next()
  return
}
// 执行token验证
  console.log('处理token中间件');
  let token=req.headers['authorization']
  try{
    let payload=jwt.verify(token,'JWT_SECRET_KEY')
    req.tokenPayload=payload
  }catch(error){
   res.send(Response.error(401,'用户验证失败，请重新登录'))
   return
  }
  next()  //继续后续业务的执行
}
app.use(tokenTools)
// 引入外部路由
app.use(require('./router/MovieActor.js'))
app.use(require('./router/MovieDirector.js'))
app.use(require('./router/MovieInfo.js'))
app.use(require('./router/MovieThumb.js'))
app.use(require('./router/Cinema.js'))
app.use(require('./router/CinemaRoom.js'))
app.use(require('./router/ShowingonPlan.js'))
app.use(require('./router/Admin.js'))

app.get('/',(req,res)=>{
  res.send('Hello World!')
})
app.listen(3000,()=>{
  console.log('宏凯影城后端服务启动...')
})