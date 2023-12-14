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

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const ref1 = database.ref("Smart_Plant/DHT1");
const ref2 = database.ref("Smart_Plant/DHT2");
const ref3 = database.ref("Smart_Plant/SOILMOISTURE");
const ref4 = database.ref("Smart_Plant");
const ref5 = database.ref("Smart_Plant/PHOTO/CAM1");
const ref6 = database.ref("Smart_Plant/PHOTO/CAM2");


ref1.once("value").then((snapshot1) => {
  const data1 = snapshot1.val();
  return ref2.once("value").then((snapshot2) => {
    const data2 = snapshot2.val();
    return ref3.once("value").then((snapshot3) => {
      const data3 = snapshot3.val();
      const soilMoisture = (100 - (data3.SoilMoisture / 1024) * 100).toFixed(2);
      const humidity = ((data1.humidity + data2.humidity) / 2).toFixed(2);
      const temperature = ((data1.temperature + data2.temperature) / 2).toFixed(2);
      document.querySelector("#container1").innerHTML = temperature + "°C";
      document.querySelector("#container2").innerHTML = humidity + "%";
      document.querySelector("#container3").innerHTML = soilMoisture + "%";

      suggestsoilMoisture(soilMoisture)
      suggestTemperature(temperature);
      suggestHumidity(humidity);
    });
  });
})
  .catch((error) => {
    console.error(error);
  });

function suggestsoilMoisture(soilMoisture) {
  if (soilMoisture <= 31.64) {
    document.querySelector('#soi').innerHTML = '물이 너무 부족해요.'
  }
}
function suggestTemperature(temperature) {
  if (temperature < 16) {
    const diff = (16 - temperature).toFixed(2);
    document.querySelector("#tem").innerHTML = `온도가 너무 낮아요. ${diff}도 정도 높여주세요.`;
  } else if (temperature > 25) {
    const diff = (temperature - 25).toFixed(2);
    document.querySelector("#tem").innerHTML = `온도가 너무 높아요. ${diff}도 정도 낮춰주세요.`;
  }
}

function suggestHumidity(humidity) {
  if (humidity < 40) {
    const diff = (40 - humidity).toFixed(2);
    document.querySelector("#hum").innerHTML = `습도가 너무 낮아요. ${diff}% 정도 높여주세요.`;
  } else if (humidity > 70) {
    const diff = (humidity - 70).toFixed(2);
    document.querySelector("#hum").innerHTML = `습도가 너무 높아요. ${diff}% 정도 낮춰주세요.`;
  }
}


ref5.once("value").then((snapshot5) => {
  const data5 = snapshot5.val();
  var photoURL = data5.ESP32CAM1;
  var img = document.getElementById("img1");
  return (img.src = photoURL);
});

ref6.once("value").then((snapshot6) => {
  const data6 = snapshot6.val();
  var photoURL = data6.ESP32CAM2;
  var img = document.getElementById("img2");
  return (img.src = photoURL);
});

ref4.once("value").then((snapshot4) => {
  const data4 = snapshot4.val();
  if (data4.unzi === 1) {
    return (document.querySelector("#unzi").innerHTML = "식물이 넘어졌습니다!");
  }
});

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

function displayBoards(board) {
  const table = document.getElementById("board-table");
  if (!table) return;
  table.innerHTML = "";

  const headerRow = document.createElement("tr");
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "이름";
  const subCategoryHeader = document.createElement("th");
  subCategoryHeader.textContent = "식물종";
  headerRow.appendChild(nameHeader);
  headerRow.appendChild(subCategoryHeader);
  table.appendChild(headerRow);

  const dataRow = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.textContent = board.name;
  const subCategoryCell = document.createElement("td");
  subCategoryCell.textContent = board.subCategory;
  dataRow.appendChild(nameCell);
  dataRow.appendChild(subCategoryCell);
  table.appendChild(dataRow);
}

const getLatestBoard = () => {
  if (boards.length > 0) {
    const latestBoard = boards[boards.length - 1];
    displayBoards(latestBoard);
  }
};

getBoards();