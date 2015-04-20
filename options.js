function save_options() {
    var bold = document.getElementById('bold').checked;
    var color = document.getElementById('id-color').value;
    chrome.storage.sync.set({
        boldId: bold,
        idColor: color
    }, function() {
        window.close();
    });
}

function reset_defaults() {
    document.getElementById('bold').checked = false;
    document.getElementById('id-color').color.fromString("#000000");
}

function restore_options() {
    chrome.storage.sync.get({
        boldId: false,
        idColor: "000000"
    }, function(items) {
        document.getElementById('bold').checked = items.boldId;
        document.getElementById('id-color').color.fromString(items.idColor);
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('defaults').addEventListener('click', reset_defaults);
