const txt = document.querySelector('.txt');
const save = document.querySelector('.btn_add');
const list = document.querySelector('.list');
const total = document.querySelector('.todoTotal');

let data = JSON.parse(localStorage.getItem('todoData')) || [];
// 當localStorage有資料，即讀取todoData；如果沒有資料，data則為空陣列。

const update = () => localStorage.setItem('todoData', JSON.stringify(data));

const renderData = (data) => {
  let str = '';

  data.forEach((item) => {
    str +=`
    <li data-num='${item.num}'>
        <label class="checkbox" for="">
          <input type="checkbox" ${item.done ? 'checked' : ''}/>
          <span>${item.content}</span>
        </label>
        <a href="#" class="delete"></a>
      </li>
      `
  });

  list.innerHTML = str;
  total.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${data.length}個${tabType === "all" ? "" : (tabType === false ? "待完成" : "已完成")}項目`;

  ///this
  const undoneTodos = data.filter(todo => !todo.done);
  txt.setAttribute('placeholder', undoneTodos.length > 5 ? '小懶蟲，太多事情沒做了！':'請輸入待辦事項');
} 


const addTodo = () => {
  if (txt.value.trim() === ''){
    alert(`請輸入待辦事項。`);
    txt.value = '';
    return;
  }
  

  let obj = {};
  obj.content = txt.value;
  obj.done = false;
  obj.num = new Date().getTime();
  data.push(obj);
  
  renderData(filterTodo());
  txt.value = '';

  if (tabType === true){
    tabChange({ target: document.querySelector('[data-type="all"]') });
  }


  update();
};
save.addEventListener('click', addTodo);

txt.addEventListener('keyup',(e) =>{
  if (e.keyCode === 13){
    save.click();
  }
});

let tabType = 'all';

const filterTodo = () => {
  let filteredData = tabType === "all" ? data : data.filter((item) => item.done === tabType);
  renderData(filteredData);
  return filteredData;
};
renderData(data);


const tabs = document.querySelectorAll('.tab');

const tabChange = (e) => {
  tabs.forEach((tab) => tab.classList.remove('active'));
  e.target.classList.add('active');
  
  let tab = e.target.getAttribute('data-type');
  if (tab === 'all'){
    changeTabType('all');
  } else if (tab === 'true'){
    changeTabType(true);
  } else if (tab === 'false'){
    changeTabType(false);
  }

  filterTodo();

};
tabs.forEach((tab) => tab.addEventListener('click', tabChange));


const changeTabType = (type) => {
  tabType = type;
  renderData(filterTodo());
};


list.addEventListener('click', (e) => {
  //一定要設置獨立num，不然會出錯
  let num = parseInt(e.target.closest('li').dataset.num);
  let index = data.findIndex((item) => item.num === num);

  if (e.target.tagName === 'INPUT') {
    data[index].done = !data[index].done;
  }else if (e.target.getAttribute('class') === 'delete') {
    data.splice(index, 1);
  }

  update();
  filterTodo();
  
});

const clean = document.querySelector('.clean');


clean.addEventListener('click',()=>{
  if (data.some(item => item.done === true)){
    const removedTodo = data.filter(item => item.done);
    data = data.filter(item => !item.done);
    update();
    filterTodo();
    tabChange({ target: document.querySelector('[data-type="all"]') });
    alert(`清除了 ${removedTodo.length} 個項目。`);
    total.innerHTML = `<i class="fa-sharp fa-solid fa-bolt fa-beat fa-lg" style="color: #ffdd00;"></i>　<b>你超棒！</b>`
  } else {
    alert(`沒有可清除的項目！`);
    return;
  }
});



/*  21小時
4/18 6hrs
  [60% localStorage]
  [10% 新增待辦]
  [5% keyUp]
  [5% 刪除待辦]
  [20% checked狀態]

4/19 8hrs
  [15% checked狀態]
  [10% 清除已完成項目]
  [30% tab設置]
  [45% 畫面重新渲染]

4/20 6hrs
  [100% 畫面渲染問題]

4/21 1hrs
  [100% num對應待辦除錯]
*/