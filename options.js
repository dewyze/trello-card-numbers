function save_options() {
    var bold = document.getElementById('bold').checked;
    var color = document.getElementById('id-color').value;
    chrome.storage.sync.set({
        boldId: bold,
        idColor: color
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
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
