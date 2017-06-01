const WayModel = require('../models/way');
const pageSize = 20;

exports.wayNew = function (req, res) {
    res.render('wayNew', {
        title: '生成新的渠道'
    })
};

exports.new = function (req, res) {
    let _way = req.body.way;
    let way = new WayModel(_way);
    way.save(function (err, way) {
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/way/waydetail/' + way._id)
    })
};

exports.wayUpdate = function (req, res) {
    let _id = req.params.id;
    WayModel
        .findOne({_id: _id})
        .exec(function (err, way) {
            if (err) {
                console.log(err)
            }
            res.render('wayUpdate', {
                title: '修改' + way.name + '的信息',
                way
            })
        })
};

exports.update = function (req, res) {
    let _way = req.body.way;
    let _id = _way._id;
    delete _way._id;
    WayModel.findByIdAndUpdate(_id, {$set: _way}, function (err) {
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/way/waydetail/' + _id)
    })


};

exports.wayDetail = function (req, res) {
    let _id = req.params.id;
    WayModel
        .findOne({_id: _id})
        .exec(function (err, way) {
            if (err) {
                console.log(err)
            }
            res.render('wayDetail', {
                title: way.name,
                way
            })
        })
};

exports.wayList = function (req, res) {
    let page = req.params.page;
    let user=req.session.user;
    let findOpt = {};
    if(parseInt(user.level)<10000){
        findOpt._id=user.way;
    }
    let url = req.protocol + '://' + req.get('host') + '/way/';
    let countPromise = new Promise(function (resolve, reject) {
        WayModel
            .find(findOpt)
            .count(function (err, count) {
                let pageNum;
                if (err) {
                    reject(err)
                }
                pageNum=Math.ceil(count/pageSize);
                resolve(pageNum)
            })
    });

    let waysPromise = new Promise(function (resolve, reject) {
        WayModel
            .find(findOpt)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec(function (err, ways) {
                if (err) {
                    reject(err)
                }
                resolve(ways)
            })
    });

    Promise
        .all([countPromise,waysPromise])
        .then(function([pageNum,ways]){
            res.render('wayList',{
                title:'渠道列表',
                pageNum,
                ways,
                url
            })
        })
};

exports.delete = function(req,res){
    let _id = req.query.id;
    WayModel.findByIdAndRemove(_id, function (err) {
        if (err) {
            console.log(err)
        }
        res.json({
            state: 'success'
        })
    })
};
