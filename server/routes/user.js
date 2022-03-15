const express = require('express');
const router = express.Router();

const { User } = require("../models/User");


/****************************************************************************************************
 * 회원가입
 ****************************************************************************************************/
router.post('/signup', (req, res) => {
    const user = new User(req.body);

    user.save((err, user) => {
        if(err) return res.status(400).json({ signupSuccess: false });
        return res.status(200).json({ signupSuccess: true });
    })
});

/****************************************************************************************************
 * 로그인
 ****************************************************************************************************/
router.post('/signin', (req, res) => {
    // 입력한 이메일로 가입된 계정이 존재하는지 확인
   User.findOne({ 'email': req.body.email }, (err, user) => {
       if(err) return res.status(400).json({ signinSuccess: false });

       // 입력한 이메일로 가입된 계정이 존재하지 않는 경우
       if(!user) {
           return res.status(200).json({ signinSuccess: false, isExist: false });
       }

       // 계정이 존재하는 경우, 입력한 비밀번호가 일치하는지 확인
       user.comparePassword(req.body.password, (err, isMatch) => {
           if(err) return res.status(400).json({ signinSuccess: false });

           // 입력한 비밀번호가 일치하지 않는 경우
           if(!isMatch) {
               return res.status(200).json({ signinSuccess: false, isExist: true, isMatch: false });
           }

           // 로그인에 성공했을 경우, 토큰 생성
           user.generateToken((err, userInfo) => {
               if(err) return res.status(400).json({ signinSuccess: false });

               // 쿠키에 토큰 저장
               res.cookie("x_authExp", userInfo.tokenExp);
               res.cookie('x_auth', userInfo.token);
               return res.status(200).json({ signinSuccess: true, userId: userInfo._id });
           });
       });
   });
});

module.exports = router;