**用于学习 nodejs**

## 需求

首页，作者主页，博客详情页

登录页

管理中心，新建页，编辑页

## 接口

#### 获取博客列表

```
接口：/api/blog/list

方法：get

url 参数：author，keyword

备注：参数为空，则不进行过滤
```

#### 获取一篇博客内容

```
接口：/api/blog/detail

方法：get

url 参数：id

备注：
```

#### 新增一篇博客

```
接口：/api/blog/new

方法：post

url 参数：

备注：post 中有新增信息
```

#### 更新一篇博客

```
接口：/api/blog/update

方法：post

url 参数：id

备注：postData 中有更新内容
```

#### 删除一篇博客

```
接口：/api/blog/del

方法：post

url 参数：id

备注：
```

#### 登录

```
接口：/api/user/login

方法：post

url 参数：

备注：postData 中有用户名和密码
```

### 登录

登陆校验 -- cookie -- userid

登陆信息存储 -- session -- redis

## 安全

#### sql 注入 

-- 输入一个 sql 片段，最终拼接成一段攻击代码

预防 -- 使用 mysql 的 excape 函数处理输入内容

#### xss 攻击

-- 在页面展示内容中参杂 js 代码，以获取页面信息

预防 -- 转换成 js 的特殊字符

#### 密码加密

## 总结

#### 功能模块

处理 http 接口、连接数据库（mysql）、实现登录（cookie、session、redis）、安全（sql 注入、xss、加密）、日志（stream）

