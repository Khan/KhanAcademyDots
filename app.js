(function () {

    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';
    var replaceDotsWithCommas = function (string) {
        return string.replace(/[0-9]+(\.)[0-9]+/g, function (val) {
            return val.replace('.', '{,}')
        })
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

    var initializePlugin = function() {

        $menu = $(copySourceElemSelector).parent(),
            $changeFormatBtn = $('<button tabindex="-1" title="Copy Source & change number format (Ctrl + Alt + N)" class="btn btn-icon"><i class="static-icon-copy"></i></button>'),
            $translation = $('#translation');

        if ($menu.length === 0) {
            return;
        }

        $changeFormatBtn.css('background', 'url("http://www.glidetraining.com/wp-content/uploads/2015/03/5commastyle.gif") 3px 7px no-repeat');

        $menu.append($changeFormatBtn);

        function copyAndReformatNumebrsInTranslation() {
            $('#action_copy_source').click();
            $translation.val(replaceDotsWithCommas($translation.val()));
        }

        $changeFormatBtn.on('click', copyAndReformatNumebrsInTranslation);
        key('alt+a', copyAndReformatNumebrsInTranslation);
    };

    whenElemIsReady(copySourceElemSelector, initializePlugin);
})();
