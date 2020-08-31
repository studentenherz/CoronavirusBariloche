infoStrip = document.getElementsByTagName("header")[0];
coronaBariloche = document.querySelector("header h1");

window.onscroll = function () {
  var offset = window.pageYOffset;
  var lightness = 89;
  var fontsize = 36;
  var shade = 10;
  if (offset <= 100) {
    lightness = 100 - offset * 0.21;
    fontsize = 36 - offset * 0.14;
    infoStrip.style.padding = `${(100 - offset) * 0.3}px 0`;
    coronaBariloche.style.fontSize = `${fontsize}px`;
    shade = 0.1 * offset;
  }

  infoStrip.style.boxShadow = `hsl(0, 0%, ${lightness}%) 5px 5px ${shade}px`;


  //   hsl(34, 26%, 89%)
}

var offset = window.pageYOffset;

console.log(offset)
var lightness = 89;
var fontsize = 22;
var shade = 10;
if (offset <= 100) {
  lightness = 100 - offset * 0.21;
  fontsize = 36 - offset * 0.14;
  infoStrip.style.padding = `${(100 - offset) * 0.3}px 0`;
  coronaBariloche.style.fontSize = `${fontsize}px`;
  shade = 0.1 * offset;
} else {
  lightness = 98;
  coronaBariloche.style.fontSize = `22px`;
  infoStrip.style.padding = `0`;
}


infoStrip.style.boxShadow = `hsl(0, 0%, ${lightness}%) 5px 5px ${shade}px`;