function addText() {
  var body = document.body;

  // 새로운 텍스트를 추가하여 body에 출력
  var newText = "<h2 id='greeting'>다시 생각해보세요</h2>";
  body.innerHTML += newText;

  setTimeout(function () {
    var greetingElement = document.getElementById("greeting");
    if (greetingElement) {
      greetingElement.style.opacity = 1;
    }
  }, 100);

  // 3초 후에 텍스트를 흐릿하게 사라지게 함
  setTimeout(function () {
    var greetingElement = document.getElementById("greeting");
    if (greetingElement) {
      greetingElement.style.opacity = 0;
      // 1.5초 후에 요소를 완전히 제거
      setTimeout(function () {
        greetingElement.remove();
      }, 1500);
    }
  }, 3000);
}
