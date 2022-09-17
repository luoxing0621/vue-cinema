const express=require('express')
const app=express()
const Response=require('./utils/Response')
// 配置跨域
const cors=require('cors')
app.use(cors({
  origin:"*"
}))
// 配置multer中间件，处理文件上传
const multer=require('multer')
const uuid=require('uuid')
const uploadTools=multer({
  storage:multer.diskStorage({
    // 该存储方案将会把文件直接存入磁盘
    destination:(req,file,callback)=>{
      callback(null,'static')
    },
    filename:(req,file,callback)=>{
      // 通过file，获取原始文件名
      let name=file.originalname
      // 截取文件的后缀 .jpg .png
      let ext=name.substr(name.lastIndexOf('.'))
      // 生成一个随机文件名，调用callback返回即可
      let newName=uuid.v4()+ext
      callback(null,newName)
    }
  })
})
// 配置静态资源托管文件夹，这样就可以直接通过http://ip:port/文件名  访问static文件夹
app.use(express.static('static'))
//http://localhost:8888/upload
app.post('/upload',uploadTools.single('file'),(req,res)=>{
  // multer中间件将会把文件信息存入req.file中
  let url="http://localhost:8888/"+req.file.filename
  console.log(req.files)
  // uploadTools.array('file')将会把file字段中传输的文件数据通过uploadTools接收并保存
res.send(Response.ok(url))
})
app.listen(8888,()=>{
  console.log('上传文件服务器已经成功')
})
