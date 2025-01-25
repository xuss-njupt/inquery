<!-- 仅script.js变化，其他保持原样 -->
<script>
async function queryScore() {
    const myid = document.getElementById("myid").value.trim().toUpperCase();
    const name = document.getElementById("name").value.trim();
    const resultDiv = document.getElementById("result");

    try {
        // 定义要加载的JSON文件列表
        const files = ['data.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json', 'data7.json', 'data8.json', 'data9.json', 'data10.json']; // 在此添加更多JSON文件
        
        // 并行加载所有JSON文件
        const responses = await Promise.allSettled(
            files.map(file => fetch(file).then(res => res.json()))
        );

        // 合并所有成功加载的数据
        const allscore = responses.reduce((acc, response) => {
            if (response.status === 'fulfilled') {
                acc.push(...response.value);
            }
            return acc;
        }, []);

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
</script>
