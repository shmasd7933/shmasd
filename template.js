
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

function dateText(value) {
    return escapeHTML(String(value ?? '').slice(0, 10));
}

function timeText(value) {
    return escapeHTML(String(value ?? '').slice(0, 5));
}

function layout(title, subtitle, active, content) {
    return `
        <div class="app-shell">
            <aside class="sidebar">
                <a class="brand" href="/user">
                    <span class="brand-icon">S</span>
                    <span>
                        <strong>Shiftly</strong>
                        <small>WORKSPACE</small>
                    </span>
                </a>

                <div class="nav-label">WORKSPACE</div>
                <nav class="nav-menu">
                    <a class="nav-link ${active === 'dashboard' ? 'active' : ''}"
                       href="/user">
                        <span class="nav-icon">⌂</span>
                        <span>대시보드</span>
                    </a>
                    <a class="nav-link ${active === 'schedule' ? 'active' : ''}"
                       href="/user/schedule">
                        <span class="nav-icon">▦</span>
                        <span>근무표 관리</span>
                    </a>
                    <a class="nav-link ${active === 'employees' ? 'active' : ''}"
                       href="/user/employee">
                        <span class="nav-icon">♙</span>
                        <span>직원 관리</span>
                    </a>
                    <a class="nav-link ${active === 'view' ? 'active' : ''}"
                       href="/schedule">
                        <span class="nav-icon">◷</span>
                        <span>근무표 조회</span>
                    </a>
                </nav>

                <div class="sidebar-bottom">
                    <div class="help-card">
                        <span class="help-icon">✦</span>
                        <strong>효율적인 근무 관리</strong>
                        <p>직원과 일정을 한곳에서 편리하게 관리하세요.</p>
                    </div>
                    <a class="nav-link logout-link" href="/">
                        <span class="nav-icon">↪</span>
                        <span>로그인 화면</span>
                    </a>
                </div>
            </aside>

            <div class="main-area">
                <header class="topbar">
                    <div class="breadcrumb">
                        <span>Workspace</span>
                        <span class="crumb-divider">/</span>
                        <strong>${escapeHTML(title)}</strong>
                    </div>
                    <div class="topbar-right">
                        <span class="status-dot"></span>
                        <span>근무 관리 시스템</span>
                        <div class="avatar">A</div>
                    </div>
                </header>

                <main class="page-content">
                    <div class="page-heading">
                        <div>
                            <div class="eyebrow">MANAGEMENT</div>
                            <h1>${escapeHTML(title)}</h1>
                            <p>${escapeHTML(subtitle)}</p>
                        </div>
                        <div class="heading-date">${new Date().toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</div>
                    </div>

                    ${content}

                    <footer class="footer">
                        <span>Shiftly Workspace</span>
                        <span>Smart scheduling, made simple.</span>
                    </footer>
                </main>
            </div>
        </div>
    `;
}

