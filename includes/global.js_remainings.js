/*
 * Remaining functions from MixesDB
 * that are not used yet as wel built from scratch
 */





// selectText
function selectText(element) {
	var text = document.getElementById(element),
		selection = window.getSelection(),
		range = document.createRange();
	range.selectNodeContents(text);
	selection.removeAllRanges();
	selection.addRange(range);
}

// selectInput
function selectInput(input) { //jump to end to see the ID
	input.val(input.val()).focus().select().addClass('mixesdb-inputSelected');
}

// selectUniqueInput
function selectUniqueInput() {
	var e = $(".mixesdb-input");
	e.focus();
	e.select();
	e.addClass('mixesdb-inputSelected');
}



// sortTextareaAlphabetically
function sortTextareaAlphabetically(t) {
    return t.split('\n').sort().join('\n');
}



// secondsToMin
function secondsToMin(s,pad) {
	var m = Math.floor(s/60);
	if( pad == 3 ) {
		if( m < 100 ) var m = "0" + m;
	}
	if( m < 10 ) var m = "0" + m;
	return m;
}

// secondsToHMS
function secondsToHMS(s) {
	var S = s, h = Math.floor(s/3600);
	s -= h*3600;
	var m = Math.floor(s/60);
	s -= m*60;
	var H = h+":";
	return H+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
}

// justText
jQuery.fn.justText = function() {
    return $(this).clone()
            .children()
            .remove()
            .end()
            .text();
};



$("input.selectOnClick").click(function(){
	$(this).focus();
	$(this).select();
	$(this).addClass('mixesdb-inputSelected');
});


/*
 * createEventCapturing()
 * jQuery.createEventCapturing(['play']);
 * jQuery('body').on('play', 'audio', function(){  });
 */
jQuery.createEventCapturing = (function () {
    var special = jQuery.event.special;
    return function (names) {
        if (!document.addEventListener) {
            return;
        }
        if (typeof names == 'string') {
            names = [names];
        }
        jQuery.each(names, function (i, name) {
            var handler = function (e) {
                e = jQuery.event.fix(e);

                return jQuery.event.dispatch.call(this, e);
            };
            special[name] = special[name] || {};
            if (special[name].setup || special[name].teardown) {
                return;
            }
            jQuery.extend(special[name], {
                setup: function () {
                    this.addEventListener(name, handler, true);
                },
                teardown: function () {
                    this.removeEventListener(name, handler, true);
                }
            });
        });
    };
})();


/*
 * linkify()
 */
function linkify( inputText ) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}


/*
 * escapeRegExp
 * Escape stzrings for RegExp http://stackoverflow.com/questions/2593637
 */
function escapeRegExp(string){
    if( typeof string != "undefined" ) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}


/*
 * YouTube url parser
 * returns 11 character ID
 * https://stackoverflow.com/questions/3452546
 */
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}







