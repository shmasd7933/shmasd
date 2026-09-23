const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const template = require('./template');
const sanitizeHtml = require('sanitize-html');
const mysql      = require('mysql2');
const db = mysql.createConnection({
  host     : 'mysql-3f8baa52-shmasdtu-fcd4.k.aivencloud.com',
  user     : 'avnadmin',
  password : 'AVNS_hLpJ9jQiaVqnO7NddZB',
  database : 'sunrin',
  port : 23316,
  ssl : {rejectUnauthorized : false}
});
db.connect();

app.use(express.urlencoded({ extended: true }));

function menu(id, callback) {
    db.query('SELECT id, name from teacher', function (err, results) {
        if (err) throw err;
        callback(template.menu(results, id));
    });
}

app.get('/', (req, res) => {
    menu(null, function(menuHtml){
        res.send(template.html(menuHtml, `
            <h2>메인페이지</h2>
            <p>선린인터넷고등학교 교사 정보 사이트 입니다.</p>
        `));    
    })    
});

app.get('/create', (req, res) => {
    db.query('SELECT * FROM office', function(err, offices){
        if (err) throw err;
        menu(null, function(menuHtml){
            res.send(template.html(menuHtml,template.create(offices)));
        });    
    });    
});

app.post('/create', (req, res) => {
    const name = sanitizeHtml(req.body.name);
    const subject = sanitizeHtml(req.body.subject);
    const className = req.body.class === '' ? null : sanitizeHtml(req.body.class);
    const office_no = req.body.office_no === '' ? null : Number(req.body.office_no);
    db.query(
        'insert into teacher (name, subject, created, class, office_no) values (?, ?, now(), ?, ?)',
        [name, subject, className, office_no], function (err, results) {
        if (err) throw err;
        res.redirect(`/${results.insertId}`); // mysql2에서 AUTO_INCREMENT로 자동생성 값
    });
});

app.get('/update/:id', (req, res) => {
    const id = Number(req.params.id);
    db.query('select * from teacher where id=?',[id], function (err, results) {
        if (err) throw err;
        if (results.length === 0) { return res.status(404).send('404 Not Found'); }
        const teacher = results[0];
        db.query('SELECT * FROM office', function(err, offices){
            if (err) throw err;
            menu(null, function(menuHtml){
                res.send(template.html(menuHtml,template.update(teacher, offices)))                
            });    
        });        
    });
});

app.post('/update', (req, res) => {
    const id = Number(req.body.id);
    const name = sanitizeHtml(req.body.name);
    const subject = sanitizeHtml(req.body.subject);
    const className = req.body.class === '' ? null : sanitizeHtml(req.body.class);
    const officeNo = req.body.office_no === '' ? null : Number(req.body.office_no);
    db.query(
        'update teacher set name=?, subject=?, class=?, office_no=? where id =?',
        [name, subject, className, officeNo, id], function (err, results) {
        if (err) throw err;
        res.redirect(`/${id}`);
    });
});

app.get('/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    db.query('select * from teacher where id=?',[id], function (err, results) {
        if (err) throw err;
        if (results.length === 0) { return res.status(404).send('404 Not Found'); }
        const teacher = results[0];        
        menu(id, function(menuHtml){
            res.send(template.html(menuHtml, template.delete(teacher)))
        });
    });
});

app.post('/delete', (req, res) => {
    const id = Number(req.body.id);
    db.query(
        'delete from teacher where id =?',
        [id], function (err, results) {
        if (err) throw err;
        res.redirect(`/`);
    });
});


app.get('/office', (req,res) => {    
    db.query(`SELECT o.id, o.building, o.room, count(t.id) AS teacher_count
        from office o left join teacher t on o.id=t.office_no
        group by o.id, o.building, o.room`, function(err, offices){
        if (err) throw err;        
        menu(null, function(menuHtml){
            let list = `<h2>교무실 목록</h2><ul>`;
            for (let i=0; i<offices.length; i++){
                list += `<li><a href='/office/${offices[i].id}'>
                    ${offices[i].building} ${offices[i].room} (${offices[i].teacher_count}명)
                </a>                
                </li>                
                `;
            }
            list += '</ul>';
            res.send(template.html(menuHtml, list));
        });
    });
});

app.get('/office/:id', (req,res) => {
    const id = Number(req.params.id);    
    db.query(`
        select t.id, t.name, t.subject, o.building, o.room from teacher t
        right join office o on t.office_no = o.id where o.id = ?
        `, [id], function(err, results){
        if (err) throw err;
        
        if (results.length === 0){
            return res.status(404).send('404 Not Found');
        }
        menu(null, function(menuHtml){
            let list = `<h2>${results[0].building} ${results[0].room}</h2>
            <ul>`;
            if (results[0].name === null){
                list += '<li>소속 교사 없음</li>';
            }else{
            for (let i=0; i<results.length; i++){
                list += `<li><a href='/${results[i].id}'>${results[i].name}</a> - ${results[i].subject}</li>
                `;
            }}
            list += '</ul>';
            res.send(template.html(menuHtml, list));
        });
    });
});

app.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { return res.status(404).send('404 Not Found'); } 
    db.query(`SELECT t.*, o.building, o.room from teacher t 
        left join office o on t.office_no=o.id WHERE t.id = ?`, [id], function (err, results) {
        if (err) throw err;
        if (results.length === 0) { return res.status(404).send('404 Not Found'); }
        const teacher = results[0];
        menu(id, function(menuHtml){
            res.send(
                template.html(menuHtml, template.read(teacher))
            );
        })        
    });    
});

app.listen(port, () => {
    console.log(`server running on PORT ${port}`);
});