module.exports = {
    login: function() {
        return `
            <div class="login-page">
                <div class="login-decoration decoration-one"></div>
                <div class="login-decoration decoration-two"></div>

                <div class="login-brand">
                    <span class="brand-icon">S</span>
                    <span>
                        <strong>Shiftly</strong>
                        <small>WORKSPACE</small>
                    </span>
                </div>

                <section class="login-card">
                    <div class="login-symbol">✦</div>
                    <div class="eyebrow">WELCOME BACK</div>
                    <h1>다시 만나서 반가워요.</h1>
                    <p class="login-description">
                        계정에 로그인하고 근무 일정을 관리해 보세요.
                    </p>

                    <form action="/login" method="post" class="login-form">
                        <label for="username">아이디</label>
                        <input id="username" type="text" name="username"
                               placeholder="아이디를 입력하세요" required>

                        <label for="password">비밀번호</label>
                        <input id="password" type="password" name="password"
                               placeholder="비밀번호를 입력하세요" required>

                        <button class="btn btn-primary login-submit" type="submit">
                            로그인하기 <span>→</span>
                        </button>
                    </form>

                    <div class="login-note">
                        <span>●</span> 안전하고 편리한 근무 일정 관리
                    </div>
                </section>

                <p class="login-footer">SHIFTLY · WORK SMARTER EVERY DAY</p>
            </div>
        `;
    },

    loginFail: function() {
        return `
            <div class="login-page">
                <section class="login-card">
                    <div class="login-symbol error-symbol">!</div>
                    <h1>로그인할 수 없어요.</h1>
                    <p class="login-description">
                        아이디 또는 비밀번호를 다시 확인해 주세요.
                    </p>
                    <a class="btn btn-primary full-button" href="/">다시 로그인</a>
                </section>
            </div>
        `;
    },

    html: function(body) {
        return `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Shiftly | 근무 관리</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');

                    :root {
                        --navy: #172554;
                        --blue: #4f6df5;
                        --blue-dark: #3b54d9;
                        --blue-light: #eef2ff;
                        --ink: #202945;
                        --muted: #7c849b;
                        --line: #e8ebf3;
                        --surface: #ffffff;
                        --background: #f5f7fc;
                        --green: #159b72;
                        --red: #dc5265;
                        --shadow: 0 10px 35px rgba(31, 45, 86, .06);
                    }

                    * { box-sizing: border-box; }

                    body {
                        margin: 0;
                        background: var(--background);
                        color: var(--ink);
                        font-family: 'DM Sans', 'Noto Sans KR', sans-serif;
                        font-size: 14px;
                        line-height: 1.65;
                    }

                    a { color: inherit; text-decoration: none; }
                    button, input, select { font: inherit; }
                    button, a, input, select { -webkit-tap-highlight-color: transparent; }
                    button { cursor: pointer; }
                    h1, h2, h3, p { margin-top: 0; }

                    .app-shell { min-height: 100vh; }
                    .sidebar {
                        width: 250px;
                        position: fixed;
                        inset: 0 auto 0 0;
                        z-index: 5;
                        display: flex;
                        flex-direction: column;
                        padding: 28px 18px 20px;
                        background: #fff;
                        border-right: 1px solid var(--line);
                    }

                    .brand, .login-brand {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 0 8px;
                        color: var(--navy);
                    }

                    .brand-icon {
                        width: 43px;
                        height: 43px;
                        flex-shrink: 0;
                        display: grid;
                        place-items: center;
                        border-radius: 14px;
                        color: white;
                        font-size: 22px;
                        font-weight: 800;
                        background: linear-gradient(145deg, #6684ff, #4057dd);
                        box-shadow: 0 7px 16px rgba(79, 109, 245, .24);
                    }

                    .brand strong, .login-brand strong {
                        display: block;
                        font-size: 21px;
                        font-weight: 800;
                        letter-spacing: -1px;
                        line-height: 1.2;
                    }

                    .brand small, .login-brand small {
                        display: block;
                        margin-top: 4px;
                        color: #9299ad;
                        font-size: 9px;
                        font-weight: 700;
                        letter-spacing: 2px;
                    }

                    .nav-label {
                        margin: 45px 12px 13px;
                        color: #a1a7b8;
                        font-size: 10px;
                        font-weight: 800;
                        letter-spacing: 1.5px;
                    }

                    .nav-menu { display: grid; gap: 7px; }

                    .nav-link {
                        display: flex;
                        align-items: center;
                        gap: 13px;
                        min-height: 47px;
                        padding: 11px 14px;
                        border-radius: 11px;
                        color: #737d96;
                        font-weight: 600;
                        transition: background .18s, color .18s;
                    }

                    .nav-link:hover { background: #f5f6ff; color: var(--blue); }
                    .nav-link.active {
                        background: var(--blue-light);
                        color: var(--blue);
                        font-weight: 700;
                    }

                    .nav-icon {
                        width: 23px;
                        text-align: center;
                        font-size: 21px;
                        line-height: 1;
                    }

                    .sidebar-bottom { margin-top: auto; }
                    .help-card {
                        padding: 18px 16px;
                        border-radius: 15px;
                        background: linear-gradient(145deg, #f1f4ff, #f8f8ff);
                        border: 1px solid #e7eaff;
                    }

                    .help-icon {
                        display: grid;
                        place-items: center;
                        width: 31px;
                        height: 31px;
                        margin-bottom: 12px;
                        border-radius: 10px;
                        color: var(--blue);
                        background: white;
                        font-size: 18px;
                    }

                    .help-card strong { font-size: 12px; }
                    .help-card p {
                        margin: 6px 0 0;
                        color: var(--muted);
                        font-size: 11px;
                        line-height: 1.7;
                    }

                    .logout-link { margin-top: 14px; }

                    .main-area { min-height: 100vh; margin-left: 250px; }
                    .topbar {
                        height: 76px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 20px;
                        padding: 0 40px;
                        background: rgba(255,255,255,.92);
                        border-bottom: 1px solid var(--line);
                    }

                    .breadcrumb { display: flex; align-items: center; gap: 10px; color: #9aa1b4; }
                    .breadcrumb strong { color: var(--ink); font-weight: 700; }
                    .crumb-divider { color: #d0d4e0; }
                    .topbar-right { display: flex; align-items: center; gap: 9px; color: #747e94; font-size: 12px; }
                    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #28b98c; }
                    .avatar {
                        display: grid;
                        place-items: center;
                        width: 36px;
                        height: 36px;
                        margin-left: 10px;
                        border: 1px solid #e1e7ff;
                        border-radius: 50%;
                        background: var(--blue-light);
                        color: var(--blue);
                        font-weight: 800;
                    }

                    .page-content { max-width: 1500px; margin: auto; padding: 38px 40px 24px; }
                    .page-heading {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        gap: 20px;
                        margin-bottom: 30px;
                    }

                    .eyebrow {
                        margin-bottom: 8px;
                        color: var(--blue);
                        font-size: 10px;
                        font-weight: 800;
                        letter-spacing: 1.8px;
                    }

                    .page-heading h1, .login-card h1 {
                        margin-bottom: 7px;
                        color: #1b2544;
                        font-size: clamp(25px, 3vw, 32px);
                        font-weight: 800;
                        letter-spacing: -1.3px;
                        line-height: 1.35;
                    }

                    .page-heading p, .login-description { margin-bottom: 0; color: var(--muted); }
                    .heading-date { padding-bottom: 5px; color: #8b93a8; font-size: 12px; }

                    .panel, .stat-card, .welcome-card, .feature-card {
                        background: var(--surface);
                        border: 1px solid var(--line);
                        border-radius: 17px;
                        box-shadow: var(--shadow);
                    }

                    .panel { margin-bottom: 24px; padding: 25px; }
                    .panel-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        margin-bottom: 22px;
                    }

                    .panel-title { margin-bottom: 3px; font-size: 16px; font-weight: 800; letter-spacing: -.3px; }
                    .panel-description { margin: 0; color: var(--muted); font-size: 12px; }
                    .section-chip {
                        padding: 5px 10px;
                        border-radius: 8px;
                        background: #f0f3ff;
                        color: var(--blue);
                        font-size: 11px;
                        font-weight: 700;
                    }

                    .stat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-bottom: 25px; }
                    .stat-card { padding: 23px; }
                    .stat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
                    .stat-label { color: var(--muted); font-size: 12px; font-weight: 600; }
                    .stat-icon {
                        display: grid;
                        place-items: center;
                        width: 40px;
                        height: 40px;
                        border-radius: 13px;
                        background: var(--blue-light);
                        color: var(--blue);
                        font-size: 20px;
                    }
                    .stat-number { margin: 15px 0 3px; font-size: 30px; font-weight: 800; letter-spacing: -1px; }
                    .stat-caption { color: #9aa1b4; font-size: 11px; }

                    .welcome-card {
                        position: relative;
                        overflow: hidden;
                        margin-bottom: 25px;
                        padding: 30px;
                        border: 0;
                        color: white;
                        background: linear-gradient(115deg, #273b83, #4f6df5);
                    }

                    .welcome-card:after {
                        content: "";
                        position: absolute;
                        width: 220px;
                        height: 220px;
                        top: -100px;
                        right: 5%;
                        border: 35px solid rgba(255,255,255,.08);
                        border-radius: 50%;
                    }

                    .welcome-card h2 { position: relative; z-index: 1; margin-bottom: 7px; font-size: 24px; letter-spacing: -.8px; }
                    .welcome-card p { position: relative; z-index: 1; max-width: 520px; margin-bottom: 20px; color: #e1e7ff; }
                    .welcome-card .btn { position: relative; z-index: 1; background: white; color: #4057d9; }

                    .feature-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
                    .feature-card { display: block; padding: 25px; transition: transform .2s, box-shadow .2s; }
                    .feature-card:hover { transform: translateY(-3px); box-shadow: 0 14px 35px rgba(31,45,86,.1); }
                    .feature-icon {
                        display: grid;
                        place-items: center;
                        width: 47px;
                        height: 47px;
                        margin-bottom: 17px;
                        border-radius: 14px;
                        background: var(--blue-light);
                        color: var(--blue);
                        font-size: 23px;
                    }
                    .feature-card h3 { margin-bottom: 6px; font-size: 16px; }
                    .feature-card p { margin-bottom: 15px; color: var(--muted); font-size: 12px; }
                    .feature-arrow { color: var(--blue); font-size: 18px; font-weight: 800; }

                    .search-form { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: end; }
                    .search-form .form-actions { display: flex; flex-wrap: wrap; gap: 9px; grid-column: 1 / -1; }
                    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
                    .field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
                    .field label, .login-form label { color: #4d5873; font-size: 12px; font-weight: 700; }
                    input, select {
                        width: 100%;
                        min-width: 0;
                        height: 43px;
                        padding: 0 12px;
                        border: 1px solid #e1e5ef;
                        border-radius: 9px;
                        outline: none;
                        color: var(--ink);
                        background: white;
                        transition: border-color .15s, box-shadow .15s;
                    }

                    input::placeholder { color: #b0b6c5; }
                    input:focus, select:focus {
                        border-color: #8799ff;
                        box-shadow: 0 0 0 3px rgba(79,109,245,.1);
                    }

                    .btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        min-height: 42px;
                        padding: 10px 17px;
                        border: 1px solid transparent;
                        border-radius: 9px;
                        font-size: 12px;
                        font-weight: 700;
                        transition: background .15s, transform .15s;
                    }

                    .btn:active { transform: scale(.98); }
                    .btn-primary { background: var(--blue); color: white; box-shadow: 0 5px 12px rgba(79,109,245,.17); }
                    .btn-primary:hover { background: var(--blue-dark); }
                    .btn-secondary { background: white; color: #606b84; border-color: #e2e6f0; }
                    .btn-secondary:hover { background: #f8f9fd; }
                    .btn-danger { background: #fff1f2; color: var(--red); border-color: #ffe0e4; }
                    .btn-danger:hover { background: #ffe5e8; }
                    .btn-small { min-height: 32px; padding: 6px 10px; font-size: 11px; }

                    .table-wrap { width: 100%; overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }
                    table { width: 100%; min-width: 650px; border-collapse: collapse; background: white; text-align: left; }
                    thead, tr:first-child { background: #f8f9fd; }
                    th {
                        padding: 14px 15px;
                        border-bottom: 1px solid var(--line);
                        color: #7b849a;
                        font-size: 11px;
                        font-weight: 800;
                        white-space: nowrap;
                    }
                    td {
                        padding: 14px 15px;
                        border-bottom: 1px solid #edf0f6;
                        color: #515c75;
                        font-size: 12px;
                        vertical-align: middle;
                    }
                    tr:last-child td { border-bottom: 0; }
                    tbody tr:hover { background: #fbfcff; }
                    td form { margin: 0; }
                    .table-primary { color: #25345f; font-weight: 700; }
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 4px 9px;
                        border-radius: 7px;
                        background: #edf8f3;
                        color: #16835f;
                        font-size: 10px;
                        font-weight: 800;
                        white-space: nowrap;
                    }
                    .badge-blue { background: #eef2ff; color: #4c63e8; }
                    .badge-gray { background: #f0f2f7; color: #737d94; }
                    .empty-state { padding: 40px 15px; text-align: center; color: #9ba2b5; }
                    .empty-icon { display: block; margin-bottom: 10px; font-size: 27px; }
                    .employee-edit { min-width: 190px; display: grid; gap: 8px; }
                    .employee-edit input, .employee-edit select { height: 35px; font-size: 11px; }
                    .row-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
                    .schedule-edit { min-width: 210px; display: grid; gap: 8px; }
                    .schedule-edit input, .schedule-edit select { height: 35px; font-size: 11px; }
                    .inline-form { display: inline; }
                    .form-note { margin: 13px 0 0; color: var(--muted); font-size: 11px; }
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        gap: 15px;
                        margin-top: 32px;
                        padding: 18px 0 5px;
                        border-top: 1px solid #e8ebf3;
                        color: #a0a6b6;
                        font-size: 10px;
                    }

                    .login-page {
                        position: relative;
                        display: flex;
                        min-height: 100vh;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        padding: 35px 20px;
                        background: linear-gradient(140deg, #f4f6ff, #edf1ff 50%, #f8f9ff);
                    }

                    .login-decoration { position: absolute; border-radius: 50%; pointer-events: none; }
                    .decoration-one {
                        width: 500px;
                        height: 500px;
                        top: -260px;
                        right: -100px;
                        background: rgba(108,132,255,.09);
                    }
                    .decoration-two {
                        width: 360px;
                        height: 360px;
                        bottom: -220px;
                        left: -100px;
                        background: rgba(108,132,255,.09);
                    }

                    .login-brand { position: absolute; top: 35px; left: max(25px, calc((100% - 1050px) / 2)); }
                    .login-card {
                        position: relative;
                        z-index: 1;
                        width: min(100%, 440px);
                        padding: 42px;
                        border: 1px solid rgba(255,255,255,.9);
                        border-radius: 23px;
                        background: rgba(255,255,255,.95);
                        box-shadow: 0 25px 80px rgba(43,60,126,.12);
                    }

                    .login-symbol {
                        display: grid;
                        place-items: center;
                        width: 48px;
                        height: 48px;
                        margin-bottom: 24px;
                        border-radius: 15px;
                        background: var(--blue-light);
                        color: var(--blue);
                        font-size: 23px;
                    }

                    .login-card h1 { font-size: 25px; }
                    .login-description { margin-bottom: 28px; font-size: 12px; line-height: 1.8; }
                    .login-form { display: grid; gap: 10px; }
                    .login-form label:not(:first-child) { margin-top: 8px; }
                    .login-form input { height: 48px; padding: 0 14px; background: #fcfcff; }
                    .login-submit { width: 100%; height: 48px; margin-top: 14px; font-size: 13px; }
                    .login-submit span { margin-left: auto; font-size: 18px; }
                    .login-note { margin-top: 23px; text-align: center; color: #939bb0; font-size: 10px; }
                    .login-note span { margin-right: 5px; color: #20ae82; }
                    .login-footer { position: relative; z-index: 1; margin: 28px 0 0; color: #a2a9bf; font-size: 9px; font-weight: 700; letter-spacing: 1.6px; }
                    .error-symbol { background: #fff0f1; color: var(--red); }
                    .full-button { width: 100%; margin-top: 22px; }

                    @media (max-width: 1100px) {
                        .sidebar { width: 215px; padding-left: 13px; padding-right: 13px; }
                        .main-area { margin-left: 215px; }
                        .topbar { padding: 0 25px; }
                        .page-content { padding: 30px 25px 20px; }
                        .search-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    }

                    @media (max-width: 760px) {
                        .sidebar {
                            position: static;
                            width: 100%;
                            padding: 15px;
                            border-right: 0;
                            border-bottom: 1px solid var(--line);
                        }
                        .brand { padding: 0 5px 13px; }
                        .brand-icon { width: 37px; height: 37px; }
                        .brand strong { font-size: 18px; }
                        .nav-label, .sidebar-bottom { display: none; }
                        .nav-menu { display: flex; gap: 5px; overflow-x: auto; }
                        .nav-link { min-height: 40px; flex: 0 0 auto; padding: 8px 11px; font-size: 11px; }
                        .nav-icon { font-size: 17px; }
                        .main-area { margin-left: 0; }
                        .topbar { height: 57px; padding: 0 17px; }
                        .topbar-right { font-size: 0; }
                        .topbar-right .status-dot { width: 8px; height: 8px; }
                        .topbar-right .avatar { width: 31px; height: 31px; }
                        .page-content { padding: 25px 16px 18px; }
                        .page-heading { align-items: flex-start; margin-bottom: 23px; }
                        .page-heading h1 { font-size: 25px; }
                        .heading-date { display: none; }
                        .stat-grid { grid-template-columns: 1fr; gap: 12px; }
                        .stat-card { padding: 18px; }
                        .stat-number { margin-top: 8px; font-size: 25px; }
                        .feature-grid { grid-template-columns: 1fr; }
                        .panel { padding: 17px; }
                        .search-form, .form-grid { grid-template-columns: 1fr; }
                        .search-form .form-actions { grid-column: auto; }
                        .welcome-card { padding: 23px; }
                        .welcome-card h2 { font-size: 21px; }
                        .footer { flex-direction: column; gap: 4px; }
                        .login-card { padding: 30px 24px; }
                        .login-brand { top: 20px; left: 18px; }
                        .login-page { justify-content: center; padding-top: 85px; }
                    }
                </style>
            </head>
            <body>
                ${body}
            </body>
            </html>
        `;
    },

    user: function() {
        const content = `
            <section class="welcome-card">
                <div class="eyebrow" style="color:#dbe3ff">YOUR WORKSPACE</div>
                <h2>오늘의 근무를 한눈에 관리하세요.</h2>
                <p>직원 정보를 관리하고 근무 일정을 간편하게 등록하고 수정할 수 있습니다.</p>
                <a class="btn" href="/user/schedule">근무표 관리 시작하기 <span>→</span></a>
            </section>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-top">
                        <span class="stat-label">직원 관리</span>
                        <span class="stat-icon">♙</span>
                    </div>
                    <div class="stat-number">Employees</div>
                    <div class="stat-caption">직원 정보 및 근무 통계</div>
                </div>

                <div class="stat-card">
                    <div class="stat-top">
                        <span class="stat-label">일정 관리</span>
                        <span class="stat-icon">▦</span>
                    </div>
                    <div class="stat-number">Schedules</div>
                    <div class="stat-caption">근무 일정 등록 및 변경</div>
                </div>

                <div class="stat-card">
                    <div class="stat-top">
                        <span class="stat-label">공통 조회</span>
                        <span class="stat-icon">◷</span>
                    </div>
                    <div class="stat-number">Overview</div>
                    <div class="stat-caption">날짜와 직원별 근무 검색</div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">빠른 메뉴</h2>
                        <p class="panel-description">자주 사용하는 기능으로 바로 이동하세요.</p>
                    </div>
                    <span class="section-chip">QUICK ACCESS</span>
                </div>

                <div class="feature-grid">
                    <a class="feature-card" href="/user/employee">
                        <span class="feature-icon">♙</span>
                        <h3>직원 관리</h3>
                        <p>직원을 등록하고 정보를 수정하거나 근무 통계를 확인하세요.</p>
                        <span class="feature-arrow">직원 페이지 열기 →</span>
                    </a>

                    <a class="feature-card" href="/user/schedule">
                        <span class="feature-icon">▦</span>
                        <h3>근무표 관리</h3>
                        <p>근무 날짜와 시간을 등록하고 기존 일정을 관리하세요.</p>
                        <span class="feature-arrow">근무표 페이지 열기 →</span>
                    </a>
                </div>
            </div>
        `;

        return layout(
            '대시보드',
            '근무 관리 시스템에 오신 것을 환영합니다.',
            'dashboard',
            content
        );
    },

    employee: function() {
        const content = `
            <div class="welcome-card">
                <div class="eyebrow" style="color:#dbe3ff">MY WORKSPACE</div>
                <h2>나의 근무 일정을 확인하세요.</h2>
                <p>등록된 근무표를 조회하고 날짜별 근무 시간을 확인할 수 있습니다.</p>
                <a class="btn" href="/schedule">근무표 확인하기 <span>→</span></a>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">근무표 조회</h2>
                        <p class="panel-description">직원 이름과 날짜를 기준으로 일정을 검색할 수 있습니다.</p>
                    </div>
                    <span class="section-chip">SCHEDULE</span>
                </div>
                <a class="btn btn-primary" href="/schedule">근무표 페이지로 이동 →</a>
            </div>
        `;

        return layout(
            '직원 페이지',
            '근무 일정과 시간을 편리하게 확인하세요.',
            'view',
            content
        );
    },

    schedule: function(schedules, search = {}) {
        let rows = '';

        for (let i = 0; i < schedules.length; i++) {
            const s = schedules[i];

            rows += `
                <tr>
                    <td><span class="table-primary">${dateText(s.work_date)}</span></td>
                    <td>${escapeHTML(s.name)}</td>
                    <td><span class="badge badge-blue">${timeText(s.start_time)}</span></td>
                    <td><span class="badge">${timeText(s.end_time)}</span></td>
                </tr>
            `;
        }

        if (schedules.length === 0) {
            rows = `
                <tr><td colspan="4">
                    <div class="empty-state">
                        <span class="empty-icon">◷</span>
                        검색 조건에 맞는 근무표가 없습니다.
                    </div>
                </td></tr>
            `;
        }

        const content = `
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">근무 일정 검색</h2>
                        <p class="panel-description">직원 이름이나 근무 날짜로 일정을 찾아보세요.</p>
                    </div>
                    <span class="section-chip">SEARCH</span>
                </div>

                <form action="/schedule" method="get" class="search-form">
                    <div class="field">
                        <label>직원 이름</label>
                        <input type="text" name="name"
                            value="${escapeHTML(search.name || '')}"
                            placeholder="이름 입력">
                    </div>
                    <div class="field">
                        <label>시작 날짜</label>
                        <input type="date" name="start_date"
                            value="${escapeHTML(search.start_date || '')}">
                    </div>
                    <div class="field">
                        <label>종료 날짜</label>
                        <input type="date" name="end_date"
                            value="${escapeHTML(search.end_date || '')}">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" type="submit">⌕ 검색하기</button>
                        <a class="btn btn-secondary" href="/schedule">초기화</a>
                    </div>
                </form>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">근무 일정 목록</h2>
                        <p class="panel-description">검색 조건에 해당하는 근무표입니다.</p>
                    </div>
                    <span class="section-chip">${schedules.length} RESULTS</span>
                </div>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>근무 날짜</th>
                                <th>직원 이름</th>
                                <th>시작 시간</th>
                                <th>종료 시간</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;

        return layout(
            '근무표 조회',
            '직원별 근무 일정과 시간을 확인하세요.',
            'view',
            content
        );
    },

    UserSchedule: function(employees, schedules) {
        let employeeOptions = '';

        for (let i = 0; i < employees.length; i++) {
            const e = employees[i];

            employeeOptions += `
                <option value="${escapeHTML(e.employee_id_em)}">
                    ${escapeHTML(e.name)}
                </option>
            `;
        }

        let rows = '';

        for (let i = 0; i < schedules.length; i++) {
            const s = schedules[i];
            let editOptions = '';

            for (let j = 0; j < employees.length; j++) {
                const e = employees[j];
                const selected = e.employee_id_em == s.employee_id_sh
                    ? 'selected'
                    : '';

                editOptions += `
                    <option value="${escapeHTML(e.employee_id_em)}" ${selected}>
                        ${escapeHTML(e.name)}
                    </option>
                `;
            }

            rows += `
                <tr>
                    <td>
                        <form class="schedule-edit"
                              action="/user/schedule/update" method="post">
                            <input type="hidden" name="schedule_id"
                                value="${escapeHTML(s.schedule_id)}">

                            <div class="field">
                                <label>직원</label>
                                <select name="employee_id_sh" required>
                                    ${editOptions}
                                </select>
                            </div>

                            <div class="field">
                                <label>날짜</label>
                                <input type="date" name="work_date"
                                    value="${dateText(s.work_date)}" required>
                            </div>

                            <div class="field">
                                <label>시작 시간</label>
                                <input type="time" name="start_time"
                                    value="${timeText(s.start_time)}" required>
                            </div>

                            <div class="field">
                                <label>종료 시간</label>
                                <input type="time" name="end_time"
                                    value="${timeText(s.end_time)}" required>
                            </div>

                            <button class="btn btn-primary btn-small" type="submit">
                                변경 사항 저장
                            </button>
                        </form>

                        <form action="/user/schedule/delete" method="post"
                              onsubmit="return confirm('이 근무표를 삭제할까요?')">
                            <input type="hidden" name="schedule_id"
                                value="${escapeHTML(s.schedule_id)}">
                            <button class="btn btn-danger btn-small" type="submit">
                                삭제
                            </button>
                        </form>
                    </td>
                    <td><span class="table-primary">${dateText(s.work_date)}</span></td>
                    <td>${escapeHTML(s.name)}</td>
                    <td>${timeText(s.start_time)}</td>
                    <td>${timeText(s.end_time)}</td>
                </tr>
            `;
        }

        if (schedules.length === 0) {
            rows = `
                <tr><td colspan="5">
                    <div class="empty-state">
                        <span class="empty-icon">▦</span>
                        아직 등록된 근무표가 없습니다.
                    </div>
                </td></tr>
            `;
        }

        const content = `
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">새 근무표 등록</h2>
                        <p class="panel-description">직원과 날짜, 시작 및 종료 시간을 입력하세요.</p>
                    </div>
                    <span class="section-chip">NEW SCHEDULE</span>
                </div>

                <form action="/user/schedule" method="post">
                    <div class="form-grid">
                        <div class="field">
                            <label>직원 선택</label>
                            <select name="employee_id_sh" required>
                                <option value="">직원을 선택하세요</option>
                                ${employeeOptions}
                            </select>
                        </div>
                        <div class="field">
                            <label>근무 날짜</label>
                            <input type="date" name="work_date" required>
                        </div>
                        <div class="field">
                            <label>시작 시간</label>
                            <input type="time" name="start_time" required>
                        </div>
                        <div class="field">
                            <label>종료 시간</label>
                            <input type="time" name="end_time" required>
                        </div>
                    </div>
                    <p class="form-note">입력한 일정은 등록 후 공통 근무표 조회 페이지에도 반영됩니다.</p>
                    <div style="margin-top:18px">
                        <button class="btn btn-primary" type="submit">＋ 근무표 등록하기</button>
                    </div>
                </form>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">등록된 근무표</h2>
                        <p class="panel-description">일정의 수정과 삭제를 진행할 수 있습니다.</p>
                    </div>
                    <span class="section-chip">${schedules.length} SCHEDULES</span>
                </div>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>일정 관리</th>
                                <th>날짜</th>
                                <th>직원</th>
                                <th>시작 시간</th>
                                <th>종료 시간</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;

        return layout(
            '근무표 관리',
            '근무 일정을 등록하고 기존 일정을 수정하세요.',
            'schedule',
            content
        );
    },

    UserEmployee: function(employees, searchName = '') {
        let rows = '';

        for (let i = 0; i < employees.length; i++) {
            const e = employees[i];

            rows += `
                <tr>
                    <td>${escapeHTML(e.employee_id_em)}</td>
                    <td>
                        <div class="table-primary">${escapeHTML(e.name)}</div>
                        <div style="color:#9aa1b4;font-size:10px">
                            ${escapeHTML(e.gender)} · ${escapeHTML(e.age)}세
                        </div>
                    </td>
                    <td>${escapeHTML(e.username)}</td>
                    <td><span class="badge badge-gray">${escapeHTML(e.role)}</span></td>
                    <td><span class="badge badge-blue">${escapeHTML(e.work_count)}회</span></td>
                    <td><strong>${escapeHTML(e.total_hours)}</strong> 시간</td>
                    <td>
                        <form class="employee-edit"
                              action="/user/employee/update" method="post">
                            <input type="hidden" name="employee_id_em"
                                value="${escapeHTML(e.employee_id_em)}">

                            <div class="field">
                                <label>이름</label>
                                <input type="text" name="name"
                                    value="${escapeHTML(e.name)}" required>
                            </div>

                            <div class="field">
                                <label>성별</label>
                                <select name="gender" required>
                                    <option value="남" ${e.gender === '남' ? 'selected' : ''}>남</option>
                                    <option value="여" ${e.gender === '여' ? 'selected' : ''}>여</option>
                                </select>
                            </div>

                            <div class="field">
                                <label>나이</label>
                                <input type="number" name="age"
                                    value="${escapeHTML(e.age)}"
                                    min="1" max="120" required>
                            </div>

                            <button class="btn btn-primary btn-small" type="submit">
                                변경 사항 저장
                            </button>
                        </form>

                        <form action="/user/employee/delete" method="post"
                              onsubmit="return confirm('직원과 관련 근무표 및 직원 계정을 삭제할까요?')">
                            <input type="hidden" name="employee_id_em"
                                value="${escapeHTML(e.employee_id_em)}">
                            <button class="btn btn-danger btn-small" type="submit">
                                직원 삭제
                            </button>
                        </form>
                    </td>
                </tr>
            `;
        }

        if (employees.length === 0) {
            rows = `
                <tr><td colspan="7">
                    <div class="empty-state">
                        <span class="empty-icon">♙</span>
                        검색 결과가 없습니다. 이름을 확인해 주세요.
                    </div>
                </td></tr>
            `;
        }

        let userOptions = '';

        // 사용자 번호는 users 테이블에 이미 등록된 계정의 user_id를 입력해야 합니다.
        const content = `
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">직원 검색</h2>
                        <p class="panel-description">이름을 검색해 직원 정보와 근무 통계를 확인하세요.</p>
                    </div>
                    <span class="section-chip">EMPLOYEE SEARCH</span>
                </div>

                <form action="/user/employee" method="get" class="search-form">
                    <div class="field">
                        <label>직원 이름</label>
                        <input type="text" name="name"
                            value="${escapeHTML(searchName)}"
                            placeholder="검색할 직원 이름">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" type="submit">⌕ 검색하기</button>
                        <a class="btn btn-secondary" href="/user/employee">전체 직원</a>
                    </div>
                </form>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">직원 등록</h2>
                        <p class="panel-description">계정이 이미 생성된 직원의 정보를 등록하세요.</p>
                    </div>
                    <span class="section-chip">ADD EMPLOYEE</span>
                </div>

                <form action="/user/employee/create" method="post">
                    <div class="form-grid">
                        <div class="field">
                            <label>사용자 번호</label>
                            <input type="number" name="user_id_em"
                                min="1" placeholder="users 테이블의 user_id" required>
                        </div>
                        <div class="field">
                            <label>직원 이름</label>
                            <input type="text" name="name"
                                placeholder="이름 입력" required>
                        </div>
                        <div class="field">
                            <label>성별</label>
                            <select name="gender" required>
                                <option value="">성별 선택</option>
                                <option value="남">남</option>
                                <option value="여">여</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>나이</label>
                            <input type="number" name="age"
                                min="1" max="120" placeholder="나이 입력" required>
                        </div>
                    </div>
                    <div style="margin-top:18px">
                        <button class="btn btn-primary" type="submit">＋ 직원 등록하기</button>
                    </div>
                </form>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">직원 목록 및 근무 통계</h2>
                        <p class="panel-description">세 테이블의 정보를 연결해 직원별 근무 현황을 보여줍니다.</p>
                    </div>
                    <span class="section-chip">${employees.length} EMPLOYEES</span>
                </div>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>직원 정보</th>
                                <th>계정</th>
                                <th>권한</th>
                                <th>근무 횟수</th>
                                <th>총근무 시간</th>
                                <th>정보 수정 / 삭제</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>

                <p class="form-note">
                    근무 횟수는 COUNT(), 총근무 시간은 SUM(), 직원별 그룹화는 GROUP BY로 계산합니다.
                </p>
            </div>
        `;

        return layout(
            '직원 관리',
            '직원 정보를 관리하고 근무 현황을 확인하세요.',
            'employees',
            content
        );
    }
};
