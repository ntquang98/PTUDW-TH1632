var db = require('../utils/db')

var nametable = "category";

module.exports = {
    all: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    },
    allOnlyCat: ()=>{
        return db.load('select * from category where IsDelete IS NULL;')
    },
    single: id => {
    return db.load('select * from category where ID = ${id} AND IsDelete IS NULL;');
    },
//NHớ đổi tên table là categories lại :)
    add: entity => {
    return db.add('category', entity);
    },

    update: entity => {
    return db.update('category', 'ID', entity);
    },

    delete: id => {
    db.load(`update category set IsDelete = 1 where SuperCatID = ${id}`);
    return db.delete('category', 'ID', id);
    }
};