## 2.1.0 (2015-09-04)
- Trello removed the DOM element for the `.card-short-id` and broke the extension, this is a fix.
- This parses the number from the URL instead and adds it in adds a new DOM element separate from the short id. In case they remove `.card-short-id` again, this should continue to work.
- It also adds the card count for newly created lists.

## 2.0.1 (2015-05-16)
- Trello removed trailing space from card id, this fix adds it back.

## 2.0 (2015-04-21)
- Add options page, bold numbers, and colored numbers

## 1.1.1 (2015-04-13)
- Fix bug where card title changes made number disappear.

## 1.1 (2015-03-18)
- Remove jquery.
- Add id to search results.
- Fix queuing bug where if lightbox does not open, first id clicked is display regardless of last id clicked.

## 1.0.2 (2015-03-11)
- Restore functionality preventing queueing of lightbox ids on card moves.

## 1.0.1 (2015-02-28)
- Updated css selectors due to trello change, refactor selectors into constants.

## 1.0 (2015-02-15)
- Updated card selector for number in lightbox.

## 0.11.0 (2014-09-03)
- Added icons.

## 0.1.0 (2014-08-30)
- Initial commits.
