use shop_supporter; 
-- 用户信息表
create table purchasers(
   purchaser_id int primary key auto_increment,-- 用户id
    password varchar(255) not null,             -- 登录密码
    email varchar(100) not null,                -- 邮箱
    created_time datetime not null,            -- 注册时间
    profile_photo varchar(100),                -- 头像链接
    nickname varchar(20),                      -- 昵称
    receiver_address varchar(1000),             -- 收货地址
    shopping_trolley varchar(100)   ,           -- 购物车内容
    preference varchar(100)                    -- 用户偏好
);

-- 商家信息表
create table merchants(
    merchant_id int primary key auto_increment,-- 商家id
    password varchar(255) not null,             -- 登录密码
    email varchar(100) not null,                -- 邮箱
    created_time datetime not null,            -- 注册时间
    profile_photo varchar(100),                -- 头像链接
    nickname varchar(20),                      -- 昵称
    certificate varchar(100)                   -- 营业证书
);

-- 管理员信息表
create table administrators(
    administrator_id int primary key auto_increment,-- 管理员id
    password varchar(255) not null,                 -- 登录密码
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
    receiver_address varchar(1000),           -- 收货地址
    logistics_information varchar(200),      -- 物流信息
    is_take_delivery boolean default false,   -- 用户是否确认收货
    is_refund boolean default false,          -- 用户是否已申请退款
    refund_reason varchar(200),               -- 退款理由
    is_refund_allowed boolean default false ,  -- 商家是否允许退款
    is_paid  boolean default false ,           -- 用户是否已付款
    goods_count int not null  ,                 -- 商品数量
    created_time datetime  default null         -- 订单创建时间
);

-- 评论信息表
create table comments(
    comment_id int primary key auto_increment, -- 评论id
    purchaser_id int not null,                 -- 用户id
    merchant_id int not null,                  -- 商家id
    purchaser_comment varchar(200),            -- 用户评论
    goods_grade int not null,                  -- 商品评分
    merchant_reply varchar(200) ,               -- 商家回复
    goods_id int not  null                     -- 商品id
);
-- 添加一个例子
insert into purchasers(password,email,created_time,profile_photo,nickname,receiver_address,shopping_trolley,preference) values
                                                                                                                 ('4pfOymw0fhSIrIbWBg3z5REAdaQ1/h39Ig+rd2f8tjk=','guowenjie1970@qq.com','2022-01-01','guowenjie1970@qq.com.png','sagiri','{"recipient":"sagiri","phone_number":"12312312","country":"中国","province":"江西","city":"赣州","detail":"xx县xx区"}','{"4":"1","67":"5"}','其他,童装玩具,大家电');
-- 添加一个例子
insert into merchants(password,email,created_time,profile_photo,nickname,certificate) values
                                                                                          ('4pfOymw0fhSIrIbWBg3z5REAdaQ1/h39Ig+rd2f8tjk=','guowenjie1970@qq.com','2022-01-01','guowenjie1970@qq.com.png','sagiri','certificate.jpg');
-- 添加一个例子
insert into administrators(password,email,created_time,profile_photo,nickname) values
                                                                                   ('4pfOymw0fhSIrIbWBg3z5REAdaQ1/h39Ig+rd2f8tjk=','guowenjie1970@qq.com','2022-01-01','guowenjie1970@qq.com.png','sagiri');
-- 添加一个例子
insert into orders(goods_id,purchaser_id,merchant_id,receiver_address,logistics_information,is_take_delivery,
                   is_refund,refund_reason,is_refund_allowed,is_paid,goods_count,created_time) values(1,1,1,'{"country":"中国",
"province":"江西",
"city":"赣州","detail":"xx县xx区"}','正在揽收',false,false,'123',false,false,0,'2022-01-01');
-- 添加一个例子
insert into comments(purchaser_id,merchant_id,purchaser_comment,goods_grade,merchant_reply,goods_id) values(1,1,
                                                                                                      '商品很好敏感肌也能用',3,
                                                                                                   '感谢评价支持!','1');
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


