infoStrip = document.getElementById("info-container");
console.log(infoStrip);

window.onscroll = function () {
  var offset = window.pageYOffset;
  var lightness = 89;
  if (offset <= 100) {
    lightness = 100 - offset * 0.21;
    infoStrip.style.padding = `${(100 - offset)*0.3}px 0`;
  }

  infoStrip.style.boxShadow = `hsl(0, 0%, ${lightness}%) 5px 5px 10px`;
  

  //   hsl(34, 26%, 89%)
}