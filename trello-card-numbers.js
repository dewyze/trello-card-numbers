// ensure lightbox is loaded before adding to it
function detailsReady() {
  var promise = new Promise(function(resolve,reject) {
    var inc = 40;
    var detailsListener = function(interval) {
      var lightbox = document.getElementsByClassName("window-title card-detail-title non-empty u-inline editable");
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

function addClass(selector, newClass, display) {
  return function() {
    var objects = getByClass(selector);
    addClassToArray(objects, newClass);
    objects = getByClass(newClass);
    addDisplayToArray(objects, display);
  };
}

function hasClass(target, className) {
  className = " " + className + " ";
  if (target.className) {
    return (" " + target.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1
  }
  return false;
}

function getByClass(name) {
  return document.getElementsByClassName(name);
}

function getAncestorBySelector(elem, selector) {
  var node = elem;
  while (node.tagName != "BODY") {
    if (hasClass(node, selector)) {
      return node;
    }
    if (node.parentNode !== "undefined") {
      node = node.parentNode;
    } else {
      return null;
    }
  }
}

window.addEventListener("load", function() {
  var showListNumbers = addClass("list-header-num-cards", "trello-card-numbers-inline-block", "inline-block");
  showListNumbers();
  var showCardIds = addClass("card-short-id", "trello-card-numbers-inline", "inline");
  showCardIds();

  // show card numbers after card is inserted
  var target = document.querySelector("body");

  var config = { attributes: true, childList: true, subtree: true, characterData: true }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        var node = mutation.addedNodes[0];
        var classes = node.classList;
        if (classes && classes.contains("search-result-card")) {
          showCardIds();
        }
        if (classes
            && (
              (classes.contains("list-card") && classes.contains("js-member-droppable"))
                || classes.contains("search-result-card")
            )
           ) {
             showCardIds();
             var card = node.querySelectorAll("a.list-card-title.js-card-name")[0];
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

  // add card number to card details lightbox
  document.body.addEventListener("mouseup", function(e) {
    var listCard =  getAncestorBySelector(e.target, 'list-card-details') || getAncestorBySelector(e.target, 'search-result-card');
    if (listCard) {
      var id = listCard.querySelectorAll(".card-short-id")[0].innerHTML;
      detailsReady().then(function() {

        // if/else needed to handle multiple promises
        var header = getByClass("trello-card-numbers-detail-header");
        if (header.length > 0) {
          header.innerHTML = id;
        } else {
          var obj = getByClass("window-title card-detail-title non-empty u-inline editable")[0];
          obj.innerHTML = "<h2 class='trello-card-numbers-detail-header quiet'>" + id + "</h2>" + obj.innerHTML;
        }
      }, function (err) {
        log(err);
      });
    }
  }, true);
}, false);
