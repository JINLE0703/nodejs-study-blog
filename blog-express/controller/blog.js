const xss = require('xss');
const { exec, escape } = require('../db/mysql');

// 获取博客列表
const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        author = escape(author);
        sql += `and author=${author} `;
    }
    if (keyword) {
        keyword = escape(keyword);
        sql += `and title like %${keyword}% `;
    }
    sql += `order by createtime desc;`;

    return exec(sql);
}

// 获取博客详情
const getDetail = (id) => {
    id = escape(id);
    const sql = `select * from blogs where id=${id};`;
    // 因只有一项所返回数组第一项
    return exec(sql).then(rows => {
        return rows[0];
    })
}

// 新增一篇博客
const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象 包含 title content author
    const title = escape(xss(blogData.title));
    const content = escape(xss(blogData.content));
    const author = escape(blogData.author);
    const createtime = Date.now();

    const sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, ${createtime}, ${author})`;

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
    // blogData 是一个博客对象
    const title = escape(xss(blogData.title));
    const content = escape(xss(blogData.content));
    id = escape(id);

    const sql = `update blogs set title=${title}, content=${content} where id=${id};`;

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

// 删除博客
const delBlog = (id, author) => {
    id = escape(id);
    author = escape(author);
    const sql = `delete from blogs where id=${id} and author=${author};`;
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    })

}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}