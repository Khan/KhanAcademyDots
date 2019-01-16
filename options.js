// Saves options to chrome.storage
// DH: This code is basically copied from Chrome documentation example
function save_options() {
  var locale = document.getElementById('locale').value;
  chrome.storage.sync.set({
    locale: locale,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    locale: 'dec-comma',
  }, function(items) {
    document.getElementById('locale').value = items.locale;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
