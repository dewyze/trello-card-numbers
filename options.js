// Saves options to chrome.storage.sync.
function save_options() {
    var bold = document.getElementById('bold').checked;
    var color = document.getElementById('id-color').value;
    var copy = document.getElementById('copy').checked;
    chrome.storage.sync.set({
        boldId: bold,
        idColor: color,
        rightClickCopy: copy
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        boldId: false,
        idColor: "000000",
        rightClickCopy: true
    }, function(items) {
        document.getElementById('bold').checked = items.boldId;
        document.getElementById('id-color').value = items.idColor;
        document.getElementById('copy').checked = items.rightClickCopy;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
