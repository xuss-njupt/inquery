async function queryScore() {
    const myid = document.getElementById("myid").value.trim().toUpperCase();
    const name = document.getElementById("name").value.trim();
    const resultDiv = document.getElementById("result");

    try {
        // 需要加载的JSON文件列表（可自由添加）
		const urls = Array.from({length: 20}, (_, i) => `data/data${i+1}.json`);

        // 并行加载所有JSON文件
        const responses = await Promise.all(
            urls.map(url => fetch(url)
                .catch(error => {
                    console.warn(`文件 ${url} 加载失败`, error);
                    return null;
                }))
        );

        // 过滤掉加载失败的文件
        const validResponses = responses.filter(res => res && res.ok);
        
        // 将各文件数据解析为数组并合并
        const dataArrays = await Promise.all(
            validResponses.map(res => res.json())
        );
        const allStudents = dataArrays.flat();

        // 重置显示状态
        resultDiv.classList.remove('success', 'error');
        resultDiv.style.display = 'none';

        // 执行学生信息匹配
        const student = allStudents.find(item => 
            item.myid === myid && item.name === name
        );

        // 显示查询结果
        if (student) {
            resultDiv.innerHTML = `尊敬的${student.name}(${student.myid})同学，<br>本次测试成绩为：<strong>${student.score}分.</strong>`;
            resultDiv.className = 'result-box success';
        } else {
            resultDiv.innerHTML = '未找到匹配的学生信息，请检查：<br>1. 学号姓名是否正确<br>2. 是否在考试名单中';
            resultDiv.className = 'result-box error';
        }
        
        resultDiv.style.display = 'block';
    } catch (error) {
        // 异常处理
        resultDiv.innerHTML = '数据加载异常，请稍后重试';
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
        console.error('系统错误:', error);
    }
}
