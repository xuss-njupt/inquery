let dataPromise = null; // 全局变量保存数据加载的Promise

// 在页面加载时自动加载数据
document.addEventListener('DOMContentLoaded', () => {
    dataPromise = loadData().catch(error => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '成绩数据初始化失败，请刷新页面重试';
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
        throw error; // 继续抛出错误以便后续处理
    });
});

async function loadData() {
    try {
        // 需要加载的JSON文件列表
        const urls = Array.from({length: 20}, (_, i) => `data/data${i}.json`);
        
        // 并行加载所有JSON文件
        const responses = await Promise.all(
            urls.map(url => fetch(url)
                .catch(error => {
                    console.warn(`文件 ${url} 加载失败`, error);
                    return null;
                }))
        );

        // 过滤并验证响应
        const validResponses = responses.filter(res => res && res.ok);
        if (validResponses.length === 0) {
            throw new Error('所有数据文件加载失败');
        }

        // 解析并合并数据
        const dataArrays = await Promise.all(
            validResponses.map(res => res.json())
        );
        return dataArrays.flat();
    } catch (error) {
        console.error('数据加载失败:', error);
        throw error;
    }
}

async function queryScore() {
    const myid = document.getElementById("myid").value.trim().toUpperCase();
    const name = document.getElementById("name").value.trim();
    const resultDiv = document.getElementById("result");

    // 重置显示状态
    resultDiv.classList.remove('success', 'error');
    resultDiv.style.display = 'none';

    try {
        // 等待数据加载完成
        const allStudents = await dataPromise;

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
        resultDiv.innerHTML = '数据尚未加载完成，请稍后重试';
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
        console.error('查询错误:', error);
    }
}
