// ==UserScript==
// @name         MixesDB Userscripts Helper (by MixesDB)
// @author       User:Martin@MixesDB (Subfader@GitHub)
// @version      2025.01.01.4
// @description  Change the look and behaviour of the MixesDB website to enable feature usable by other MixesDB userscripts.
// @homepageURL  https://www.mixesdb.com/w/Help:MixesDB_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1293952534268084234
// @updateURL    https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/MixesDB_Userscripts_Helper/script.user.js
// @downloadURL  https://raw.githubusercontent.com/mixesdb/userscripts/refs/heads/main/MixesDB_Userscripts_Helper/script.user.js
// @require      https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://cdn.rawgit.com/mixesdb/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/mixesdb/userscripts/refs/heads/main/includes/global.js?v-MixesDB_Userscripts_Helper_6
// @match        https://www.mixesdb.com/*
// @noframes
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * User settings
 * You need to set these on each update, but updates happen rarely for this script
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Apple Music settings
 */
// Apple Music links: force to open in browser?
// Keep 0 to use open the Music app
// Set 1 to open as normal browser tab on beta.music.apple.com (recommended)
const appleMusic_linksOpenInBrowser = 1; // default: 0

// Your Apple Music counry code, e.g. "de"
// All country codes: https://www.hiresedition.com/apple-music-country-codes.html
const appleMusic_countryCode_switch = "de"; // default: ""

/*
 * TrackId.net settings
 */
// Submit player URLs to the TID request form
// * On Explorer mix results add an icon to the title bar
// * On mix page title icons change the TID icon URL
// Set 0 to disable
const trackIdnet_addRequestSubmissionIcon = 1; // default: 1

/*
 * Apple Podcasts settings
 */
// Add search icons for Apple Podcasts to mix page title icons and Explorer mix results
// Set 0 to disable
const applePodcasts_addSearchIcons = 1; // default: 1

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Load @ressource files with variables
 * global.js URL needs to be changed manually
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var dev = 0,
    cacheVersion = 1,
    scriptName = "MixesDB_Userscripts_Helper",
    repo = ( dev == 1 ) ? "Subfader" : "mixesdb",
    pathRaw = "https://raw.githubusercontent.com/" + repo + "/userscripts/refs/heads/main/";

//loadRawCss( pathRaw + "includes/global.css?v-" + scriptName + "_" + cacheVersion );
loadRawCss( pathRaw + scriptName + "/script.css?v-" + cacheVersion );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Basic functions
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// getKeywordsFromTitle
function getKeywordsFromTitle( titleWrapper ) {
    return normalizeTitleForSearch( titleWrapper.text() );
}

