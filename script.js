let studentMap = null; // 使用Map结构存储索引数据

// 页面加载时自动构建索引
document.addEventListener('DOMContentLoaded', () => {
    loadData().then(map => {
        studentMap = map;
    }).catch(error => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '成绩数据初始化失败，请刷新页面重试';
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
        console.error('索引构建失败:', error);
    });
});

async function loadData() {
    try {
        // 并行加载优化（示例保持20个文件）
        const urls = Array.from({length: 10}, (_, i) => `data/data${i}.json`);
        
        // 改进的并行加载（带超时机制）
        const fetchPromises = urls.map(url => 
            Promise.race([
                fetch(url),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('请求超时')), 5000)
                )
            ]).catch(e => {
                console.warn(`文件 ${url} 加载失败: ${e.message}`);
                return null;
            })
        );

        const responses = await Promise.all(fetchPromises);
        
        // 构建内存索引
        const map = new Map();
        await Promise.all(
            responses.filter(Boolean).map(async res => {
                if (!res.ok) return;
                const students = await res.json();
                students.forEach(student => {
                    // 数据预处理（统一格式）
                    const key = `${student.myid.toUpperCase()}_${student.name.trim()}`;
                    // 内存优化：仅保留必要字段
                    map.set(key, { 
                        score: student.score,
                        name: student.name,
                        myid: student.myid
                    });
                });
            })
        );

        if (map.size === 0) throw new Error('所有数据加载失败');
        return map;
    } catch (error) {
        console.error('数据加载失败:', error);
        throw error;
    }
}

async function queryScore() {
    const rawMyid = document.getElementById("myid").value;
    const rawName = document.getElementById("name").value;
    const resultDiv = document.getElementById("result");

    // 即时输入处理
    const myid = rawMyid.trim().toUpperCase();
    const name = rawName.trim();
    
    // 提前验证基础输入
    if (!myid || !name) {
        showError('请输入完整的学号和姓名');
        return;
    }

    // 使用索引键查询
    const searchKey = `${myid}_${name}`;
    
    try {
        if (!studentMap) {
            showError('数据尚未加载完成，请稍候');
            return;
        }

        const student = studentMap.get(searchKey);
        showResult(student);
    } catch (error) {
        console.error('查询异常:', error);
        showError('查询过程中发生异常');
    }

    function showResult(student) {
        resultDiv.classList.remove('success', 'error');
        resultDiv.style.display = 'none';
        
        if (student) {
            resultDiv.innerHTML = `尊敬的${student.name}(${student.myid})同学，<br>本次测试成绩为：<strong>${student.score}分.</strong>`;
            resultDiv.className = 'result-box success';
        } else {
            resultDiv.innerHTML = '未找到匹配的学生信息，请检查：<br>1. 学号姓名是否正确<br>2. 是否在考试名单中';
            resultDiv.className = 'result-box error';
        }
        resultDiv.style.display = 'block';
    }

    function showError(msg) {
        resultDiv.classList.remove('success', 'error');
        resultDiv.innerHTML = msg;
        resultDiv.className = 'result-box error';
        resultDiv.style.display = 'block';
    }
}
