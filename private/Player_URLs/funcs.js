// Configure the preferred order for Player URLs when mode=mirrors is used.
// Add either a display label or any domain/host fragment that appears in the URL.
var preferredPlayerUrlOrder = [
    "Apple Podcasts",
    "SoundCloud",
    "YouTube",
    "Mixcloud"
];

var playerUrlSiteMatchers = {
    "Apple Podcasts": [ "podcasts.apple.com" ],
    "SoundCloud": [ "soundcloud.com" ],
    "YouTube": [ "youtube.com", "youtu.be" ],
    "Mixcloud": [ "mixcloud.com" ]
};

function playerUrlOrderIndex( url ) {
    var urlLower = url.toLowerCase(),
        orderLength = preferredPlayerUrlOrder.length,
        i,
        j,
        site,
        matchers;

    for( i = 0; i < orderLength; i++ ) {
        site = preferredPlayerUrlOrder[i];
        matchers = playerUrlSiteMatchers[site] || [ site ];

        for( j = 0; j < matchers.length; j++ ) {
            if( urlLower.indexOf( String( matchers[j] ).toLowerCase() ) != -1 ) {
                return i;
            }
        }
    }

    return orderLength;
}

function sortPlayerUrlsByPreferredOrder( urls ) {
    return urls
        .map(function( url, index ) {
            return {
                index: index,
                order: playerUrlOrderIndex( url ),
                url: url
            };
        })
        .sort(function( a, b ) {
            if( a.order != b.order ) {
                return a.order - b.order;
            }
            return a.index - b.index;
        })
        .map(function( item ) {
            return item.url;
        });
}

function playerHeaderWithVideoAudio( header ) {
    if( header.indexOf( "video=" ) == -1 ) {
        header = header.replace( /^{{Player((?:\|mode=[^|\n}]+)?)/, "{{Player$1|video=audio" );
    }
    return header;
}

function playerUrlLine( url, number ) {
    return " |" + ( url.indexOf( "=" ) == -1 ? "" : number + "=" ) + url;
}

function playerUrlValue( line ) {
    var match = line.match( /^ \|(?:\d+=)?(https?:\/\/.+)$/ );
    return match ? match[1] : "";
}

function newPlayerTemplate( url ) {
    return "{{Player|video=audio\n" + playerUrlLine( url, 1 ) + "\n}}";
}

function addUrlToPlayer( text, url ) {
    return text.replace( /{{Player[^}]*}}/, function( player ) {
        var lines = player.split( "\n" ),
            header = playerHeaderWithVideoAudio( lines.shift() ),
            urlLines = [],
            footerLines = [];

        if( lines.length == 0 ) {
            return header.replace( /^(\{\{Player)([^}]*)\|(?:1=)?(https?:\/\/.+)\}\}$/, function( match, templateStart, options, oldUrl ) {
                var urls = sortPlayerUrlsByPreferredOrder( [ url, oldUrl ] );
                if( options.indexOf( "mode=" ) == -1 ) {
                    options = "|mode=mirrors" + options;
                }
                header = playerHeaderWithVideoAudio( templateStart + options );
                return header + "\n" + urls.map(function( thisUrl, index ) {
                    return playerUrlLine( thisUrl, index + 1 );
                }).join( "\n" ) + "\n}}";
            });
        }

        lines.forEach(function( line ) {
            if( playerUrlValue( line ) ) {
                urlLines.push( line );
            } else {
                footerLines.push( line );
            }
        });

        if( header.indexOf( "mode=" ) == -1 && urlLines.length > 0 ) {
            header = header.replace( /^{{Player/, "{{Player|mode=mirrors" );
        }
        header = playerHeaderWithVideoAudio( header );

        urlLines = sortPlayerUrlsByPreferredOrder( [ url ].concat( urlLines.map( playerUrlValue ) ) ).map(function( thisUrl, index ) {
            return playerUrlLine( thisUrl, index + 1 );
        });

        return [ header ].concat( urlLines, footerLines ).join( "\n" );
    });
}
