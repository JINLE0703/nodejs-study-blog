const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一登陆验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;    // 文章 id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || '';
        let keyword = req.query.keyword || '';

        if (req.query.isadmin) {
            // 管理员界面
            // 登陆验证
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult;
            }
            author = req.session.username;
        }

        const result = getList(author, keyword);
        return result.then(ListData => {
            return new SuccessModel(ListData);
        })
    }

    // 获取一篇博客内容
    if (method === 'GET' && req.path === '/api/blog/detail') {
        if (id) {
            const result = getDetail(id);
            return result.then(DetailData => {
                return new SuccessModel(DetailData);
            })
        }
    }

    // 新增一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {

        // 登陆验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        }

        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        // 登陆验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        }

        const result = updateBlog(id, req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel('更新博客失败');
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        // 登陆验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        }

        const author = req.session.username
        const result = delBlog(id, author);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel('删除博客失败');
            }
        })
    }
}

module.exports = handleBlogRouter;