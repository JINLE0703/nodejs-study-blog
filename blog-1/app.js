const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { setRedis, getRedis } = require('./src/db/redis');
const { access } = require('./src/utils/log');

// session 数据
// const SESSION_DATA = {};

// 处理 postdata
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}

// 获取 cookie 过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

const serverHandle = (req, res) => {
    // 记录访问日志
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);

    // 设置返回 JSON
    res.setHeader('Content-type', 'application/json');

    // 获取 path
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 解析 cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2
    cookieStr.split(';').forEach(item => {
        if (!item) { return; }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    // 解析 session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {};
    //     }
    // } else {
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`;
    //     SESSION_DATA[userId] = {};
    // }
    // req.session = SESSION_DATA[userId];

    // 解析 session （redis）
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session
        setRedis(userId, {});
    }
    req.sessionId = userId;
    // 获取 session
    getRedis(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session
            setRedis(req.sessionId, {});
            req.session = {};
        } else {
            req.session = sessionData;
        }


        // 异步获取 postdata
        return getPostData(req);
    })
        .then(postData => {
            req.body = postData;

            // 处理 blog 路由
            const blogResult = handleBlogRouter(req, res);
            if (blogResult) {
                blogResult.then(blogData => {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    res.end(
                        JSON.stringify(blogData)
                    )
                })
                return;
            }


            // 处理 user 路由
            const userRes = handleUserRouter(req, res);
            if (userRes) {
                userRes.then(userData => {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    res.end(
                        JSON.stringify(userData)
                    )
                })
                return;
            }

            // 未命中路由，返回 404
            res.writeHead(404, { "content-type": "text/plain" });
            res.write("404 Not Found");
            res.end();
        })
}

module.exports = serverHandle

// process.env.NODE_ENV