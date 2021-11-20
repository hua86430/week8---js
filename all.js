const list = document.querySelector('.ticketCard-area');
const region = document.querySelector('.regionSearch');
const searchNumText = document.querySelector('#searchResult-text');
const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');
const addTicketBtn = document.querySelector('.addTicket-btn');
const addTicketForm = document.querySelector('.addTicket-form');
let str = '';
let searchNum = 0;
let data = [];

axios
  .get(
    'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json'
  )
  .then((res) => {
    data = res.data.data;
    init();
    chartBuild();
  });

//資料渲染
function init(location) {
  str = '';
  searchNum = 0;
  //資料篩選邏輯
  const tempData = data.filter((item) => {
    if (item.area === location) {
      return item;
    }
    if (!location || location === '全部地區') {
      return item;
    }
  });

  //原始資料渲染
  tempData.forEach((item) => {
    searchNum++;
    str += `<li class="ticketCard">
    <div class="ticketCard-img">
        <a href="#">
            <img src=${item.imgUrl} alt="">
        </a>
        <div class="ticketCard-region">${item.area}</div>
        <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
        <div>
            <h3>
                <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
            ${item.description}
            </p>
        </div>
        <div class="ticketCard-info">
            <p class="ticketCard-num">
                <span>
                    <i class="fas fa-exclamation-circle"></i>
                </span>
                剩下最後
                <span id="ticketCard-num">${item.group}</span>
                組
            </p>
            <p class="ticketCard-price">
                TWD
                <span id="ticketCard-price">$${item.price}</span>
            </p>
        </div>
    </div>
  </li>`;
  });
  list.innerHTML = str;
  searchNumText.innerHTML = ` <p>本次搜尋共 ${searchNum} 筆資料</p>`;
}

//地區篩選

region.addEventListener('change', (e) => {
  init(e.target.value);
});

//新增套票

addTicketBtn.addEventListener('click', (e) => {
  let obj = {};
  let errorStatus = false;
  obj.id = data.length;
  obj.imgUrl = ticketImgUrl.value;
  obj.area = ticketRegion.value;
  obj.description = ticketDescription.value;
  obj.group = parseInt(ticketNum.value);
  obj.price = parseInt(ticketPrice.value);
  obj.rate = parseInt(ticketRate.value);
  Object.values(obj).forEach((item) => {
    if (item == '' || item == NaN) {
      errorStatus = true;
    }
  });
  if (errorStatus) {
    alert('有欄位為空');
  } else {
    data.push(obj);
    addTicketForm.reset();
    region.value = '全部地區';
    init();
    chartBuild();
  }
});

//chart資料建構

function chartBuild() {
  let chartTemp = {};
  let chartData = [];
  data.forEach((item) => {
    if (chartTemp[item.area] === undefined) {
      chartTemp[item.area] = 1;
    } else {
      chartTemp[item.area]++;
    }
  });
  Object.keys(chartTemp).forEach((item) => {
    let tempArr = [];
    tempArr.push(item);
    tempArr.push(chartTemp[item]);
    chartData.push(tempArr);
  });
  // chart資料渲染
  c3.generate({
    bindto: '#chart',
    data: {
      columns: chartData,
      type: 'donut',
    },
    donut: {
      title: '各地區分布比重',
    },
  });
}
