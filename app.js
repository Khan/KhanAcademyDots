(function () {

    var ESCAPED = { "\n": "\\n", "\t": "\\t", "\r": "\\r", "\\": "\\\\" };
    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';
    var lang = 'dec-comma';
    // Users need to set the lang manually in plugin options!
    chrome.storage.sync.get(['locale'], function(result) {
         lang = result.locale;
    });

    var whenElemIsReady = function (selector, cb) {

        if ($(selector).length > 0) {
            cb();

        } else {
            setTimeout(function () {
                whenElemIsReady(selector, cb);
            }, 100)
        }
    };

    var translateMathWrapper = function (math, offset, fullString) {
       // From Translation Assistant (TA)
       return translateMath(math, lang);
    }

    var escapeCrowdinString = function (str) {
        return str.replace(/\\|\n|\t|\r/g, function (sequence) {
           return ESCAPED[sequence];
        });
    }

    var initializePlugin = function() {

        $menu = $(copySourceElemSelector).parent(),
            $changeFormatBtn = $('<button tabindex="-1" title="Copy Source & translate math notation" class="btn btn-icon"><i class="static-icon-copy"></i></button>'),
            $translation = $('#translation');

        $changeFormatBtn.css('background', 'url("http://www.glidetraining.com/wp-content/uploads/2015/03/5commastyle.gif") 3px 7px no-repeat');

        $menu.append($changeFormatBtn);

        function copyAndTranslateMathInTranslation() {
            $('#action_copy_source').click();
            var translatedString = $translation.val();
            // Unescape string to pass to TA (as happens in Khan Translation Editor)
            translatedString = maybeUnescape(translatedString);
            // translate math via TA
            translatedString = translatedString.replace(MATH_REGEX, translateMathWrapper);

            if(shouldUnescape($translation.val())) {
                translatedString = escapeCrowdinString(translatedString);
            }
            $translation.val(translatedString);
        }

        $changeFormatBtn.on('click', copyAndTranslateMathInTranslation);
        // Not sure if this works
        key('alt+a', copyAndTranslateMathInTranslation);
    };

    whenElemIsReady(copySourceElemSelector, initializePlugin);
})();
