const API_URL =
"https://script.google.com/macros/s/AKfycbyjPF46PiJEpxyLzzRbaF9hrkE-uE5_bYYuVfsJ1oFORECcqZsDf0q4F2kM5CIffevB/exec";



let currentData = null;



// =====================================
// Enter 查詢
// =====================================

document
.getElementById("number")
.addEventListener("keypress",(e)=>{

  if(e.key === "Enter"){

    searchData();

  }

});



// =====================================
// 查詢
// =====================================

function searchData(){

  const number =
  document
  .getElementById("number")
  .value
  .trim();

  clearMessage();

  if(!number){

    showError("請輸入分機");

    return;

  }

  // 清除舊JSONP
  const oldScript =
  document.getElementById("jsonp");

  if(oldScript){

    oldScript.remove();

  }

  // 建立JSONP
  const script =
  document.createElement("script");

  script.id = "jsonp";

  script.src =
    API_URL +
    "?number=" +
    encodeURIComponent(number) +
    "&callback=handleResponse";

  document.body.appendChild(script);

}



// =====================================
// 查詢回傳
// =====================================

window.handleResponse = function(data){

  console.log(data);

  if(data.success){

    currentData = data;

    document
    .getElementById("showSerial")
    .innerHTML =
    "查詢序號：";

    document
    .getElementById("showNumber")
    .innerHTML =
    "編號：" + data.number;

    document
    .getElementById("showName")
    .innerHTML =
    "姓名：" + data.name;

    document
    .getElementById("showGroup")
    .innerHTML =
    "組別：" + data.group;

    document
    .getElementById("showStatus")
    .innerHTML =
    "狀態：" + data.status;

    showSuccess("查詢完成");

  }else{

    resetData();

    showError("查無資料");

  }

};



// =====================================
// 確認報到
// =====================================

async function checkin(){

  if(!currentData){

    showError("請先查詢資料");

    return;

  }

  try{

    const response =
    await fetch(API_URL,{

      method:"POST",

      body:JSON.stringify({

        number:currentData.number,

        name:currentData.name,

        group:currentData.group

      })

    });

    const data =
    await response.json();

    if(data.success){

      // 顯示流水號
      document
      .getElementById("showSerial")
      .innerHTML =
      "查詢序號：" + data.serialNumber;

      // 顯示狀態
      document
      .getElementById("showStatus")
      .innerHTML =
      "狀態：已報到";

      showSuccess("報到完成");

    }else{

      showError("報到失敗");

    }

  }catch(error){

    console.error(error);

    showError("寫入失敗");

  }

}



// =====================================
// 修正
// =====================================

function resetForm(){

  document
  .getElementById("number")
  .value = "";

  currentData = null;

  resetData();

  clearMessage();

}



// =====================================
// 清空資料
// =====================================

function resetData(){

  document
  .getElementById("showSerial")
  .innerHTML =
  "查詢序號：";

  document
  .getElementById("showNumber")
  .innerHTML =
  "編號：";

  document
  .getElementById("showName")
  .innerHTML =
  "姓名：";

  document
  .getElementById("showGroup")
  .innerHTML =
  "組別：";

  document
  .getElementById("showStatus")
  .innerHTML =
  "狀態：";

}



// =====================================
// 成功訊息
// =====================================

function showSuccess(text){

  const msg =
  document.getElementById("msg");

  msg.className = "msg";

  msg.innerHTML = text;

}



// =====================================
// 錯誤訊息
// =====================================

function showError(text){

  const msg =
  document.getElementById("msg");

  msg.className = "msg error";

  msg.innerHTML = text;

}



// =====================================
// 清除訊息
// =====================================

function clearMessage(){

  const msg =
  document.getElementById("msg");

  msg.className = "msg";

  msg.innerHTML = "";

}