// get applePodcastsSearchLink
function getApplePodcastsSearchLink( className, keywords ) {
    var applePodcastsSearchUrl = "https://podcasts.apple.com/us/search?term="+encodeURIComponent( keywords );
    return '<a class="'+className+' applePodcastsSearch" href="'+applePodcastsSearchUrl+'" title="Search \''+keywords+'\’ in Apple Podcasts" target="_blank"><img src="https://www.mixesdb.com/w/images/a/ad/Apple_Podcasts_logo.svg" alt="Apple Podcasts icon"/></a>';
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * TrackId.net functions
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// fixRequestPlayerUrl
function fixRequestPlayerUrl( url ) {
    return url.replace( "www.youtu.be", "youtu.be" );
}

// tidLinkFromUrl
function tidLinkFromUrl( requestPlayerUrl, keywords ) {
    var urlFixed = fixRequestPlayerUrl( requestPlayerUrl ),
        domain = new URL( urlFixed ).hostname.replace("www.",""),
        cont = false;

    //logVar( "domain", domain );

    if( domain == "soundcloud.com" || domain == "mixcloud.com" || domain == "youtube.com" || domain == "youtu.be" || domain == "hearthis.at" ) {
        cont = true;
    }

    if( cont ) {
        var tidUrl = "https://trackid.net/submitrequest?requestUrl="+encodeURIComponent( urlFixed )+"&keywords="+encodeURIComponent( keywords ),
            tidLogo = '<img class="op05" src="https://www.mixesdb.com/w/images/3/3c/trackid.net.png" alt="TrackId.net Logo">',
            link = '<a class="explorerTitleIcon tidSubmit" href="'+tidUrl+'" title="Submit '+urlFixed+' on TrackId.net" target="_blank" style="display:none">'+tidLogo+'</a>';
        return link;
    } else {
        log( domain + " cannot be requested on TrackId.net" );
        return false;
    }
}

// triggerVisiblePlayer
function triggerVisiblePlayer( wrapper ) {
    var firstPlayerVisible = $(".playerWrapper.on-explorer:visible", wrapper).first(),
        playerUrl = firstPlayerVisible.attr("data-playerurl"),
        keywords = getKeywordsFromTitle( $(".explorerTitleLink", wrapper) );

    log( playerUrl );
    //logVar( "keywords", keywords );

    if( playerUrl && keywords ) {
        var tidLink = tidLinkFromUrl( playerUrl, keywords );
        if( tidLink ) {
            log( "Adding TID link for " + playerUrl );
            $(".explorerTitle .greylinks", wrapper).prepend( tidLink );
            $(".tidSubmit", wrapper).fadeIn( msFadeSlow );
        } else {
            log( "Skipped." );
        }
    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Mix page title icons and Explorer title icons fpr
 ** TrackId.net request submission
 ** Apple Podcasts search
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
logFunc( "Quicker Submit Request" );

d.ready(function(){ // needed for mw.config

    // Prepare variables to check if we're on a mix page etc.
    var actionView =  $("body").hasClass("action-view") ? true : false,
        wgNamespaceNumber = mw.config.get("wgNamespaceNumber"),
        wgTitle = mw.config.get("wgTitle"),
        wgPageName = mw.config.get("wgPageName");

    // On mix pages
    if( actionView && wgNamespaceNumber==0 && wgTitle!="Main Page" ) {
        log( "Criteria for mix page matched." );

        // TrackId.net link icon
        // On click add request page url for the first visible player
        if( trackIdnet_addRequestSubmissionIcon ) {
            $("#pageIconPlayers.trackIdNet").click(function(){
                var linkIcon = $("#pageIcons a.trackIdNet");

                // Prevent URLs from adding up after 1st click
                // otherwise the URLs add up and on 2nd click more than 2 tabs open
                var hrefOrig = linkIcon.attr("data-hreforig");
                linkIcon.attr("href", hrefOrig);

                // On click
                var urlSearch = linkIcon.attr("href").replace(/ /g,"%20"),
                    requestPlayerUrl = $(".playerWrapper:visible[data-playerurl]").first().attr("data-playerurl"), // first visible player
                    keywords = (new URL(urlSearch)).searchParams.get('keywords');
                logVar( "urlSearch", urlSearch );
                logVar( "keywords", keywords );

                if( requestPlayerUrl ) {
                    log( "requestPlayerUrl: " + requestPlayerUrl );

                    // change pageIcon URL only if supported domains
                    var tidLink_possible = tidLinkFromUrl( requestPlayerUrl, keywords );
                    if( tidLink_possible ) {
                        var urlFixed = fixRequestPlayerUrl( requestPlayerUrl ),
                            urlRequest = "https://trackid.net/submitrequest?requestUrl="+urlFixed+"&keywords="+keywords;

                        linkIcon.attr("href", urlRequest).attr("data-hreforig", urlSearch);

                        log( "URL changed to: " + multiUrl );
                    }
                } else {
                    log( "No first player URL found" );
                }
            });
        } else {
            log( "trackIdnet_addRequestSubmissionIcon diabled." );
        }

        // Apple Podcast search icon
        if( applePodcasts_addSearchIcons ) {
            var keywords = getKeywordsFromTitle( $("#firstHeading .mw-page-title-main") ),
                applePodcastsSearchLink = getApplePodcastsSearchLink( "pageIcon", keywords );

            if( applePodcastsSearchLink ) $("#pageIcons").prepend( applePodcastsSearchLink );
        } else {
            log( "applePodcasts_addSearchIcons diabled." );
        }

    } else {
        log( "Criteria for mix page not matched." );
    }

    // On MixesDB:Explorer/Mixes
    if( actionView && wgNamespaceNumber==4 && wgPageName=="MixesDB:Explorer/Mixes" ) {
        log( "Criteria for MixesDB:Explorer/Mixes matched." );

        // TrackId.net link icon
        // Initially on each result wrapper
        if( trackIdnet_addRequestSubmissionIcon ) {
            $(".explorerResult").each(function(){
                triggerVisiblePlayer( this );
            });

            // When a player tab is clicked
            $(".MultiToggleLinks a").click(function(){
                var wrapper = this.closest(".explorerResult");

                // Remove possible previous TID link
                $(".tidSubmit", wrapper).remove();

                // wait until displayed after click
                setTimeout(function() {
                    triggerVisiblePlayer( wrapper );
                }, msWaitToggle );
            });
        } else {
            log( "trackIdnet_addRequestSubmissionIcon diabled." );
        }

        // Apple Podcasts search link icon
        if( applePodcasts_addSearchIcons ) {
            $(".explorerTitle").each(function(){
                var wrapper = this,
                    keywords = getKeywordsFromTitle( $(".explorerTitleLink", wrapper) ),
                    applePodcastsSearchLink = getApplePodcastsSearchLink( "explorerTitleIcon", keywords );

                if( applePodcastsSearchLink ) $(".greylinks", wrapper).prepend( applePodcastsSearchLink );
            });
        } else {
            log( "applePodcasts_addSearchIcons diabled." );
        }
    } else {
        log( "Criteria for MixesDB:Explorer/Mixes not matched." );
    }
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Change Apple Music links on tracks
 * Force link to open in browser instead of the Music app
 * Change URL to Apple Music Beta and custom country code
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

waitForKeyElements(".aff-iconlink.AppleMusic:not(.processed-userscript)", waitAppleMusicLinks);
waitForKeyElements(".aff-details-toprow-iTunesTitle a:not(.processed-userscript)", waitAppleMusicLinks);

function waitAppleMusicLinks(jNode) {
    jNode.addClass("processed-userscript");

    // https://music.apple.com/us/album/lunch/1739659134?i=1739659140&uo=4&app=music&at=1000l5EX
    // https://music.apple.com/de/search?at=1000l5EX&term=Floating%20Points%20Fast%20Foward
    var item_url = jNode.attr("href");

    // force link to open in browser
    logVar( "appleMusic_linksOpenInBrowser", appleMusic_linksOpenInBrowser );
    if( appleMusic_linksOpenInBrowser == 1 ) {
        // remove URL parameter app=music
        // album links have the app parameter by default, search links do not
        item_url = item_url.replace( "&app=music", "&app=browser" );

        // switch to beta (necessary to bypass Music app)
        item_url = item_url.replace( "music.apple.com", "beta.music.apple.com" );
    }

    // override country code
    logVar( "appleMusic_countryCode_switch", appleMusic_countryCode_switch );

    if( appleMusic_countryCode_switch != "" ) {
        item_url = item_url.replace( /music.apple.com\/..\//g, "music.apple.com/"+appleMusic_countryCode_switch+"/" );
    }

    // prepare url for switch
    if( appleMusic_linksOpenInBrowser == 1 || appleMusic_countryCode_switch != "" ) {
        jNode.attr( 'href', item_url );
    }

    // ensure link opens in new tab
    if( appleMusic_linksOpenInBrowser == 1 ) {
        jNode.click(function(e) {
            var url_open = item_url;
            log("click: " + url_open );
            e.preventDefault();
            window.open( url_open );
        });
    }
}