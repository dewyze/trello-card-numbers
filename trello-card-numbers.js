var LIGHTBOX_SELECTOR = 'window-title';
var CARD_LINK_QUERY_SELECTOR = 'a.list-card-title.js-card-name';
var LIST_NUM_CARDS_CLASS = 'list-header-num-cards';
var CARD_SHORT_ID = 'card-short-id';
var CARD_SHORT_ID_SELECTOR = '.' + CARD_SHORT_ID
var SEARCH_RESULT_CARD = 'search-result-card';
var TCN_HEADER = 'trello-card-numbers-detail-header';
var TCN_INLINE = 'trello-card-numbers-inline';
var TCN_INLINE_BLOCK = 'trello-card-numbers-inline-block';
var BOARD_URL_REGEX = /trello\.com\/b\//;
var CARD_URL_REGEX = /trello\.com\/c\//;

// ensure lightbox is loaded before adding to it
function lightboxReady() {
    var promise = new Promise(function(resolve,reject) {
        var inc = 40;
        var lightboxListener = function(interval) {
            var lightbox = document.getElementsByClassName(LIGHTBOX_SELECTOR);
            if (lightbox.length != 0) {
                resolve('true');
            }
            else {
                interval = interval + 1 || 1;
                if (interval < inc) {
                    setTimeout(function() { lightboxListener(interval); }, 100);
                } else {
                    reject('Lightbox Timeout');
                }
            }
        };
        lightboxListener();
    });

    return promise;
}

// check that url has been added to card after it is created
// this is done asynchronously a few ms later
function hrefReady(obj) {
    var promise = new Promise(function(resolve,reject) {
        var inc = 40;
        var hrefListener = function(interval) {
            if (obj.getAttribute('href') != undefined) {
                resolve(obj.getAttribute('href'));
            } else {
                interval = interval + 1 || 1;
                if (interval < inc) {
                    setTimeout(function() { hrefListener(interval); }, 100);
                } else {
                    reject('Href timeout error');
                }
            }
        };
        hrefListener();
    });

    return promise;
}

function addClassToArray(arr,klass) {
    var len = arr.length
    for (var i=0; i < len; i++) {
        var obj = arr[i];
        if (!hasClass(obj, klass)) {
            obj.className = obj.className + ' ' + klass;
        }
    };
}

function addStyleToArray(arr,attribute,style) {
    var len = arr.length;
    for (var i=0; i < len; i++) {
        var obj = arr[i];
        obj.style[attribute] = style;
    }
}

function boldifyCardids() {
    arr = getByClass('trello-card-numbers-inline');
    var len = arr.length;
    for (var i=0; i < len; i++) {
        var obj = arr[i];
        obj.style.fontWeight = 'bold';
    }
}

function addClassWithDisplay(selector, newClass, display, callback) {
    return function() {
        var objects = getByClass(selector);
        addClassToArray(objects, newClass);
        objects = getByClass(newClass);
        addStyleToArray(objects, 'display', display);
        chrome.storage.sync.get(function(items) {
            if (selector == CARD_SHORT_ID) {
                if (items.boldId) {
                    addStyleToArray(objects, 'fontWeight', 'bold');
                }
                if (items.idColor) {
                    addStyleToArray(objects, 'color', '#' + items.idColor);
                }
            }
        });
        if (callback) {
            callback(selector);
        }
    };
}

function addTrailingSpace(selector) {
    var objects = getByClass(selector);
    var len = objects.length
    for (var i=0; i < len; i++) {
        var obj = objects[i];
        obj.innerHTML = obj.innerHTML + ' ';
    };
}


