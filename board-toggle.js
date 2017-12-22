function load() {
  console.log("HERE");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let url = tabs[0].url;
    let boardId = getBoardId(url);
    console.log(boardId);
    chrome.storage.sync.get("boards", function(items) {
      document.getElementById("toggle").checked = true;
    });
    document.getElementById("switch").style.visibility = "visible";
  });
}

function toggle(checkbox) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log(tabs[0]);
  });
}

function getBoardId(url) {
  return url.split('/').reverse()[1];
}

document.addEventListener('DOMContentLoaded', load);
document.getElementById('toggle').addEventListener('change', toggle)
