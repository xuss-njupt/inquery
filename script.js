async function queryScore() {
    const myid = document.getElementById("myid").value.trim().toUpperCase();
    const name = document.getElementById("name").value.trim();
    const resultDiv = document.getElementById("result");

    try {
        const response = await fetch('data/scores.json');
        const allscore = await response.json();

        resultDiv.classList.remove('success', 'error');
        resultDiv.style.display = 'none';

        const student = allscore.find(item => 
            item.myid === myid && item.name === name
        );

        if (student) {
            resultDiv.innerHTML = `尊敬的${student.name}同学（学号：${student.myid}），<br>本次测试成绩为：<strong>${student.score}分</strong>`;
            resultDiv.className = 'result-box success';
        } else {
            resultDiv.innerHTML = '未找到匹配的学生信息，请检查学号和姓名是否正确';
            resultDiv.className = 'result-box error';
        }
        
        resultDiv.style.display = 'block';
    } catch (error) {
        resultDiv.innerHTML = '数据加载失败，请稍后再试';
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
        console.error('Error:', error);
    }
}
