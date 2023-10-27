let content = "";
let nowary = [];
let data = [];
let resultSort = document.querySelector('.resultSort');
let showList = document.querySelector('.showList');
let activeSort;
let sortby;
let sortfrom;

//將json資料先匯入變數data
axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
        data = response.data;
    })
    .catch(function (error) {
        console.log(error);
    })

//先把content清空，再依各條件代入頁面結果
//若activeSort已經有指定排序就照排序渲染，沒有就直接渲染
function add(ary) {
    content = "";
    if (activeSort) {
        reset(ary);
    }
    ary.forEach(function (val) {
        content += `<tr class="result"><td>${val.作物名稱}</td><td>${val.市場名稱}</td>
            <td>${val.上價}</td><td>${val.中價}</td><td>${val.下價}</td>
            <td>${val.平均價}</td><td>${val.交易量}</td></tr>`
    })
    showList.innerHTML = content;
}

let tab = document.querySelector('.tab');
let tablist = document.querySelectorAll('.tab button');
let search = document.querySelector('#search');
let searchResult = document.querySelector('.searchResult');
let noSearch = document.querySelector('.noSearch');

// 確認tab是哪一個，製作tab對應分頁
// 若已有搜尋結果要將搜尋結果先清空

tab.addEventListener('click', function (e) {
    if (e.target.nodeName !== "BUTTON") {
        return;
    } else if (e.target.nodeName == "BUTTON") {
        search.value = "";
        searchResult.textContent = "";
        tablist.forEach(e => e.classList.remove("btn_check"));
        e.target.classList.add("btn_check");
        let choose = e.target.getAttribute('data-type');
        noSearch.textContent = '資料載入中...';
        nowary = data.filter(item => item.種類代碼 == `${choose}`);
        add(nowary);
    }
})

// 按下搜尋鍵確認 1.是否有輸入內容 2.將tab移除 3.確認是否有對應內容

let searchbtn = document.querySelector('.searchCop>button');
searchbtn.addEventListener('click', function (e) {
    content = "";
    let inputSearch = search.value.trim();
    if (inputSearch == '') {
        Swal.fire({ title: '請在搜尋框輸入內容喔❗', confirmButtonColor: '#899E39' });
        return;
    }
    tablist.forEach(e => e.classList.remove("btn_check"));
    searchResult.textContent = `查看「${inputSearch}」的比價結果`;
    noSearch.textContent = '資料載入中...';
    nowary = data.filter(item => String(item.作物名稱).includes(inputSearch));
    if (nowary.length > 0) {
        add(nowary);
    } else {
        showList.innerHTML = `<td colspan="7" class="text-center font_thin noSearch">查詢不到當日的交易資訊QQ</td>`;
    }
})

//設定排序的按鈕依照頁面大小改變抓取的元素，<768就抓取手機版本的
function handleViewportWidthChange() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
        resultSort = document.querySelector('.mobile-select');
        sortby ? resultSort.value = sortby : 0;
    } else {
        resultSort = document.querySelector('.resultSort');
        sortby ? resultSort.value = sortby : 0;
    }
}
window.onload = handleViewportWidthChange();
window.addEventListener('resize', handleViewportWidthChange());

// 按下排序select選項時，之前已有content資料就排序，若無資料就更新排序用變數
// 若已有選上下，轉換為對應的上下   若沒有選，預設先下 將對應的箭頭加入class

resultSort.addEventListener('change', function () {
    let nowSort = sortfrom || "up";
    let target = document.querySelector(`i[data-price="${resultSort.value}"][data-sort="${nowSort}"]`);
    sortbyi.forEach(function (all) {
        all.classList.remove('active');
    });
    target.classList.add('active');
    reset(nowary);
    if (nowary.length > 0) {
        add(nowary)
    }
})

// 監聽所有i，按下i時找出對應的data-price與data-sort來改變排序
// 對應的i要加入active變綠色
let sortbyi = document.querySelectorAll('.sort-advanced i');
function reset(ary) {
    activeSort = document.querySelector('.active');
    sortby = activeSort.getAttribute("data-price");
    sortfrom = activeSort.getAttribute("data-sort");
    if (sortfrom == "up") {
        let arysort = nowary.sort(function (a, b) { return b[`${sortby}`] - a[`${sortby}`] });
        return arysort;
    } else if (sortfrom == "down") {
        let arysort = nowary.sort(function (a, b) { return a[`${sortby}`] - b[`${sortby}`] });
        return arysort;
    }
}

//若點i 把其他綠色移除並加上，並reset現在的
//將select的地方同步變為一樣的排序字樣
sortbyi.forEach(function (item) {
    item.addEventListener("click", function (e) {
        sortbyi.forEach(function (all) {
            all.classList.remove('active');
        });
        e.target.classList.add('active');
        reset(nowary);
        resultSort.value = sortby;
        if (nowary.length > 0) {
            add(nowary)
        }
    });
})

//back to top按鈕 頁面滑動Y超過200顯示
let topBtn = document.querySelector('.topBtn');

window.onscroll = function () {
    if (window.scrollY > 200) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    };
}

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

