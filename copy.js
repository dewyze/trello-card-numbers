(function() {
    chrome.storage.sync.get(function(items) {
        if (items.rightClickCopy) {
            function copyTrelloCardId(data, tab) {
                var url = new URL(data.linkUrl);
                var matches = url.pathname.match(/^\/c\/([A-Z1-9]+)\//i);
                var cardId;

                if (matches !== null && matches[1] !== null) {
                    cardId = matches[1];
                    copyToClipboard(cardId);
                }
            }

            function copyToClipboard(data) {
                var node = document.createElement("textarea");
                node.innerText = data;
                document.body.appendChild(node);
                node.select();
                document.execCommand("copy");
                node.remove();
            }

            chrome.contextMenus.create({
                type: "normal",
                title: "Copy Card ID",
                contexts: ["link"],
                documentUrlPatterns: [
                    "https://trello.com/*"
                ],
                targetUrlPatterns: [
                    "https://trello.com/c/*"
                ],
                onclick: copyTrelloCardId
            });
        }
    });
})();
