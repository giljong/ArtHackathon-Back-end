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
    if(err)  console.log(err, 66666);
    if(!result.length){
        res.status(403).json({success : false});
    }
    else{
        const data = {...result[0]}
        const token = jwt.sign(
            data,
            secret, {
              expiresIn: "7d",
              issuer: "Weefleet",
              subject: "userInfo"
        })
        res.status(200).json(
            {
                success : true,
                token,
                user: data
            }
        );
    }
  })
}

exports.register = (req, res) => {
    const {
    id,email
  } = req.body
    console.log(req.body);
    const Pw = crypto.createHash('sha512').update(req.body.pw).digest('base64');
    db.query('select * from users where id = ? or email = ?',[id,email],(err,result) =>{
        if(err) throw err;
        if(result.length){
            res.status(403).json({success : false});
        }
        else{
            db.query('insert into users (id,email,pw) values(?,?,?)',[id,email,Pw]);
            res.status(200).json({success : true})
        }
    })
}
exports.rank = (req,res) => {
    const {
        ID
    } = req.decoded
    let user = null;
    console.log(req.decoded.result)
    db.query('select * from users order by score desc',(err,result)=>{
        if(err) throw err;
        let sum = 0;

        const user = result.find(r => r.ID === ID)

        for(var i = 0;i<result.length;i++){
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

        const data = {
        data : result,
        user : user,
        sum : sum}
        res.json(data);
    })
}