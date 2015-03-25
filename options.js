// Saves options to chrome.storage.sync.
function save_options() {
    var bold = document.getElementById('bold').checked;
    chrome.storage.sync.set({
        boldId: bold
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
    }, function(items) {
        document.getElementById('bold').checked = items.boldId;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
