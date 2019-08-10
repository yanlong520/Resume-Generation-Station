var express = require('express')
var app = express()
app.listen(3003)
var path = require('path')
var ejs = require('ejs')
var bodyParser = require('body-parser')
const urlencodeParser = bodyParser.urlencoded({ extended: false })
const moment = require('moment')
var formidable = require('formidable')
const cookieParser = require('cookie-parser')
const CookieControl = require('./tools/cookies')
const myCookie = new CookieControl()



var MongoControl = require('./tools/databasecontrol').MongoControl
var information = new MongoControl('resume', 'information')
var users = new MongoControl('resume', 'users')

app.use(cookieParser())
app.use(express.static('./static', { index: false }))

var renderResume = function (res) {
    information.find({}, (err, result) => {
        if (err) {
            res.send(500).send({ 状态: 'information数据库插入数据出错' })
        }
        var data = result[result.length - 1]
        ejs.renderFile('./ejs-tpl/resume2.ejs', { data: data }, function (err, html) {
            if (err) {
                console.log(err)
                return
            }
            res.send(html)
        })
    })
}
//生成两个数据库连接匹配fid
var fid1 = function () {
    var fid1 = ''
    var str = '1234567890'
    for (var i = 0; i < 8; i++) {
        fid1 += str[parseInt(Math.random() * str.length)]
    }
    return fid1
}



app.get('/', function (req, res) {
    res.sendFile(
        path.resolve('./static/html/index.html')
    )
})
//登录请求
app.get('/login', function (req, res) {
    res.sendFile(
        path.resolve('./static/html/login.html')
    )
})
//注册请求
app.get('/register', function (req, res) {
    res.sendFile(
        path.resolve('./static/html/register.html')
    )
})
//填写信息请求
app.get('/getinformation', function (req, res) {
    if (myCookie.checkToken(req.cookies.token)) {
        res.sendFile(
            path.resolve('./static/html/information.html')
        )
    } else {
        res.redirect('/login')
    }
})
//登录信息核对和cookie
app.post('/login', urlencodeParser, function (req, res) {
    var { username, password } = req.body
    users.find({ username0: username, password0: password }, (error, result) => {
        if (error) {
            res.send(500).send({ 状态: '数据库搜索出错' })
        }
        if (result.length > 0) {
            res.cookie('token', myCookie.geToken())
            res.redirect('/')
        } else {
            return res.send("<div style = ' margin : 0 auto;'><h1>你输入的账号或密码不对哦，请<a href = '/login'>重新输入</a></h1><h1>如果没有账号就赶快注册一个账号<a href = '/register'>注册一个账号</a>吧</h1></div>")
        }
    })
})
//检测用户名是否存在
app.post('/test',urlencodeParser,function(req,res){
    var {inputData} = req.body
    users.find({username0 : inputData},function(error,result){
        if(error){
           return res.send(500).send({ 状态: '数据库搜索出错' })
        }
        if(result.length > 0){
            res.send({code:1})
        }else{
            res.send({code:0})
        }
        return
    })
})
//注册用户
app.post('/register', urlencodeParser, function (req, res) {
    console.log(req.body)
    var { username0, password0, password1 } = req.body
    if (password0 == password1) {
        var fid = fid1()
        users.insert(
            {
                date: moment().format('YYYY-MM-DD HH-mm-ss'),
                username0: username0,
                password0: password0,
                fid: fid
            }, (err, result) => {
                if (err) {
                    res.send(500).send({ 状态: '用户信息存储出错' })
                }
                res.redirect('/login')
            }
        )

    } else {
        return res.send("<div style = ' margin : 0 auto;'><h1>你两次输入的密码不一致哦，请<a href = '/register'>重新输入密码</a>吧</h1></div>")
    }
})
//用户简历信息采集
app.post('/sendNewData', urlencodeParser, function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './static/img';
    form.parse(req, function (error, fields, files) {
        var path1 = files.file.path
        var pathName = path.parse(path1).name

        var { myname, quarters, birthday, sex, place, telephone, english, school,
            profession, education, worktime, hobby, valuable } = fields
        information.insert({
            date: moment().format('YYYY-MM-DD HH-mm-ss'),
            path: pathName,
            myname: myname,
            quarters: quarters,
            birthday: birthday,
            sex: sex,
            place: place,
            telephone: telephone,
            english: english,
            school: school,
            profession: profession,
            education: education,
            worktime: worktime,
            hobby: hobby,
            valuable: valuable
        }, (err, result) => {
            if (err) {
                res.send(500).send({ 状态: 'information数据库插入数据出错' })
            }
            res.redirect('/render')
        })
    })


})
//渲染界面
app.get('/render', function (req, res) {
    if (myCookie.checkToken(req.cookies.token)) {
        renderResume(res)
    } else {
        res.redirect('/login')
    }
})
