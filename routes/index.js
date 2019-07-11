const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/',(req,res) => {
    ShowArr;
    GoodiesArr;
    if(req.session.user === undefined){
        db.query('select * from show union select * from goodies',(err,result) => {
            if(err) console.log(err);
            for(var i = 0;i<result.length;i++){
                ShowArr.push(result[i].Show);
                GoodiesArr.push(result[i].goodies);
            }
        })
    }
    else{
        db.query('select * from recommend where user = ?',(err,result) => {
            if (err) console.log(err);
            let ShowName = [];
            let GoodName=[];
            show = [
                {cnt : /*result.Concert*/1, name : "Concert"},
                {cnt : /*result.Drama*/2, name : "Drama"},
                {cnt : /*result.Opera*/3, name : "Opera"},
                {cnt : /*result.Dance*/4, name : "Dance"},
                {cnt : /*result.Musical*/5, name : "Musical"},
                {cnt : /*result.Sother*/6, name : "Sother"}
            ];
            goodies = [
                {cnt : /*result.KeyRing*/4, name : "KeyRing"},
                {cnt : /*result.PhoneCase*/3, name : "PhoneCase"},
                {cnt : /*result.PhoteCard*/2, name : "PhotoCard"},
                {cnt : /*result.Gother*/1, name : "Gother"}
            ];
            show.sort((a, b) => { 
                return b["cnt"] - a["cnt"];
            });
            goodies.sort((a, b) => { 
                return b["cnt"] - a["cnt"];
            });
            for(var i = 0;i<show.length;i++){
                ShowName.push(show[i].name);
            }
            for(var i = 0;i<goodies.length;i++){
                GoodName.push(goodies[i].name);
            }
        })
        for(var i = 0;i<ShowName.length;i++){
            db.query("select * from show where categorize = ?",ShowName[i],(err,result) => {
                if(err) console.log(err);
                ShowArr.push(result);
            })
            for(var j = 0;j<GoodName.length;j++){
                db.query("select * from goodies where scategorize = ? and gcategorize = ?",[ShowName[i],GoodName[j]],(err,result) =>{
                    if(err) console.log(err)
                    GoodiesArr.push(result);
                })
            }
        }
    }
    res.render('index.ejs',{
        Show : ShowArr,
        Goodies : GoodiesArr
    })
})

module.exports = router;