var express = require('express');
var router = express.Router();
var adminModle = require('../../modles/admin/admin.modle');
var split = require('string-split');

router.get('/:id/ctBaiViet', (req, res) => {
    var isActive = "ctbv";
    var id = req.params.id;
    Promise.all([
        adminModle.getCatagory(),
        adminModle.getPostByPostId(id),
        // thiếu lấy các tag thuộc post đó.
        adminModle.getAllTagByPostID(id),
        ])
    .then(([rowsCat, rowsPos, rowsTag])=>{
        console.log(rowsTag);
        res.render('admin/ctBaiViet', { "isActive": isActive, "Cat": rowsCat, "post": rowsPos[0], "Tag": rowsTag});
    })
    .catch();
})


router.get('/newBaiViet', (req,res)=>{
    var isac = "nbv"
    adminModle.getCatagory()
    .then(rows=>{
        res.render('admin/newBaiViet',{"isActive": isac, "Cat": rows});
    })
    .catch();
})

router.get('/editor-info', (req, res) => {
    var isActive = "ei";
    res.render('admin/editor-info', { "isActive": isActive });
})

router.get('/profile-admin', (req, res) => {
    var isActive = "pa";
    res.render('admin/profile-admin', { "isActive": isActive });
})

router.get('/qlBaiViet', (req, res) => {
    var isActive = "qlbv";
    adminModle.allPost()
    .then(rows=>{
        res.render('admin/qlBaiViet', { "isActive": isActive, baiviet: rows });
    })
    .catch(err=>{
        console.log(err);
        res.end('error');
    });
    // res.render('admin/qlBaiViet', { "isActive": isActive });
})

router.get('/qlChuyenMuc', (req, res) => {
    adminModle.allCatagoty()
    .then(rows => {
        var isActive = "qlcm";
    res.render('admin/qlChuyenMuc', { "isActive": isActive , rows: rows });
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})
// quản lí hashtag
router.get('/qlHashTag', (req, res) => {
    var isActive = "qlht";
    Promise.all([
        adminModle.allTag(),
        // adminModle.getAllTagName()
    ]).then(([rows])=>{ 
        //console.log(rowsTag);
        var TagName = [];
        for(let i=0;i<rows.length;i++){
            TagName[i]=rows[i].TagName;
        }
        console.log(TagName);
        res.render('admin/qlHashTag', { "isActive": isActive, tag: rows, "TagName": TagName});
    }).catch();
}) 

router.get('/:id/deleteTag', (req,res)=>{
    var idTag= req.params.id;
    adminModle.deleteTag(idTag)
        .then(id => {
            res.redirect("/admin/qlHashTag");
        })
        .catch(err=>console.log(err));

})

router.get('/qlNguoiDung', (req, res) => {
    var isActive = "qlnd";
    res.render('admin/qlNguoiDung', { "isActive": isActive });
})

router.get('/security', (req, res) => {
    var isActive = "s";
    res.render('admin/security', { "isActive": isActive });
})

router.get('/user-info', (req, res) => {
    var isActive = "ui";
    res.render('admin/user-info', { "isActive": isActive });
})
router.get('/writer-info', (req, res) => {
    var isActive = "wi";
    res.render('admin/writer-info', { "isActive": isActive });
})


// router post
router.post('/qlHashTag/add', (req,res)=>{
    var tagname= req.body.tagname;
    var Arr = split(",", tagname);
    adminModle.addTag(Arr)
        .then(id=>{
            res.redirect("/admin/qlHashTag");
        })
        .catch(err => console.log(err));
})

router.post('/save/baiviet',(req,res)=>{
    delete req.body['CatID'];
    adminModle.savePost(req.body)
    .then(id=>{
        res.redirect('/admin/'+id+'/ctBaiViet');
    })
    .catch();

})

router.post('/saveClose/baiviet',(req,res)=>{
    delete req.body['CatID'];
    adminModle.savePost(req.body)
    .then(id=>{
        res.redirect('/admin/qlBaiViet');
    })
    .catch();

})

router.post('/saveNew/baiviet',(req,res)=>{
    delete req.body['CatID'];
    Promise.all([
        adminModle.savePost(req.body),
    ]).then(([id])=>{
        res.redirect('/admin/newBaiViet');
    }).catch();
    adminModle.savePost(req.body)
    .then(id=>{
        
    })
    .catch();

})

router.post('/delete/baiviet',(req,res)=>{
    adminModle.deletePost(req.body.ID)
    .then( id => {
        res.redirect('/admin/qlBaiViet');
    })
    .catch();
})

router.post('/deleteTagPost',(req,res)=>{
    console.log(req.body);
    adminModle.deleteTagPost(req.body.idT,req.body.idP)
    .then(id=>{
        res.end('...');
    })
    .catch();
})

module.exports = router;