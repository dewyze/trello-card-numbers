const DEFAULT_COLOR = "000000"
const DEFAULT_BOLD = false
const DEFAULT_SHOW_COPY = false
const DEFAULT_COPY_PREFIX = ""
const DEFAULT_COPY_SEP = ", "
const DEFAULT_COPY_SUFFIX = ""

function save_options() {
    var bold = document.getElementById('bold').checked;
    var color = document.getElementById('id-color').value;
    var copy = document.getElementById('show-copy').checked;
    var pref = document.getElementById('copy-prefix').value;
    var sep = document.getElementById('copy-sep').value;
    var suff = document.getElementById('copy-suffix').value;
    chrome.storage.sync.set({
        boldId: bold,
        idColor: color,
        showCopy: copy,
        copyPrefix: pref,
        copySep: sep,
        copySuffix: suff
    }, function() {
        window.close();
    });
}

function reset_defaults() {
    document.getElementById('bold').checked = DEFAULT_BOLD;
    document.getElementById('show-copy').checked = DEFAULT_SHOW_COPY;
    document.getElementById('id-color').color.fromString("#"+DEFAULT_COLOR);
    document.getElementById('copy-prefix').value = DEFAULT_COPY_PREFIX;
    document.getElementById('copy-sep').value = DEFAULT_COPY_SEP;
    document.getElementById('copy-suffix').value = DEFAULT_COPY_SUFFIX;
}

function restore_options() {
    chrome.storage.sync.get({
        boldId: DEFAULT_BOLD,
        showCopy: DEFAULT_SHOW_COPY,
        idColor: DEFAULT_COLOR,
        copyPrefix: DEFAULT_COPY_PREFIX,
        copySep: DEFAULT_COPY_SEP,
        copySuffix: DEFAULT_COPY_SUFFIX
    }, function(items) {
        document.getElementById('bold').checked = items.boldId;
        document.getElementById('show-copy').checked = items.showCopy;
        document.getElementById('id-color').color.fromString(items.idColor);
	    document.getElementById('copy-prefix').value = items.copyPrefix;
	    document.getElementById('copy-sep').value = items.copySep;
	    document.getElementById('copy-suffix').value = items.copySuffix;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('defaults').addEventListener('click', reset_defaults);
