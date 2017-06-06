const nodeExcel = require('excel-export');
const UserModel = require('../models/user.js');

exports.excel = function (req, res) {
    let way = req.params.way;

    /*查询条件optFind*/
    let optFind={
            level: 0
        };
    if(way!=='all'){
        optFind.way=way;
    }
    if (req.query.start || req.query.end) {
        optFind.createAt={};
        if(req.query.start){
            optFind.createAt.$gte=new Date(req.query.start);
        }
        if(req.query.end){
            optFind.createAt.$lt=new Date(req.query.end);
        }
    }
    /*查询条件optFind*/


    let conf = {};
    conf.name = way;
    conf.cols = [
        {caption: '渠道', type: 'string'},
        {caption: '名称', type: 'string'},
        {caption: '手机', type: 'string'},
        {caption: '留言内容', type: 'string'},
        {caption: '创建时间', type: 'string'},
        {caption: '最近聊天时间', type: 'string'}

    ];
    conf.rows = [];
    let usersPro = new Promise(function (resolve, reject) {
        UserModel
            .find(optFind)
            .populate('way','name')
            .exec(function (err, users) {
                if (err) {
                    reject(err)
                }
                resolve(users)
            })
    });
    usersPro
        .then(function (users) {
            users.forEach(function (user) {
                let arr = [];
                arr.push(user.way.name);
                arr.push(user.nickName);
                arr.push(user.phone || '');
                arr.push(user.leaveMes || '');
                arr.push(user.createAt);
                arr.push(user.updateAt);
                conf.rows.push(arr);
            });
            let result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + way + ".xlsx");
            res.end(result, 'binary');
        })
        .catch(function (err) {
            console.log(err)
        });
};
