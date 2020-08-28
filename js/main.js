infoStrip = document.getElementsByTagName("header")[0];
coronaBariloche = document.querySelector("header h1");
console.log(infoStrip);

window.onscroll = function () {
  var offset = window.pageYOffset;
  var lightness = 89;
  var fontsize = 36;
  if (offset <= 100) {
    lightness = 100 - offset * 0.21;
    fontsize = 36 - offset * 0.14;
    infoStrip.style.padding = `${(100 - offset)*0.3}px 0`;
    coronaBariloche.style.fontSize = `${fontsize}px`;
  }

  infoStrip.style.boxShadow = `hsl(0, 0%, ${lightness}%) 5px 5px 10px`;
  

  //   hsl(34, 26%, 89%)
}