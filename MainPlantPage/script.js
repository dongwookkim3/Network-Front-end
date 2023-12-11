const firebaseConfig = {
  apiKey: "AIzaSyBdvMg1__shb51NA8BlG4Mn8IdNz_HK8E0",
  authDomain: "smartplant-89fe3.firebaseapp.com",
  databaseURL: "https://smartplant-89fe3-default-rtdb.firebaseio.com/",
  projectId: "smartplant-89fe3",
  storageBucket: "smartplant-89fe3.appspot.com",
  messagingSenderId: "1072141389605",
  appId: "1:1072141389605:web:9ff12db3a87bdc0571d4cc",
  measurementId: "G-B42952QHB3",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 데이터베이스 변수
const database = firebase.database();

// 데이터 불러오기

const ref1 = database.ref("Smart_Plant/DHT1");
const ref2 = database.ref("Smart_Plant/DHT2");
const ref3 = database.ref("Smart_Plant/GYRO");
const ref4 = database.ref("Smart_Plant/PHOTO/CAM1");
const ref5 = database.ref("Smart_Plant/PLANTS");
const ref6 = database.ref("Smart_Plant");
const ref7 = database.ref("Smart_Plant/PLANTS");
const ref8 = database.ref("Smart_Plant/PHOTO/CAM2");

ref1
  .once("value")
  .then((snapshot1) => {
    const data1 = snapshot1.val();
    return ref2.once("value").then((snapshot2) => {
      const data2 = snapshot2.val();
      return ref3.once("value").then((snapshot3) => {
        const data3 = snapshot3.val();
        // 데이터 처리
        const humidity = ((data1.humidity + data2.humidity) / 2).toFixed(2);
        const temperature = ((data1.temperature + data2.temperature) / 2).toFixed(2);
        document.querySelector("#container1").innerHTML = temperature + "°C";
        document.querySelector("#container2").innerHTML = humidity + "%";
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });

ref4.once("value").then((snapshot4) => {
  const data4 = snapshot4.val();
  var photoURL = data4.ESP32CAM1;
  var img = document.getElementById("img1");
  return (img.src = photoURL);
});

ref8.once("value").then((snapshot8) => {
  const data8 = snapshot8.val();
  var photoURL = data8.ESP32CAM2;
  var img = document.getElementById("img2");
  return (img.src = photoURL);
});

//ref5.once("value").then((snapshot5) => {
//  const data5 = snapshot5.val();
//  return (document.querySelector("#name").innerHTML = data5.name);
//});

ref6.once("value").then((snapshot6) => {
  const data6 = snapshot6.val();
  if (data6.unzi === 1) {
    return (document.querySelector("#unzi").innerHTML = "넘어졌습니다!");
  }
});

//ref7.once("value").then((snapshot7) => {
//  const data7 = snapshot7.val();
//  return (document.querySelector("#sub").innerHTML = data7.subCategory);
//});

let boards = [];
let names = [];
let subCategories = [];

const getBoards = async () => {
  const board = database.ref("Smart_Plant").child("PLANTS");
  await board.once("value").then((snapshot7) => {
    snapshot7.forEach((childSnapshot) => {
      const boardData = {
        name: childSnapshot.val().name,
        subCategory: childSnapshot.val().subCategory,
      };

      boards.push(boardData);
      names.push(boardData.name);
      subCategories.push(boardData.subCategory);
    });
  });

  getLatestBoard();
};

// boards 배열의 값을 화면에 표시하는 함수
function displayBoards(board) {
  const table = document.getElementById("board-table");

  // table 요소가 유효하지 않으면 함수를 종료
  if (!table) {
    return;
  }

  // 기존 테이블 내용 초기화
  table.innerHTML = "";

  // 테이블 헤더 생성
  const headerRow = document.createElement("tr");
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "이름";
  const subCategoryHeader = document.createElement("th");
  subCategoryHeader.textContent = "식물종";
  headerRow.appendChild(nameHeader);
  headerRow.appendChild(subCategoryHeader);
  table.appendChild(headerRow);

  // 데이터 행 생성 및 삽입
  const dataRow = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.textContent = board.name;
  const subCategoryCell = document.createElement("td");
  subCategoryCell.textContent = board.subCategory;
  dataRow.appendChild(nameCell);
  dataRow.appendChild(subCategoryCell);
  table.appendChild(dataRow);
}

// getLatestBoard 함수 정의
const getLatestBoard = () => {
  if (boards.length > 0) {
    const latestBoard = boards[boards.length - 1];
    displayBoards(latestBoard);
  }
};

// getBoards 함수 호출
getBoards();
