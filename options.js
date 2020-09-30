/*global chrome, document*/

/**
 * Saves options to chrome.storage
 *
 * This code is mostly copy-pasta from Chrome documentation example
 * https://developer.chrome.com/extensions/options
 *
 * @returns {undefined}
 */
function saveOptions() {
    const locale = document.getElementById('locale').value;
    chrome.storage.sync.set({
        locale: locale,
    }, function() {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 1500);
    });
}

/**
 * Restores select box and checkbox state on options page
 * using the preferences stored in chrome.storage.
 *
 * @returns {undefined}
 */
function restoreOptions() {
    chrome.storage.sync.get({
        locale: 'not-set',
    }, function(items) {
        document.getElementById('locale').value = items.locale;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
