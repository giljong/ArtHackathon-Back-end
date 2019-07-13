const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/',(req,res) => {
    db.query('select * from goodies order by views desc',(err,result) =>{
        if(err) console.log(err);
        res.json(result);
    })
}).get('/detail',(req,res) => {
    const id = req.query.id;
    db.query('select * from show where id = ?',id,(err,result) => {
        if(err) console.log(err);
        db.query('update recommend set ' + result.sc + '=' + result.sc + '+1' + result.gc + ' = ' + result.gc + ' +1 where user = ?',req.session.user);
        db.query('update goddies set views = views+1 where id = ?',id);
        res.json(result)
    })
})

module.exports = router;