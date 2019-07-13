const db = require('../db/connection');
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const {secret} = require("../secret.js")

exports.login = (req, res) => {
  const {
    id
  } = req.body
  const pw = crypto.createHash('sha512').update(req.body.pw).digest('base64');

  db.query('select * from Users where ID = ? and PW = ?',[id,pw],(err,result) =>{
    if(err)  console.log(err);
    if(!result.length){
        res.status(403).json({success : false});
    }
    else{
        const data = {
            result
        }
        jwt.sign(
            data,
            secret, {
              expiresIn: "7d",
              issuer: "Weefleet",
              subject: "userInfo"
        })
        res.status(200).json(
            {success : true},
            {token : data},
            {user : result}
        );
    }
  })
}

exports.register = (req, res) => {
    const {
    Id,Email
  } = req.body
    const Pw = crypto.createHash('sha512').update(req.body.pw).digest('base64');
    db.query('select * from users where id = ? or email = ?',[Id,Email],(err,result) =>{
        if(err) throw err;
        if(result.length){
            res.status(403).json({success : false});
        }
        else{
            db.query('insert into users (id,email,pw) values(?,?,?)',[Id,Email,Pw]);
            res.status(200).json({success : true})
        }
    })
}
exports.rank = (req,res) => {
    const{
        Id
    } = req.decoded
    user = [];
    db.query('select * from user order by score desc',(err,result)=>{
        if(err) throw err;
        sum = 0;
        for(var i = 0;i<result.length;i++){
            if(result[i].ID === Id){
                user.push(result[i]);
            }
            if(i===0){
                Max = result[i].SCORE;
                MaxIndex = i;
                result[i].CNT = 1;
                sum+=result[i].SCORE;
                continue;
            }
            if(result[i].SCORE === Max){
                result[i].CNT = result[MaxIndex].CNT;
            }
            if(result[i].SCORE !== Max){
                Max = result[i].SCORE;
                MaxIndex = i;
                result[i].CNT = i + 1;
            }
            sum+=result[i].SCORE;
        }
        res.render('rank.ejs',{
            user : user,
            data : result,
            sum : sum
        })
    })
}