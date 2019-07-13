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
                {cnt : result.Concert, name : "Concert"},
                {cnt : result.Drama, name : "Drama"},
                {cnt : result.Opera, name : "Opera"},
                {cnt : result.Dance, name : "Dance"},
                {cnt : result.Musical, name : "Musical"},
                {cnt : result.Sother, name : "Sother"}
            ];
            goodies = [
                {cnt : result.KeyRing, name : "KeyRing"},
                {cnt : result.PhoneCase, name : "PhoneCase"},
                {cnt : result.PhoteCard, name : "PhotoCard"},
                {cnt : result.Charact, name : "Charact"},
                {cnt : result.Gother, name : "Gother"}
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
                db.query("select * from goodies where scategorize = ? and gcategorize = ? order by desc",[ShowName[i],GoodName[j]],(err,result) =>{
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