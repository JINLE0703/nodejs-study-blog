var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 登录
router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
        if (data.username) {

            // 设置 session
            req.session.username = data.username;
            req.session.realname = data.realname;

            res.json(new SuccessModel());
        } else {
            res.json(new ErrorModel('登陆失败'));
        }
    })
});

// router.get('/login-test', function (req, res, next) {
//     if (req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录'
//         })
//     } else {
//         res.json({
//             errno: -1,
//             msg: '未登录'
//         })
//     }
// })



module.exports = router;