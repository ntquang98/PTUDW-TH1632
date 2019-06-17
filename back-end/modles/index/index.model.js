var db = require('../../utils/db');

module.exports = {
    allCat: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    },

    searchTag: entity =>{
        return db.load(`select t.TagName from ${entity.table} as t where MATCH(TagName) AGAINST ('${entity.value}')`);
    },
    topThreeWeek: () => {
        return db.load(`SELECT * FROM post 
                        WHERE IsDelete IS NULL 
                        AND PostStatus = 1 
                        ORDER BY Viewed AND ABS( DATEDIFF( ReleaseDay, NOW() ) ) DESC
                        LIMIT 3`);
    },
    topMostTen: () => {
        return db.load(`SELECT * FROM post 
                        WHERE IsDelete IS NULL 
                        AND PostStatus = 1 
                        ORDER BY Viewed DESC
                        LIMIT 10`);
    },
    topNewTen: () => {
        return db.load(`SELECT * 
                        FROM post 
                        WHERE IsDelete IS NULL
                        AND PostStatus = 1
                        ORDER BY ABS( DATEDIFF( ReleaseDay, NOW() ) ) DESC
                        LIMIT 10 ;`);
    },
    topTenCate: () => {

    }
};