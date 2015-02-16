// ensure lightbox is loaded before adding to it
function detailsReady() {
  var promise = new Promise(function(resolve,reject) {
    var inc = 40;
    var detailsListener = function(interval) {
      var lightbox = document.getElementsByClassName("window-title card-detail-title non-empty inline editable");
      if (lightbox.length != 0) {
        resolve("true");
      }
      else {
        interval = interval + 1 || 1;
        if (interval < inc) {
          setTimeout(function() { detailsListener(interval); }, 100);
        } else {
          reject("Lightbox Number Error");
        }
      }
    };
    detailsListener();
  });

  return promise;
}

// check that url has been added to card after it is created
// this is done asynchronously a few ms later
function hrefReady(obj) {
  var promise = new Promise(function(resolve,reject) {
    var inc = 40;
    var hrefListener = function(interval) {
      if (obj.getAttribute("href") != undefined) {
        resolve(obj.getAttribute("href"));
      } else {
        interval = interval + 1 || 1;
        if (interval < inc) {
          setTimeout(function() { hrefListener(interval); }, 100);
        } else {
          reject("Href timeout error");
        }
      }
    };
    hrefListener();
  });

  return promise;
}

function log(data) {
  console.log(data);
}

function addClassToArray(arr,klass) {
  var len = arr.length
  for (var i=0; i < len; i++) {
    var obj = arr[i];
    obj.className = obj.className + " " + klass;
  };
}

function addDisplayToArray(arr,style) {
  var len = arr.length;
  for (var i=0; i < len; i++) {
    var obj = arr[i];
    obj.style.display = style;
  }
}

window.addEventListener("load", function() {
  var listHeaders = document.getElementsByClassName("list-header-num-cards");
  addClassToArray(listHeaders,"trello-card-numbers-inline-block");
  listHeaders = document.getElementsByClassName("trello-card-numbers-inline-block");
  addDisplayToArray(listHeaders,"inline-block");

  var shortIds = document.getElementsByClassName("card-short-id");
  addClassToArray(shortIds,"trello-card-numbers-inline");
  shortIds = document.getElementsByClassName("trello-card-numbers-inline");
  addDisplayToArray(shortIds,"inline");

  // needed for switching boards
  // $(document).on("DOMNodeInserted",".list", function() {
    // $(".list-header-num-cards").addClass("trello-card-numbers-inline-block");
    // $(".trello-card-numbers-inline-block").css("display","inline-block");
  // })

  // show card numbers after card is inserted
  var target = document.querySelector("#content");

  var config = { attributes: true, childList: true, subtree: true, characterData: true }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        var node = mutation.addedNodes[0];
        var classes = node.classList;
        if (classes && classes.contains("list-card") && classes.contains("js-member-droppable")) {
          var shortIds = document.getElementsByClassName("card-short-id");
          addClassToArray(shortIds,"trello-card-numbers-inline");
          shortIds = document.getElementsByClassName("trello-card-numbers-inline");
          addDisplayToArray(shortIds,"inline");
          var card = node.querySelectorAll("a.list-card-title.clear.js-card-name")[0];
          if (card.getAttribute("href") == undefined) {
            hrefReady(card).then(function(href) {
              var title = href.split("/");
              var s = title[title.length-1];
              var num = s.substr(0,s.indexOf("-"));
              var shortId = card.querySelector(".card-short-id");
              shortId.innerHTML = "#" + num + " ";
            }, function(err) {
              log(err);
            });
          }
        }
      }
    });
  });

  observer.observe(target,config);
  // });

  // $(document).on("DOMNodeInserted",".list-card.js-member-droppable", function() {

  //   // get card number for new cards using URL and add it to card-short-id
  // });

  // add card number to card details lightbox
  document.body.addEventListener("mouseup", function(e) {
    if (
      e.target.getAttribute('class').indexOf('list-card-details') >= 0
      || e.target.parentNode.getAttribute('class').indexOf('list-card-details') >= 0
    ) {
      var id = e.target.querySelectorAll(".card-short-id")[0].innerHTML;
      detailsReady().then(function() {

        // if/else needed to handle multiple promises
        var header = document.getElementsByClassName("trello-card-numbers-detail-header");
        if (header.length > 0) {
          header.innerHTML = id;
        } else {
          var obj = document.getElementsByClassName("window-title card-detail-title non-empty inline editable")[0];
          obj.innerHTML = "<h2 class='trello-card-numbers-detail-header quiet'>" + id + "</h2>" + obj.innerHTML;
        }
      }, function (err) {
        log(err);
      });
    }
  }, true);
}, false);
