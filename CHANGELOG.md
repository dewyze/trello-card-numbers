## 2.2.6 (2017-05-16)
- Add reload after 1 second when going to a new board.

## 2.2.5 (2017-05-11)
- Fix bug where '#' would not display when loading from URL
- Added an option for a "Copy details" button which copies the card title to the clipboard
- Add number when opening card directly
- Add logo

## 2.2.4 (2016-05-14)
- Change lightbox card number to block style to deal with Trello DOM changes.

## 2.2.3 (2015-11-28)
- Change lightbox card number to inline style.
- Change lightbox card number css selectors.

## 2.2.2 (2015-10-14)
- Add check for duplicate card short id to accommodate Trello DOM change.
- Remove extra console.log that was left in.

## 2.2.1 (2015-10-08)
- Trello no longer includes the card-short-id span on card creation, so card numbers were not appearing. This adds them back in.
- Do not add a class if it already present.

## 2.2.0 (2015-09-13)
- Trello reverted the removal of 'card-short-id'. This version reverts to the old behavior to fix some bugs that were introduced when they brought it back.

## 2.1.0 (2015-09-04)
- Trello removed the DOM element for the `.card-short-id` and broke the extension, this is a fix.
- - This parses the number from the URL instead and adds it in adds a new DOM element separate from the short id. In case they remove `.card-short-id` again, this should continue to work.
- - It also adds the card count for newly created lists.

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
