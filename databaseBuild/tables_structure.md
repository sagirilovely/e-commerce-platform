##### administrators;
| Field              | Type          | Null | Key | Default | Extra          | describe             |
| :----------------- | :------------ | :--- | :-- | :------ | :------------- | :------------------- |
| administrator\_id  | int           | NO   | PRI | null    | auto\_increment | 管理员id             |
| password           | varchar\(20\) | NO   |     | null    |                | 登录密码             |
| created\_time      | datetime      | NO   |     | null    |                | 注册时间             |
| profile\_photo     | varchar\(100\)| YES  |     | null    |                | 头像链接(图片路径)   |
| nickname           | varchar\(20\) | YES  |     | null    |                | 昵称                 |
| token              | varchar\(100\)| YES  |     | null    |                | token                |

---

##### comments;
| Field              | Type          | Null | Key | Default | Extra          | describe               |
| :----------------- | :------------ | :--- | :-- | :------ | :------------- | :--------------------- |
| comment\_id        | int           | NO   | PRI | null    | auto\_increment | 评论id                 |
| purchaser\_id      | int           | NO   | MUL | null    |                | 用户id                 |
| merchant\_id       | int           | NO   | MUL | null    |                | 商家id                 |
| purchaser\_comment | varchar\(100\)| YES  |     | null    |                | 用户评论               |
| goods\_grade       | int           | NO   |     | null    |                | 商品评分               |
| merchant\_reply    | varchar\(100\)| YES  |     | null    |                | 商家回复               |

---

##### merchants;
| Field              | Type          | Null | Key | Default | Extra          | describe                |
| :----------------- | :------------ | :--- | :-- | :------ | :------------- | :---------------------- |
| merchant\_id       | int           | NO   | PRI | null    | auto\_increment | 商家id                  |
| password           | varchar\(20\) | NO   |     | null    |                | 登录密码                |
| email              | varchar\(20\) | NO   |     | null    |                | 邮箱                    |
| created\_time      | datetime      | NO   |     | null    |                | 注册时间                |
| profile\_photo     | varchar\(100\)| YES  |     | null    |                | 头像链接(图片路径)      |
| nickname           | varchar\(20\) | YES  |     | null    |                | 昵称                    |
| certificate        | varchar\(100\)| YES  |     | null    |                | 营业证书(图片路径)      |
| token              | varchar\(100\)| YES  |     | null    |                | token                   |

---

##### orders;
| Field               | Type          | Null | Key | Default | Extra          | describe                  |
| :------------------ | :------------ | :--- | :-- | :------ | :------------- | :------------------------ |
| order\_id           | int           | NO   | PRI | null    | auto\_increment | 订单id                    |
| goods\_id           | int           | NO   | MUL | null    |                | 商品id                    |
| purchaser\_id       | int           | NO   | MUL | null    |                | 用户id                    |
| merchant\_id        | int           | NO   | MUL | null    |                | 商家id                    |
| receiver\_address   | varchar\(100\)| YES  |     | null    |                | 收货地址                  |
| logistics\_information | varchar\(100\)| YES  |     | null    |                | 物流信息                  |
| is\_take\_delivery  | tinyint\(1\)  | YES  |     | 0       |                | 用户是否确认收货          |
| is\_refund          | tinyint\(1\)  | YES  |     | 0       |                | 用户是否已申请退款        |
| refund\_reason      | varchar\(100\)| YES  |     | null    |                | 退款理由                  |
| is\_refund\_allowed | tinyint\(1\)  | YES  |     | 0       |                | 商家是否允许退款          |

---

##### products;
| Field              | Type          | Null | Key | Default | Extra          | describe                 |
| :----------------- | :------------ | :--- | :-- | :------ | :------------- | :----------------------- |
| goods\_id          | int           | NO   | PRI | null    | auto\_increment | 商品id                   |
| title              | varchar\(255\)| NO   |     | null    |                | 商品标题                 |
| img\_big\_logo     | varchar\(255\)| NO   |     | null    |                | 商品大图路径             |
| img\_small\_logo   | varchar\(255\)| NO   |     | null    |                | 商品小图路径             |
| price              | decimal\(10,2\)| NO  |     | null    |                | 商品价格                 |
| current\_price     | decimal\(10,2\)| NO  |     | null    |                | 折后的价格               |
| goods\_number      | int           | NO   |     | null    |                | 商品库存数量             |
| goods\_introduce   | text          | NO   |     | null    |                | 商品详情html文本         |
| category           | varchar\(100\)| NO   |     | null    |                | 商品分类                 |
| merchant\_id       | int           | YES  | MUL | 1       |                | 商家id                   |
| comment\_id        | int           | YES  |     | 1       |                | 评论id                   |

---

##### purchasers;
| Field              | Type          | Null | Key | Default | Extra          | describe               |
| :----------------- | :------------ | :--- | :-- | :------ | :------------- | :--------------------- |
| purchaser\_id      | int           | NO   | PRI | null    | auto\_increment | 用户id                 |
| password           | varchar\(20\) | NO   |     | null    |                | 登录密码               |
| email              | varchar\(20\) | NO   |     | null    |                | 邮箱                   |
| created\_time      | datetime      | NO   |     | null    |                | 注册时间               |
| profile\_photo     | varchar\(100\)| YES  |     | null    |                | 头像链接(图片路径)     |
| nickname           | varchar\(20\) | YES  |     | null    |                | 昵称                   |
| receiver\_address  | varchar\(100\)| YES  |     | null    |                | 收货地址               |
| shopping\_trolley  | varchar\(100\)| YES  |     | null    |                | 购物车内容(商品id)     |
| token              | varchar\(100\)| YES  |     | null    |                | token                  |

---