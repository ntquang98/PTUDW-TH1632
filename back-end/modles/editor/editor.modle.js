var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostXetDuyet: (userID)=>{
        return db.load(`select * from post as p where p.editorID = '${userID}' and p.IsDelete is null and p.PostStatus = 1`)
    },
    allPostTuChoi: (userID)=>{
        return db.load(`select * from post as p where p.editorID = '${userID}' and p.IsDelete is null and p.PostStatus = -1`)
    },

    allPostBycategory: (CatID, userID)=>{
        return db.load(`select p.*, w.WriterName
        from post as p, category as c, catpost as cp, editorcat as ec, writer as w, writerpost as wp
        where p.ID = wp.PostID and w.UserID = wp.WriterID and ec.UserID='${userID}' and p.PostStatus is null and ec.ManagedCatID=cp.CatID and cp.PostID=p.ID and c.ID=ec.ManagedCatID AND c.SuperCatID = ${CatID}`);
    },

    allcategory: (id)=>{
        var sql = `select cat.ID, cat.CatName from category as cat,
        (select c.SuperCatID from editorcat as ec, category as c where ec.UserID = '${id}' and ec.ManagedCatID = c.ID group by c.SuperCatID) as cate 
        where cat.ID= cate.SuperCatID`
        return db.load(sql);
    },

    getContentPost: ID=>{
        return db.load(`select p.Content from post as p where p.ID = ${ID}`);
    },

    getTagIDByName:(entity)=>{
        var idT = entity.idT; //  mang ten tag

        var sqlTag = `select t.ID from tag as t where `;
        for (let index = 0; index < idT.length-1; index++) {
            sqlTag+=`t.TagName = '${idT[index]}' or `
        }
        sqlTag += `t.TagName = '${idT[idT.length-1]}';`
        return db.load(sqlTag);
    },

    addTagPost: entity=>{
        var idP = entity.idP;
        var idT = entity.idT; //  mang ten tag

        var sql = `insert into tagpost (TagID, PostID) values `;
        for(var i=0;i<idT.length-1;i++){
            sql+=`('${idT[i].ID}', '${idP}'), `
        }
        sql+=`('${idT[idT.length-1].ID}', '${idP}')`;

        return db.load(sql);
    },

    getIDcategoryByPostID: Postid=>{
        return db.load(`select c.SuperCatID from catpost as cp, category as c where cp.PostID = ${Postid} and c.ID = cp.CatID`);
    },

    xetDuyetPost: entity=>{
        return db.update('post','ID', entity);
    },

    allEditor: ()=>{
        return db.load(`select * from editorcat e, userprimary u where e.UserID = u.ID and u.IsDelete is Null;`);
    },
    
    addNewEditor: entity =>{
        return db.add("editorcat", entity);
    },

    single: id => {
        return db.load(`select * from editorcat e, userprimary u where e.UserID = ${id} and e.UserID = u.ID and u.IsDelete is Null;`);
    },

    pageByEditor: (limit, offset) => {
        return db.load(`select b.ID, b.FullName, b.Email, b.Photo, b.DoB, count(a.ManagedCatID) as noc from (select * from editorcat ) as a RIGHT JOIN (select * from userprimary where role = 'editor' and IsDelete is null) as b on a.UserID = b.ID group by b.ID limit ${limit} offset ${offset};`);
    },

    countByEditor: () => {
        return db.load(`SELECT COUNT(*) AS total FROM (select * from userprimary u inner join (select distinct(UserID), count(ManagedCatID) as noc from editorcat group by UserID )as e on e.UserID = u.ID AND u.IsDelete is Null) as abc;`);
    },

    delete: id => {
        return db.delete('userprimary', 'ID', id);
    },

    updateEditorByAdmin: entity => {
        return db.update('editorcat', 'UserID', entity);
    },
    someEditor: (limit)=>{
        return db.load(`select b.ID, b.FullName, b.Email, b.Photo, b.DoB, count(a.ManagedCatID) as noc from (select * from editorcat ) as a RIGHT JOIN (select * from userprimary where role = 'editor' and IsDelete is null) as b on a.UserID = b.ID group by b.ID limit ${limit};`)
    },
    updateEditorProfile: (entity)=>{
        return  db.update('userprimary', 'ID', entity);
    },
    singleEditor: (id)=>{
        return db.load(`select * from userprimary where ID = '${id}';`);
    },
    catOfEditor: (id)=>{
        return db.load(`select ManagedCatID from editorcat where UserID = '${id}';`)
    },
    updateCatOfEditor: (id, entities)=>{
        db.load(`delete from editorcat where UserID = '${id}'`);
        var sql=`insert into editorcat( UserID , ManagedCatID) values `;
        for(var i=0; i < entities.length-1; i++){
            sql+=`('${entities[i].UserID}' , ${entities[i].ManagedCatID}), `
        }
        sql+=`('${entities[entities.length-1].UserID}' , ${entities[entities.length-1].ManagedCatID})`;
        console.log(sql);
        return db.load(sql);
    }
};