/*global Zepto, chrome, document, navigator*/
/*global translateMath, maybeUnescape, shouldUnescape*/

(function() {
    const $ = Zepto;
    const copySourceElemSelector = '#translation_container #action_copy_source';
    const isMac = (/mac/i).test(navigator.platform);

    // Catch the keyboard shortcut specified in manifest
    chrome.runtime.onMessage.addListener(function(message) {
        switch (message.action) {
        case 'translate-math':
            $('#translate_math').click();
            break;
        default:
            break;
        }
    });

    // Catch and block the Crowdin default keyboard shortcut
    // NOTE: We could actually just press our button here
    // but using chrome.commmands in manigest allows
    // users to customize the Keyboard shortcut
    // NOTE2: This will obviously not work if user customized
    // their Crowdin shortcut for "Copy Source"
    $(document).on('keydown', function(e) {
        // Alt+C for Linux and Win
        // Ctrl+C for Mac
        if (e.code === 'KeyC' && (
            (!isMac && e.altKey && !e.ctrlKey && !e.shiftKey) ||
           (isMac && e.ctrlKey && !e.altKey && !e.shiftKey) )) {
            e.stopImmediatePropagation();
        }
    });

    // Users need to set the lang manually in plugin options!
    // Here we send a message to background.js to open Options
    const openOptions = function() {
        chrome.runtime.sendMessage({'action': 'openOptionsPage'});
    };

    const getLocale = function(cb) {

        /**
         * Auxiliary function, calling callback
         * once we have the locale from options
         * or open options if language is not set.
         *
         * @param {object} result from options page
         * @return {undefined}
         */
        function onGet(result) {
            const lang = result.locale;
            if (lang && lang != 'dec-comma') {
                cb(lang);
            } else {
                openOptions();
            }
        }

        chrome.storage.sync.get({'locale': null}, onGet);
    };


    // This is needed since TA deals only with unescaped strings,
    // so we need to escape them afterwards. Equivalent code is part of
    // escapeTranslationIfSourceIsEscaped() in KA codebase JiptInterface
    const ESCAPED = {'\n': '\\n', '\t': '\\t', '\r': '\\r', '\\': '\\\\'};
    const escapeCrowdinString = function(str) {
        return str.replace(/[\n\t\r\\]/g, function(sequence) {
            return ESCAPED[sequence];
        });
    };

    const initializePlugin = function() {

        // Create a new button
        // TODO: Move this code to a separate function createButton(parenElem);
        const $translateMathBtn =
            $('<button id="translate_math" tabindex="-1" class="btn btn-icon">'
            + '<i class="static-icon-copy"></i></button>');
        let shortcut;
        if (isMac)
            shortcut = ' (Ctrl+C)';
        else
            shortcut = ' (Alt+C)';
        const title = `Copy Source & Translate Math ${shortcut}`;
        $translateMathBtn.attr('title', title);
        const commaURL = chrome.runtime.getURL('5commastyle.gif');
        $translateMathBtn.css('background',
            `url("${commaURL}") 3px 7px no-repeat`);

        // The original button
        const $copySourceBtn = $(copySourceElemSelector);
        // Translation area
        const $translation = $('#translation');

        // Append our button
        const $menu = $copySourceBtn.parent();
        $menu.append($translateMathBtn);

        // Default keyboard shortcut now clicks our new button instead
        // so change the title of the original button (remove shortcut)
        $copySourceBtn.attr('title', 'Copy Source');

        const copyAndTranslateMath = function(lang) {
            // Click the original button
            $copySourceBtn.click();

            /**
             * This is where we actually translate math
             * by calling a helper function from Translation Assistant
             *
             * @param {string} math math string (inside $ $)
             * @param {string} offset position in the whole string (not used)
             * @param {string} fullString not used
             * @returns {string} translated math string
             */
            function translateMathWrapper(
                // eslint-disable-next-line no-unused-vars
                math, offset, fullString) {
                const template = null;
                return translateMath(math, template, lang);
            }

            const sourceString = $translation.val();
            // Unescape string to pass to Translation Assistant
            // (as happens in the Khan Translation Editor)
            // Here we again use the actual code from KA codebase
            // defined in jipt_hack.js
            let translatedString = maybeUnescape(sourceString);

            // Copied over from translation-assistant.js
            const mathRegex = /\$(\\\$|[^$])+\$/g;
            translatedString =
                translatedString.replace(mathRegex, translateMathWrapper);

            // Now we need to escape,
            // but only if the source was previously unescaped
            if (shouldUnescape(sourceString)) {
                translatedString = escapeCrowdinString(translatedString);
            }
            $translation.val(translatedString).trigger('input');
        };

        const checkLocale = function() {
            getLocale(copyAndTranslateMath);
        };

        $translateMathBtn.on('click', checkLocale);
    };

    /**
     * Crowdin window is generated dynamically
     * so we need to wait for the parent element to be built
     *
     * @param {string} selector used to append the new button
     * @param {function} cb callback to initialize the plugin
     * @returns {undefined}
     */
    const whenElemIsReady = function(selector, cb) {
        if ($(selector).length > 0) {
            cb();
        } else {
            setTimeout(function() {
                whenElemIsReady(selector, cb);
            }, 100);
        }
    };

    whenElemIsReady(copySourceElemSelector, initializePlugin);
})();