function hasClass(target, className) {
    className = ' ' + className + ' ';
    if (target.className) {
        return (' ' + target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1
    }
    return false;
}

function getByClass(name) {
    return document.getElementsByClassName(name);
}

function getAncestorBySelector(elem, selector) {
    var node = elem;
    while (node.tagName != 'BODY') {
        if (hasClass(node, selector)) {
            return node;
        }
        if (node.parentNode !== 'undefined') {
            node = node.parentNode;
        } else {
            return null;
        }
    }
}

function getParentLink(elem) {
    var node = elem;
    while (node.tagName != 'BODY') {
        if (node.tagName === 'A') {
            return node.href;
        }
        if (node.parentNode !== 'undefined') {
            node = node.parentNode;
        } else {
            return null;
        }
    }
}

function getCardNumberFromUrl(url) {
    var title = url.split('/');
    var s = title[title.length-1];
    var num = s.substr(0,s.indexOf('-'));
    return num;
}

function addNumberToLightboxWhenReady(cardNumber) {
    lightboxReady().then(function() {
        // if/else needed to handle multiple promises
        var header = getByClass(TCN_HEADER);
        if (header.length > 0) {
            header.innerHTML = cardNumber;
        } else {
            var obj = getByClass(LIGHTBOX_SELECTOR)[0];
            var h2 = document.createElement('h2');
            h2.className = TCN_HEADER + ' quiet';
            h2.style.display = 'inline-block';
            h2.style.marginRight = '10px';
            h2.innerHTML = '<span>' + cardNumber + '</span>';
            obj.insertBefore(h2, obj.lastChild);

            chrome.storage.sync.get(function(items) {
                if (items.showCopy == true) {
                    var copyButton = getByClass("button-link js-copy-card")[0];

                    var copyDetailsButton = document.createElement('a');
                    copyDetailsButton.className = 'button-link';
                    copyDetailsButton.href = '#';
                    copyDetailsButton.onclick = function() {
                        var cardText = getByClass('js-card-detail-title-input')[0].value;

                        // Ew....
                        // Source http://stackoverflow.com/a/18455088
                        var copyFrom = document.createElement("textarea");
                        copyFrom.textContent = cardNumber.trim() + ", " + cardText; // Unsure if its ok to refer to cardNumber from params.
                        document.body.appendChild(copyFrom);
                        copyFrom.select();
                        document.execCommand('copy');
                        document.body.removeChild(copyFrom);
                    };
                    copyDetailsButton.innerHTML = '<span class="icon-sm icon-card"></span>&nbsp;Copy details</a>';
                    copyButton.parentNode.insertBefore(copyDetailsButton, copyButton.nextSibling);
                }
            });
        }
    }, function (err) {
        null;
    });
}

function urlMatch(regex, url) {
    if (url === undefined) { return false };
    var matches = url.match(regex);
    return matches != null && matches.length !== 0;
}

window.addEventListener('load', function() {
    var showListNumbers = addClassWithDisplay(LIST_NUM_CARDS_CLASS, TCN_INLINE_BLOCK, 'inline-block', null);
    showListNumbers();
    var showCardIds = addClassWithDisplay(CARD_SHORT_ID, TCN_INLINE, 'inline', addTrailingSpace);
    showCardIds();

    // show card numbers after card is inserted
    var target = document.querySelector('body');
    var config = { attributes: true, childList: true, subtree: true, characterData: true }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                var node = mutation.addedNodes[0];
                var classes = node.classList;
                if (node.classList) {
                    if (hasClass(node, SEARCH_RESULT_CARD) || hasClass(node, CARD_SHORT_ID)) {
                        showCardIds();
                    } else if (hasClass(node, 'list-card') && hasClass(node, 'js-member-droppable')) {
                        showCardIds();
                        var card = node.querySelectorAll(CARD_LINK_QUERY_SELECTOR)[0];
                        var duplicateCheck = node.querySelectorAll(CARD_SHORT_ID_SELECTOR).length > 0;
                        if (card.getAttribute('href') == undefined && !duplicateCheck) {
                            hrefReady(card).then(function(href) {
                                var cardTitle = card.innerHTML;
                                var shortId = document.createElement('span');
                                shortId.innerHTML = '#' + getCardNumberFromUrl(href) + ' ';
                                shortId.className = 'card-short-id hide trello-card-numbers-inline trello-card-numbers-inline';
                                card.insertBefore(shortId, card.firstChild);
                            }, function(err) {
                                console.error(err);
                            });
                        }
                    } else if (classes.contains('list')) {
                        showListNumbers();
                    }
                }
            }
        });
    });

    observer.observe(target,config);

    // add card number to card details lightbox
    var id; // must set outside so each click overwrites the last id stored
    document.body.addEventListener('mouseup', function(e) {
        var link = getParentLink(e.target);
        if (urlMatch(BOARD_URL_REGEX, link) && link !== window.location.href) {
            setTimeout(function() { showListNumbers(); showCardIds(); }, 1000);
        }

        var listCard =  getAncestorBySelector(e.target, 'list-card-details') || getAncestorBySelector(e.target, SEARCH_RESULT_CARD);
        if (listCard) {
            var cardId = listCard.querySelectorAll(CARD_SHORT_ID_SELECTOR)[0];
            if (cardId) {
                id = cardId.innerHTML;
                addNumberToLightboxWhenReady(id);
            }
        }
    }, true);


    var pageUrl = document.location.href;
    if (urlMatch(CARD_URL_REGEX, pageUrl)) {
        var num = '#' + getCardNumberFromUrl(pageUrl);
        addNumberToLightboxWhenReady(num);
    }
}, false);
