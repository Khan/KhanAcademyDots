(function () {
    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';

    // Users need to set the lang manually in plugin options!
    var openOptions = function () {
        chrome.runtime.sendMessage({"action": "openOptionsPage"});
    };

    var getLocale = function(cb) {

        function onGet(result) {
            var lang = result.locale;
            if (lang && lang != 'dec-comma') {
                cb(lang);
            } else {
                openOptions();
            }
        }

        chrome.storage.sync.get({'locale': null}, onGet);
    };

    var whenElemIsReady = function (selector, cb) {

        if ($(selector).length > 0) {
            cb();
        } else {
            setTimeout(function () {
                whenElemIsReady(selector, cb);
            }, 100)
        }
    };


    // This is needed since TA deals only with unescaped strings,
    // so we need to escape them afterwards. Equivalent code is part of 
    // escapeTranslationIfSourceIsEscaped() in KA codebase JiptInterface
    var ESCAPED = { "\n": "\\n", "\t": "\\t", "\r": "\\r", "\\": "\\\\" };
    var escapeCrowdinString = function (str) {
        return str.replace(/[\n\t\r\\]/g, function (sequence) {
           return ESCAPED[sequence];
        });
    }

    var initializePlugin = function() {

        $menu = $(copySourceElemSelector).parent();
        $changeFormatBtn = $('<button tabindex="-1" title="Copy Source & translate math notation" class="btn btn-icon"><i class="static-icon-copy"></i></button>');
        $translation = $('#translation');

        commaURL = chrome.runtime.getURL("5commastyle.gif");
        $changeFormatBtn.css('background', `url("${commaURL}") 3px 7px no-repeat`);
        $menu.append($changeFormatBtn);

        var copyAndTranslateMath = function(lang) {
            $('#action_copy_source').click();

            // This is where we actually translate math
            // by calling a helper function from Translation Assistant (TA)
            function translateMathWrapper(math, offset, fullString) {
                return translateMath(math, lang);
            }

            var source = $translation.val();
            // Unescape string to pass to TA (as happens in Khan Translation Editor)
            // Here we again use the actual code from KA codebase defined in jipt_hack.js
            var translatedString = maybeUnescape(source);
            // translate math via TA (MATH_REGEX is defined in TA as well)
            translatedString = translatedString.replace(MATH_REGEX, translateMathWrapper);

            // Now we need to escape, but only if the source was unescaped before
            if(shouldUnescape(source)) {
                translatedString = escapeCrowdinString(translatedString);
            }
            $translation.val(translatedString);
        }

        var checkLocale = function() {
            getLocale(copyAndTranslateMath);
        }

        $changeFormatBtn.on('click', checkLocale);
    };

    //Crowdin window is generated dynamically so we need to wait for the parent element to be built
    whenElemIsReady(copySourceElemSelector, initializePlugin);
})();
