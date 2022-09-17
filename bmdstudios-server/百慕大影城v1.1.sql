DROP DATABASE IF EXISTS bmdstudios;
CREATE DATABASE bmdstudios DEFAULT CHARSET UTF8;
USE bmdstudios;

CREATE TABLE `movie_actor` (
`id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID\r\n',
`actor_name` varchar(255) NOT NULL COMMENT '演员名称\r\n',
`actor_avatar` varchar(255) NOT NULL COMMENT '演员头像路径',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_cinema` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`cinema_name` varchar(255) NOT NULL COMMENT '影院名称',
`address` varchar(255) NOT NULL COMMENT '影院地址',
`province` varchar(255) NULL COMMENT '省份（北京市，河北省）',
`city` varchar(255) NULL COMMENT '影院所在城市名称（北京市、石家庄市）',
`district` varchar(255) NULL COMMENT '区（海淀区、桥西区）',
`longitude` double NOT NULL COMMENT '经度',
`latitude` double NOT NULL COMMENT '纬度',
`tags` varchar(255) NULL COMMENT '影院支持的标签（用/分隔，例如：退/改签/小吃/）',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_cinema_room_type` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`type_name` varchar(255) NOT NULL COMMENT '影院中放映厅的名称',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_cinema_room` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`room_name` varchar(255) NOT NULL COMMENT '放映厅名称（一号厅、二号厅）',
`room_size` varchar(255) NOT NULL COMMENT '放映厅的大小（1.50人  2.100人 3.150人 4.更多）',
`room_type` varchar(255) NULL COMMENT '放映厅类型，关联roomtype表',
`seat_template` mediumtext NULL COMMENT '存储当前放映厅的作为模板字符串',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_city` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`name` varchar(255) NULL COMMENT '城市名称',
`pinyin` varchar(255) NULL COMMENT '拼音',
`sort` int(11) NULL COMMENT '序号',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_director` (
`id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID\r\n',
`director_name` varchar(255) NOT NULL COMMENT '导演名称\r\n',
`director_avatar` varchar(255) NOT NULL COMMENT '导演头像路径',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_info` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`category_id` int(11) NOT NULL COMMENT '电影分类ID  1.热映  2.待映   3.经典',
`cover` varchar(255) NULL COMMENT '电影封面图片路径',
`title` varchar(255) NULL COMMENT '电影标题',
`type` varchar(255) NULL COMMENT '电影类型（冗余字段）',
`star_actor` varchar(255) NULL COMMENT '电影主演明星（冗余字段）',
`showingon` varchar(255) NULL COMMENT '上映时间（冗余字段）',
`score` varchar(255) NULL COMMENT '电影评分（冗余字段）',
`description` mediumtext CHARACTER SET utf8 NULL COMMENT '电影描述',
`duration` int(5) NULL COMMENT '电影时长（单位：分钟）',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_info_map_actor` (
`id` int(11) AUTO_INCREMENT NOT NULL,
`movie_id` int(11) NULL,
`actor_id` int(11) NULL,
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;



CREATE TABLE `movie_info_map_director` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`movie_id` int(11) NULL,
`director_id` int(11) NULL,
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_thumb` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`url` varchar(255) NULL COMMENT '剧照路径',
`movie_id` int(11) NULL COMMENT '外键字段，关联movie_info表ID字段，表示属于哪个电影',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_type` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '电影类型名称（言情、武侠等）',
`typename` varchar(255) NULL,
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

LOCK TABLES `movie_type` WRITE;
/*!40000 ALTER TABLE `movie_type` DISABLE KEYS */;
INSERT INTO `movie_type` VALUES (1,'爱情'),(2,'青春'),(3,'奇幻'),(5,'古装'),(6,'喜剧'),(7,'剧情'),(8,'动作'),(13,'动画'),(14,'冒险'),(15,'犯罪'),(18,'战争'),(20,'历史'),(24,'科幻'),(34,'纪录片'),(36,'惊悚'),(37,'恐怖'),(39,'儿童'),(48,'音乐'),(51,'家庭'),(53,'灾难'),(62,'传记'),(70,'运动'),(87,'悬疑');
/*!40000 ALTER TABLE `movie_type` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE `user` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`loginname` varchar(255) NULL COMMENT '登录账号',
`password` varchar(255) NULL COMMENT '密码',
`nickname` varchar(255) NULL COMMENT '昵称',
`phone` varchar(15) NULL COMMENT '手机号',
`validate_code` varchar(6) NULL COMMENT '短信验证码',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `user_want_log` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) NULL COMMENT '用户ID',
`movie_id` int(11) NULL COMMENT '用户想看的电影ID',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `user_visited_log` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) NULL COMMENT '用户ID',
`movie_id` int(11) NULL COMMENT '用户想看的电影ID',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `movie_cinema_tag` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`tagname` varchar(255) NULL COMMENT '影院支持的标签（退、改签、小吃、4K等）',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `showingon_plan` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`cinema_id` int(11) NULL COMMENT '影院ID',
`cinema_room_id` int(11) NULL COMMENT '放映厅ID',
`movie_id` int(11) NULL COMMENT '上映电影ID',
`showingon_date` bigint(20) NULL COMMENT '上映时间（datetime类型）',
`showingon_time` varchar(10) NULL COMMENT '场次，上映时间（HH:mm）',
`status` int(1) NULL COMMENT '计划发布状态（0.稍后发布  1.立即发布）',
`price` decimal(10,2) NULL COMMENT '票价',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `ticket_order` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) NULL,
`showingon_plan_id` int(11) NULL,
`seat_name` varchar(255) NULL COMMENT '座位编号（1排23号）',
`price` decimal(10,2) NULL COMMENT '票价',
`showingon_date` datetime NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上映日期（年月日）',
`showingon_time` varchar(255) NULL COMMENT '开播时间（HH:mm）',
`movie_name` varchar(255) NULL COMMENT '电影名称（冗余字段）',
`cinema_name` varchar(255) NULL COMMENT '影院名称（冗余字段）',
`cinema_room_name` varchar(255) NULL COMMENT '影院放映厅名称（一号厅）',
`cinema_room_type` varchar(255) NULL COMMENT '放映厅类型（4D厅）',
PRIMARY KEY (`id`) 
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

