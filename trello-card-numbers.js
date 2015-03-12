var LIGHTBOX_SELECTOR = ".window-title.card-detail-title.non-empty.u-inline.editable";
var LINK_SELECTOR = "a.list-card-title.js-card-name";
var LIST_NUM_CARDS_SELECTOR = ".list-header-num-cards";
var CARD_SHORT_ID = ".card-short-id";
var TCN_HEADER = "trello-card-numbers-detail-header";
var TCN_NUM_SHOW = "trello-card-numbers-show";
var TCN_INLINE_BLOCK = "trello-card-numbers-inline-block";

function classify(name) {
  return "." + name;
}

// ensure lightbox is loaded before adding to it
function detailsReady(id) {
    var dfd = jQuery.Deferred();

    var inc = 40;
    var detailsListener = function(interval) {
      if ($(LIGHTBOX_SELECTOR).length != 0) {
            dfd.resolve($(LIGHTBOX_SELECTOR).length != 0);
        } else {
            interval = interval + 1 || 1;
            if (interval < inc) {
                setTimeout(function() { detailsListener(interval); }, 100);
            } else {
                dfd.reject("Column Title timeout error");
            }
        }
    };
    detailsListener();

    return dfd.promise();
}

// check that url has been added to card after it is created
// this is done asynchronously a few ms later
function hrefReady(obj) {
    var dfd = jQuery.Deferred();
    var inc = 40;
    var hrefListener = function(interval) {
      if (obj.attr("href") !== undefined) {
            dfd.resolve(obj.attr("href"));
        } else {
            interval = interval + 1 || 1;
            if (interval < inc) {
                setTimeout(function() { hrefListener(interval); }, 100);
            } else {

                dfd.reject("Href timeout error");
            }
        }
    };
    hrefListener();

    return dfd.promise();
}

function log(data) {
    console.log(data);
}

$(document).ready(function() {
    // show card numbers initially, this script is activated after everything is loaded
    $(LIST_NUM_CARDS_SELECTOR).addClass(TCN_INLINE_BLOCK);
    $(classify(TCN_INLINE_BLOCK)).css("display","inline-block");
    $(CARD_SHORT_ID).addClass(TCN_NUM_SHOW);
    $(classify(TCN_NUM_SHOW)).show();

    // needed for switching boards
    $(document).on("DOMNodeInserted",".list", function() {
        $(LIST_NUM_CARDS_SELECTOR).addClass(TCN_INLINE_BLOCK);
        $(classify(TCN_INLINE_BLOCK)).css("display","inline-block");
    })

    // show card numbers after card is inserted
    $(document).on("DOMNodeInserted",".list-card.js-member-droppable", function() {
        $(CARD_SHORT_ID).addClass(TCN_NUM_SHOW);
        $(classify(TCN_NUM_SHOW)).show();

        // get card number for new cards using URL and add it to card-short-id
        card = $(this).find(LINK_SELECTOR);
        if (card.attr("href") === undefined) {
            hrefReady($(this).find(LINK_SELECTOR)).then( function(href) {
                var title = href.split("/");
                var s = title[title.length-1];
                var num = s.substr(0,s.indexOf("-"));
                card.find(CARD_SHORT_ID).html("#" + num + " ");
            });
        }
    });

    // add card number to card details lightbox
    $("body").on("click mouseup","div.list-card-details.u-clearfix", function() {
        var id = $(this).find(CARD_SHORT_ID).html();
        detailsReady(id).then(function() {

            // if/else needed to handle multiple promises
            var obj = $(LIGHTBOX_SELECTOR);
            if ($(classify(TCN_HEADER)).length > 0) {
                $(TCN_HEADER).html(id);
            } else {
                obj.prepend("<h2 class='" + TCN_HEADER + " quiet'>" + id + "</h2>");
            }
        });
    });
});
