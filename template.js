module.exports = {
    html(menu, body) {
        return `
            <h1><a href="/">선린인터넷고등학교</a></h1>
            ${menu}
            ${body}
        `;
    },
    mainsite() {
        return `
            <h2>메인페이지</h2>
            <p>선린인터넷고등학교는 교사 정보 사이트입니다.</p>
            <p>이거구나</p>
        `;
    },
    menu(teachers, id) {
        let result = '<ol>';
        for (let i = 0; i < teachers.length; i++) {
            result += `<li><a href="/${teachers[i].id}">${teachers[i].name}</a></li>`;
        }
        result += '</ol>';
        result += '<hr>';
        result += '<a href="/create">Create</a>';
        if (id) {
            result += `<br><a href="/update/${id}">Update</a>`;
            result += `<br><a href="/delete/${id}">Delete</a>`;
        }
        result += '<br>';
        result += '<a href = "/office">Office</a>'
        return result;
    },
    create(offices) {
         let officeList = '<option value="">교무실 없음</option>';
         for(let i = 0; i < offices.length; i++){
         officeList += `<option value="${offices[i].id}">${offices[i].building} ${offices[i].room}</option>`;
        }


        return `            
            <h2>Create</h2>
            <form action="/create" method="post">
                <p><input type="text" name="name" placeholder="이름"></p>
                <p><input type="text" name="subject" placeholder="과목"></p>
                <p><input type="text" name="class" placeholder="담임반"></p>
                <p><select name ="office_no">${officeList}</select></p>
                <p><button type="submit">send</button></p>
            </form>
        `;
    },
    update(teacher, offices) {
        let officeList = '<option value="">교무실 없음</option>';
         for(let i = 0; i < offices.length; i++){
            officeList += `<option value="${offices[i].id}"
            ${teacher.office_no === offices[i].id ? "selected" : ''}>
            ${offices[i].building} ${offices[i].room}</option>`;
        }
        return `
            <h2>Update</h2>            
            <form action="/update" method="post">
                <input type="hidden" name="id" value="${teacher.id}">
                <input type="text" name="name" value="${teacher.name}">
                <input type="text" name="subject" value="${teacher.subject}">
                <input type="text" name="class" value="${teacher.class}">
                <p><select name ="office_no">${officeList}</select></p>
                <p><button type="submit">수정</button></p>
            </form>
        `;
    },
    delete(teacher){ //삭제 화면 생성
        return  `
            <h2>Delete</h2>
            <p>${teacher.name} 페이지를 삭제하시겠습니까?</p>
            <form action="/delete" method="post">
                <input type="hidden" name="id" value="${teacher.id}">
                <button type="submit">삭제</button>
            </form>
        `;
    },
    read(teacher){
        return `
            <h2>${teacher.name} 페이지</h2>
            <p>과목 : ${teacher.subject}</p>
            <p>등록일 : ${teacher.created}</p>
            <p>담임반 : ${teacher.class ?? ''}</p>
            <p>교무실 : ${teacher.building ?? ''} ${teacher.room ?? ''}</p>
       `;
    }
};