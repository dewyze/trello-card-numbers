// ensure lightbox is loaded before adding to it
function detailsReady(id) {
    var dfd = jQuery.Deferred();

    var inc = 40;
    var detailsListener = function(interval) {
      if ($(".window-title.card-detail-title.non-empty.inline.editable").length != 0) {
            dfd.resolve($(".bt-card-details-number").length != 0);
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
    $(".list-header-num-cards").addClass("trello-card-numbers-inline-block");
    $(".trello-card-numbers-inline-block").css("display","inline-block");
    $(".card-short-id").addClass("trello-card-numbers-show");
    $(".trello-card-numbers-show").show();

    // needed for switching boards
    $(document).on("DOMNodeInserted",".list", function() {
        $(".list-header-num-cards").addClass("trello-card-numbers-inline-block");
        $(".trello-card-numbers-inline-block").css("display","inline-block");
    })

    // show card numbers after card is inserted
    $(document).on("DOMNodeInserted",".list-card.js-member-droppable", function() {
        $(".card-short-id").addClass("trello-card-numbers-show");
        $(".trello-card-numbers-show").show();

        // get card number for new cards using URL and add it to card-short-id
        card = $(this).find("a.list-card-title.clear.js-card-name");
        if (card.attr("href") === undefined) {
            hrefReady($(this).find("a.list-card-title.clear.js-card-name")).then( function(href) {
                var title = href.split("/");
                var s = title[title.length-1];
                var num = s.substr(0,s.indexOf("-"));
                card.find(".card-short-id").html("#" + num + " ");
            });
        }
    });

    // add card number to card details lightbox
    $("body").on("click mouseup","div.list-card-details.clearfix", function() {
        var id = $(this).find(".card-short-id").html();
        detailsReady(id).then(function() {

            // if/else needed to handle multiple promises
            var obj = $(".window-title.card-detail-title.non-empty.inline.editable");
            if ($(".trello-card-numbers-detail-header").length > 0) {
                $(".trello-card-numbers-detail-header").html(id);
            } else {
                obj.prepend("<h2 class='trello-card-numbers-detail-header quiet'>" + id + "</h2>");
            }
        });
    });
});
