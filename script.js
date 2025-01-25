const DATA_PATH = 'data';  // 数据目录路径

async function loadAllScores() {
    try {
        // 动态加载数据目录下的所有JSON文件
        const response = await fetch(`${DATA_PATH}/_list.json`);
        const fileList = await response.json();
        
        // 并行加载所有数据文件
        const requests = fileList.map(file => 
            fetch(`${DATA_PATH}/${file}`)
                .then(res => res.json())
                .catch(e => [])
        );
        
        const results = await Promise.all(requests);
        return results.flat();
    } catch (error) {
        console.error('数据加载失败:', error);
        return [];
    }
}

async function queryScore() {
    const myid = document.getElementById("myid").value.trim().toUpperCase();
    const name = document.getElementById("name").value.trim();
    const resultDiv = document.getElementById("result");
    
    // 显示加载状态
    resultDiv.innerHTML = `<div class="loading-spinner"></div>正在查询...`;
    resultDiv.className = 'result-box';
    resultDiv.style.display = 'block';

    try {
        // 加载所有数据文件
        const allScores = await loadAllScores();
        
        // 执行查询
        const student = allScores.find(item => 
            item.myid === myid && item.name === name
        );

        // 显示结果
        if (student) {
            resultDiv.innerHTML = `
                <div class="student-info">
                    <h3>${student.name} 同学</h3>
                    <p>学号：${student.myid}</p>
                    <p class="score">成绩：${student.score} 分</p>
                    <p class="exam-date">考试批次：${student.examDate || '2023年秋季学期'}</p>
                </div>
            `;
            resultDiv.className = 'result-box success';
        } else {
            resultDiv.innerHTML = '未找到匹配的学生记录';
            resultDiv.className = 'result-box error';
        }
    } catch (error) {
        resultDiv.innerHTML = `数据查询失败：${error.message}`;
        resultDiv.className = 'result-box error';
    }
}
