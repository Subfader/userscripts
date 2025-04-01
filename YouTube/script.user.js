// ==UserScript==
// @name         YouTube (by MixesDB)
// @author       User:Martin@MixesDB (Subfader@GitHub)
// @version      2025.04.01.2
// @description  Change the look and behaviour of certain DJ culture related websites to help contributing to MixesDB, e.g. add copy-paste ready tracklists in wiki syntax.
// @homepageURL  https://www.mixesdb.com/w/Help:MixesDB_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1261652394799005858
// @updateURL    https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/YouTube/script.user.js
// @downloadURL  https://raw.githubusercontent.com/mixesdb/userscripts/refs/heads/main/YouTube/script.user.js
// @require      https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/includes/youtube_funcs.js
// @require      https://raw.githubusercontent.com/mixesdb/userscripts/refs/heads/main/includes/global.js?v-YouTube_5
// @require      https://raw.githubusercontent.com/mixesdb/userscripts/refs/heads/main/includes/toolkit.js?v-YouTube_5
// @include      http*youtube.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @noframes
// @run-at       document-end
// ==/UserScript==


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Load @ressource files with variables
 * global.js URL needs to be changed manually
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var dev = 0,
    cacheVersion = 9,
    scriptName = "YouTube",
    repo = ( dev == 1 ) ? "Subfader" : "mixesdb",
    pathRaw = "https://raw.githubusercontent.com/" + repo + "/userscripts/refs/heads/main/";

loadRawCss( pathRaw + "includes/global.css?v-" + scriptName + "_" + cacheVersion );
loadRawCss( pathRaw + scriptName + "/script.css?v-" + cacheVersion );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Initialize feature functions per url path
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Before anythings starts: Reload the page
 * Firefox on macOS needs a tiny delay, otherwise there's constant reloading
 */
redirectOnUrlChange( 200 );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Embed URL for copy-paste
 * Toolkit
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var ytId = getYoutubeIdFromUrl( url );

if( ytId ) {
    var playerUrl = "https://youtu.be/" + ytId;
    
    waitForKeyElements( "#bottom-row", function( jNode ) {
        var titleText = $("#title h1").text(),
            wrapper = jNode;

        // Thumbnail as linked image
        var thumbImg_url = 'https://i.ytimg.com/vi/'+ytId+'/maxresdefault.jpg',
            thumbImg = '<div class="mdb-element mdb-thumbImgLink-wrapper left0"><a href="'+thumbImg_url+'" target="_blank"><img src="'+thumbImg_url+'"></a></div>';

        wrapper.after( thumbImg );

        // Toolkit
        getToolkit( playerUrl, "playerUrl", "detail page", wrapper, "after", titleText, "link", 1, playerUrl );
    });
}