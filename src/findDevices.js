const findDeviceButton = document.getElementById("mbtn-findDevice");
const displayProgress = document.getElementById("progressDisplay");
const progressDetail = document.getElementById("progressDetail");

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

var url_template;
var min;
var max;
var timeout;
var resultCount;
var i;
var detail;

findDeviceButton.onclick = () => {
  displayProgress.classList.remove("hidden");
  $(findDeviceButton).button("loading");

  var gfg = document.URL;
  var url_temp = gfg.substring(gfg.indexOf("/") + 2, gfg.lastIndexOf(":"));
  min = 2;
  max = 254;
  timeout = 700;
  resultCount = 0;
  detail = "";

  if (url_temp.match(/\./g).length == 3) {
    const myArray = url_temp.split(".");
    url_temp = myArray[0] + "." + myArray[1] + "." + myArray[2];
    url_template = "http://" + url_temp + ".{{number}}:88/find";
    //url_template = "http://192.168.1." + "{{number}}:88/find";
    loopFind(min);
  } else {
    showModal(
      "Non local IP",
      "<p>Find Devices Currently Only works for local network searching</p>"
    );
  }
};

function loopFind(i) {
  $("#progressDetail")
    .css("width", Math.round(percentage(i, max)) + "%")
    .attr("aria-valuenow", Math.round(percentage(i, max)));

  if (i > max) {
    if (resultCount != 0) {
      showModal(
        "Found Node Devices",
        "<p>The Following Node Devices have been found:</p><p>" +
          detail +
          "</p>"
      );
    } else {
      showModal(
        "Found No Node/Sentry Devices",
        "<p>No node or sentry devices have been found, please try again and if you believe and issue exists please reach out to support</p>"
      );
    }

    $(findDeviceButton).button("reset");
    displayProgress.classList.add("hidden");

    return;
  }
  let tt_url = url_template.replace("{{number}}", i);
  // console.log(url);

  xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      detail =
        detail +
        this.responseText.replace(/Beam:/g, "").replace(/:PRINTING:/g, "") +
        "<br>";
      resultCount = resultCount + 1;
      loopFind(i + 1);
    }
  };
  xmlHttp.open("GET", tt_url);
  xmlHttp.timeout = timeout;
  xmlHttp.ontimeout = (e) => {
    loopFind(i + 1);
    //console.log(i)
  };
  xmlHttp.send();
}
