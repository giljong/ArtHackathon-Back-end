const express = require('express');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const db = require('../db/connection');
const crypto = require('crypto');
const router = express.Router();

router.post('/',(req,res) => {
    const Id = req.body.id;
    const Email = req.body.email;
    const Addr = req.body.Addr;
    const Phone = req.body.Phone;
    const Ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    const Pw = crypto.createHash('sha512').update(req.body.pw).digest('base64');
    if(Pw === ''||Email === ''||ID === ''||Phone === ''||Addr === '')
        res.send("<script type='text/javascript'>alert('입력되지 않은 값이 있어요^( '-' )^');window.location.href='/register';</script>");
    else if(pw.length<8||pw.length>20)
        res.send('<script type="text/javascript">alert("패스워드의 길이가 맞아요(。・_・。)");window.location.href="/register";</script>');
    else if(pw.indexOf(' ') !== -1){
        res.send('<script type="text/javascript">alert("비밀번호에는 공백이 들어갈 수 없어요˚ᆺ˚");window.location.href="/register";</script>');
    }
    else{
        db.query('select * from Users where EMAIL = ? or ID = ?', Email,ID, (err, result) => {
			if(err) console.error(err);
			if(!(result.length===0))
                res.send('<script type="text/javascript">alert("이메일 또는 아이디가 중복돼요!(•⊙ω⊙•)");window.location.href="/register";</script>');
            else{
                const authkey = randomstring.generate();
                db.query('insert into Users (ID,PW,EMAIL,AUTHKEY,ADDR,PHONE) values (?,?,?,?,?,?)',[Id,Pw,Email,authkey,Addr,Phone]);
                db.query('insert into recommend (user) values (?)',Id);
                res.send('<script type="text/javascript">alert("회원가입 성공!ヾ|๑╹◡╹๑|ﾉ");window.location.href="/login";</script>');
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'minjong5054@gmail.com', 
                        pass: 'pj83918332'
                    }
                });
                const mailOptions = {
                    from: '',
                    to: Email ,
                    subject: '',
                    text: '가입완료를 위해 <'+authkey+'> 를 입력해주세요'
                };
                transporter.sendMail(mailOptions, (err, response) => {
                    if(err)
                        console.log(err);  
                    else
                        console.log(response,time + ' - '+ Ip ); 
                })   
            }
        })
    }
}).get('/',(req,res) => {
    res.render('register.ejs');
})

module.exports = router;
