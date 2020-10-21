const router = require('koa-router')()
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

router.prefix('/api/blog')

// 博客列表
router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || '';
    let keyword = ctx.query.keyword || '';

    if (ctx.query.isadmin) {
        // 管理员界面
        // 登陆验证
        if (ctx.session.username == null) {
            // 未登录
            ctx.body = new ErrorModel('未登录');
            return;
        }
        // 强制查询自己的博客
        author = ctx.session.username;
    }
    const ListData = await getList(author, keyword);
    ctx.body = new SuccessModel(ListData);
})

// 博客详情
router.get('/detail', async (ctx, next) => {
    const DetailData = await getDetail(ctx.query.id);
    ctx.body = new SuccessModel(DetailData);
});

// 新建博客
router.post('/new', loginCheck, async (ctx, next) => {
    const body = ctx.request.body;
    body.author = ctx.session.username;
    const data = await newBlog(body);
    ctx.body = new SuccessModel(data);
})

// 更新博客
router.post('/update', loginCheck, async (ctx, next) => {
    const val = await updateBlog(ctx.query.id, ctx.request.body);
    if (val) {
        ctx.body = new SuccessModel();
    } else {
        ctx.body = new ErrorModel('更新博客失败');
    }
})

// 删除博客
router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username;
    const val = await delBlog(ctx.query.id, author);
    if (val) {
        ctx.body = new SuccessModel();
    } else {
        ctx.body = new ErrorModel('删除博客失败');
    }
})

module.exports = router
