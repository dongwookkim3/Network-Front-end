function updateDropdown() {
  var categorySelect = document.getElementById("category");
  var subCategorySelect = document.getElementById("sub-category");
  var selectedCategory = categorySelect.value;

  if (selectedCategory === "") {
    subCategorySelect.style.display = "none";
    subCategorySelect.disabled = true;
    return;
  }

  subCategorySelect.innerHTML = '<option value="">선택</option>';
  subCategorySelect.disabled = false;

  if (selectedCategory === "plant") {
    addOption(subCategorySelect, "장미");
    addOption(subCategorySelect, "진달래");
    addOption(subCategorySelect, "코스모스");
    addOption(subCategorySelect, "꽃 모름");
  } else if (selectedCategory === "tree") {
    addOption(subCategorySelect, "참나무");
    addOption(subCategorySelect, "향나무");
  }

  subCategorySelect.style.display = "inline-block";
  subCategorySelect.disabled = false;
}

function addOption(select, value) {
  var option = document.createElement("option");
  option.value = value;
  option.text = value;
  select.add(option);
}

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function addData() {
  var plantName = document.getElementById("plantname").value;
  var category = document.getElementById("category").value;
  var subCategory = document.getElementById("sub-category").value;

  var newKey = database.ref("Smart_Plant/PLANTS/").child("PLANTS").push().key;

  var updates = {};
  updates["Smart_Plant/PLANTS/" + newKey] = {
    name: plantName,
    category: category,
    subCategory: subCategory,
  };

  database
    .ref()
    .update(updates)
    .then(function () {
      document.getElementById("plantname").value = "";
      document.getElementById("category").value = "";
      document.getElementById("sub-category").value = "";

      alert("데이터가 성공적으로 전송되었습니다.");
    })
    .catch(function (error) {
      alert("데이터 전송에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    });
}
