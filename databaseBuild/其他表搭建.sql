use shop_supporter; 
-- 用户信息表
create table purchasers(
   purchaser_id int primary key auto_increment,-- 用户id
    password varchar(50) not null,             -- 登录密码
    email varchar(100) not null,                -- 邮箱
    created_time datetime not null,            -- 注册时间
    profile_photo varchar(100),                -- 头像链接
    nickname varchar(20),                      -- 昵称
    receiver_address varchar(100),             -- 收货地址
    shopping_trolley varchar(100)              -- 购物车内容
);

-- 商家信息表
create table merchants(
    merchant_id int primary key auto_increment,-- 商家id
    password varchar(50) not null,             -- 登录密码
    email varchar(100) not null,                -- 邮箱
    created_time datetime not null,            -- 注册时间
    profile_photo varchar(100),                -- 头像链接
    nickname varchar(20),                      -- 昵称
    certificate varchar(100)                   -- 营业证书
);

-- 管理员信息表
create table administrators(
    administrator_id int primary key auto_increment,-- 管理员id
    password varchar(50) not null,                 -- 登录密码
    email varchar(100) not null,                -- 邮箱
    created_time datetime not null,                -- 注册时间
    profile_photo varchar(100),                    -- 头像链接
    nickname varchar(20)                           -- 昵称
);

-- 订单信息表
create table orders(
    order_id int primary key auto_increment,-- 订单id
    goods_id int not null,                   -- 商品id
    purchaser_id int not null,               -- 用户id
    merchant_id int not null,                -- 商家id
    receiver_address varchar(100),           -- 收货地址
    logistics_information varchar(100),      -- 物流信息
    is_take_delivery boolean default false,   -- 用户是否确认收货
    is_refund boolean default false,          -- 用户是否已申请退款
    refund_reason varchar(100),               -- 退款理由
    is_refund_allowed boolean default false   -- 商家是否允许退款
);

-- 评论信息表
create table comments(
    comment_id int primary key auto_increment, -- 评论id
    purchaser_id int not null,                 -- 用户id
    merchant_id int not null,                  -- 商家id
    purchaser_comment varchar(100),            -- 用户评论
    goods_grade int not null,                  -- 商品评分
    merchant_reply varchar(100)                -- 商家回复
);
-- 添加一个例子
insert into purchasers(password,email,created_time,profile_photo,nickname,receiver_address,shopping_trolley) values('aaa1234','guowenjie1970@163.com','2022-01-01','fulilian.jpg','芙莉莲','霓虹','1,4,6,3');
-- 添加一个例子
insert into merchants(password,email,created_time,profile_photo,nickname,certificate) values('admin123','guowenjie1970@163.com','2022-01-01','sagiri.png','和泉纱雾','certificate.jpg');
-- 添加一个例子
insert into administrators(password,email,created_time,profile_photo,nickname) values('admin123','guowenjie1970@163.com','2022-01-01','sagiri.png','和泉纱雾');
-- 添加一个例子
insert into orders(goods_id,purchaser_id,merchant_id,receiver_address,logistics_information,is_take_delivery,is_refund,refund_reason,is_refund_allowed) values(1,1,1,'霓虹','123',false,false,'123',false);
-- 添加一个例子
insert into comments(purchaser_id,merchant_id,purchaser_comment,goods_grade,merchant_reply) values(1,1,'123',3,'123');
-- 为已有表添加外键约束
ALTER TABLE orders
ADD CONSTRAINT fk_orders_goods 
    FOREIGN KEY (goods_id) REFERENCES products(goods_id),
ADD CONSTRAINT fk_orders_purchaser
    FOREIGN KEY (purchaser_id) REFERENCES purchasers(purchaser_id),
ADD CONSTRAINT fk_orders_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_id);

ALTER TABLE comments
ADD CONSTRAINT fk_comments_purchaser
    FOREIGN KEY (purchaser_id) REFERENCES purchasers(purchaser_id),
ADD CONSTRAINT fk_comments_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_id);

ALTER TABLE products
ADD CONSTRAINT fk_products_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_id);

-- 为了保证数据完整性,建议添加以下索引
ALTER TABLE orders
ADD INDEX idx_orders_goods (goods_id),
ADD INDEX idx_orders_purchaser (purchaser_id),
ADD INDEX idx_orders_merchant (merchant_id);

ALTER TABLE comments 
ADD INDEX idx_comments_purchaser (purchaser_id),
ADD INDEX idx_comments_merchant (merchant_id);

ALTER TABLE products
ADD INDEX idx_products_merchant (merchant_id);


