const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const template = require('./template');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));
const db = mysql.createPool({
    host: 'mysql-shmasd7933-shmasdtu-fcd4.i.aivencloud.com',
    port: 23320,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'scedulingsystem',
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT
    }
});

// 로그인 여부 확인
function login(req, res, next) {
    if (!req.session.user) return res.redirect('/');
    next();
}

// 사장 권한 확인
function boss(req, res, next) {
    if (!req.session.user) return res.redirect('/');
    if (req.session.user.role !== 'user') {
        return res.status(403).send('접근 권한이 없습니다.');
    }
    next();
}

// 페이지 출력
function show(res, content) {
    res.send(template.html(content));
}

// 로그인 화면
app.get('/', (req, res) => {
    show(res, template.login());
});

// 로그인 처리
app.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.execute(
            'SELECT user_id, username, role FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return show(res, template.loginFail());
        }

        const user = rows[0];

        if (!['user', 'employee'].includes(user.role)) {
            return res.status(403).send('잘못된 권한입니다.');
        }

        req.session.regenerate(err => {
            if (err) return next(err);

            req.session.user = user;
            res.redirect(user.role === 'user' ? '/user' : '/employee');
        });
    } catch (err) {
        next(err);
    }
});

// 로그아웃
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// 사장 메인
app.get('/user', boss, (req, res) => {
    show(res, template.user());
});

// 직원 메인
app.get('/employee', login, (req, res) => {
    if (req.session.user.role !== 'employee') {
        return res.redirect('/user');
    }
    show(res, template.employee());
});

// 근무표 조회: 사장과 직원 모두 가능
app.get('/schedule', login, async (req, res, next) => {
    try {
        const name = (req.query.name || '').trim();

        const [schedules] = await db.execute(
            `SELECT s.schedule_id, s.employee_id_sh, s.work_date,
                    s.start_time, s.end_time, e.name
             FROM schedules s
             JOIN employees e ON s.employee_id_sh = e.employee_id_em
             WHERE e.name LIKE ?
             ORDER BY s.work_date, s.start_time`,
            [`%${name}%`]
        );

        show(res, template.schedule(schedules, { name }));
    } catch (err) {
        next(err);
    }
});

// 근무표 관리 화면
app.get('/user/schedule', boss, async (req, res, next) => {
    try {
        const [employees] = await db.execute(
            'SELECT employee_id_em, name FROM employees ORDER BY name'
        );

        const [schedules] = await db.execute(
            `SELECT s.*, e.name
             FROM schedules s
             JOIN employees e ON s.employee_id_sh = e.employee_id_em
             ORDER BY s.work_date, s.start_time`
        );

        show(res, template.UserSchedule(employees, schedules));
    } catch (err) {
        next(err);
    }
});

// 근무표 추가
app.post('/user/schedule', boss, async (req, res, next) => {
    try {
        const { employee_id_sh, work_date, start_time, end_time } = req.body;

        await db.execute(
            `INSERT INTO schedules
             (employee_id_sh, work_date, start_time, end_time)
             VALUES (?, ?, ?, ?)`,
            [employee_id_sh, work_date, start_time, end_time]
        );

        res.redirect('/user/schedule');
    } catch (err) {
        next(err);
    }
});

// 근무표 수정
app.post('/user/schedule/update', boss, async (req, res, next) => {
    try {
        const { schedule_id, employee_id_sh, work_date, start_time, end_time } = req.body;

        await db.execute(
            `UPDATE schedules
             SET employee_id_sh = ?, work_date = ?,
                 start_time = ?, end_time = ?
             WHERE schedule_id = ?`,
            [employee_id_sh, work_date, start_time, end_time, schedule_id]
        );

        res.redirect('/user/schedule');
    } catch (err) {
        next(err);
    }
});

// 근무표 삭제
app.post('/user/schedule/delete', boss, async (req, res, next) => {
    try {
        await db.execute(
            'DELETE FROM schedules WHERE schedule_id = ?',
            [req.body.schedule_id]
        );

        res.redirect('/user/schedule');
    } catch (err) {
        next(err);
    }
});

// 직원 관리 화면 및 이름 검색
app.get('/user/employee', boss, async (req, res, next) => {
    try {
        const name = (req.query.name || '').trim();

        const [employees] = await db.execute(
            `SELECT e.*, u.username, u.role,
                    COUNT(DISTINCT s.schedule_id) AS work_count,
                    COALESCE(SUM(TIMESTAMPDIFF(
                        MINUTE, s.start_time, s.end_time
                    )) / 60, 0) AS total_hours
             FROM employees e
             JOIN users u ON e.user_id_em = u.user_id
             LEFT JOIN schedules s ON e.employee_id_em = s.employee_id_sh
             WHERE e.name LIKE ?
             GROUP BY e.employee_id_em, e.user_id_em, e.name,
                      e.gender, e.age, u.username, u.role
             ORDER BY e.employee_id_em`,
            [`%${name}%`]
        );

        show(res, template.UserEmployee(employees, name));
    } catch (err) {
        next(err);
    }
});

// 직원 추가: users에 직원 계정이 먼저 있어야 함

 app.post('/user/employee/create', boss, async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        const { username, password, name, gender, age } = req.body;

        // 필수 입력값 확인
        if (!username || !password || !name || !gender || age === '') {
            return res.status(400).send('모든 항목을 입력해 주세요.');
        }

        await connection.beginTransaction();

        // 아이디 중복 확인
        const [existingUsers] = await connection.execute(
            'SELECT user_id FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(400).send('이미 사용 중인 아이디입니다.');
        }

        // 1. users 테이블에 로그인 계정 생성
        const [userResult] = await connection.execute(
            `INSERT INTO users (username, password, role)
             VALUES (?, ?, 'employee')`,
            [username, password]
        );

        // 방금 생성한 계정의 user_id 가져오기
        const userId = userResult.insertId;

        // 2. employees 테이블에 직원 정보 생성
        await connection.execute(
            `INSERT INTO employees (user_id_em, name, gender, age)
             VALUES (?, ?, ?, ?)`,
            [userId, name, gender, Number(age)]
        );

        await connection.commit();

        res.redirect('/user/employee');
    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
});


// 직원 정보 수정
app.post('/user/employee/update', boss, async (req, res, next) => {
    try {
        const { employee_id_em, name, gender, age } = req.body;

        await db.execute(
            `UPDATE employees SET name = ?, gender = ?, age = ?
             WHERE employee_id_em = ?`,
            [name, gender, age, employee_id_em]
        );

        res.redirect('/user/employee');
    } catch (err) {
        next(err);
    }
});

// 직원 및 관련 근무표 삭제
app.post('/user/employee/delete', boss, async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            'SELECT user_id_em FROM employees WHERE employee_id_em = ?',
            [req.body.employee_id_em]
        );

        if (!rows.length) {
            await connection.rollback();
            return res.status(404).send('직원 정보가 없습니다.');
        }

        const userId = rows[0].user_id_em;

        await connection.execute(
            'DELETE FROM schedules WHERE employee_id_sh = ?',
            [req.body.employee_id_em]
        );

        await connection.execute(
            'DELETE FROM employees WHERE employee_id_em = ?',
            [req.body.employee_id_em]
        );

        await connection.execute(
            "DELETE FROM users WHERE user_id = ? AND role = 'employee'",
            [userId]
        );

        await connection.commit();
        res.redirect('/user/employee');
    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
});

// 서버 오류 처리
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('오류가 발생했습니다. 터미널을 확인해 주세요.');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버 실행 중: ${PORT}`);
});
