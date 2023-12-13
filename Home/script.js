function addText() {
  var body = document.body;

  var newText = "<h2 id='greeting'>다시 생각해보세요</h2>";
  body.innerHTML += newText;

  setTimeout(function () {
    var greetingElement = document.getElementById("greeting");
    if (greetingElement) {
      greetingElement.style.opacity = 1;
    }
  }, 100);

  setTimeout(function () {
    var greetingElement = document.getElementById("greeting");
    if (greetingElement) {
      greetingElement.style.opacity = 0;
      setTimeout(function () {
        greetingElement.remove();
      }, 1500);
    }
  }, 3000);
}
