(function(){

    function replaceDotsWithCommas(string) {
        return string.replace(/[0-9]+(\.)[0-9]+/g, function (val) {
            return val.replace('.', '{,}')
        })
    }

    var btnOK = setInterval(initializePlugin, 250);

    function initializePlugin() {

        var $ = Zepto,
            $menu = $('#translation_container #action_copy_source').parent(),
            $changeFormatBtn = $('<button tabindex="-1" title="Copy Source & change number format (Ctrl + Alt + N)" class="btn btn-icon"><i class="static-icon-copy"></i></button>'),
            $translation = $('#translation');

        if ($menu.length === 0) {
           return;
        }

        $changeFormatBtn.css('background', 'url("http://www.glidetraining.com/wp-content/uploads/2015/03/5commastyle.gif") 3px 7px no-repeat');

        $menu.append($changeFormatBtn);

        function copyAndReformatNumebrsInTranslation(){
            $('#action_copy_source').click();
            $translation.val(replaceDotsWithCommas($translation.val()));
        }

        $changeFormatBtn.on('click', copyAndReformatNumebrsInTranslation);
        key('alt+a', copyAndReformatNumebrsInTranslation);
        clearInterval(btnOK);
    }

})();
