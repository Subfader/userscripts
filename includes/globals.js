/*
 * Global vars
 */
var d = $(document),
	url = $(location).attr('href'),
	apiUrlTools = 'https://www.mixes.wiki/tools/api/api.php',
    TLbox = '<div class="Mixeswiki_WebTracklistsToCopy MixesDB_WebTracklistsToCopy" style="color:#f60; font-family:monospace,sans-serif; font-size:12px; margin-top:8px"></div><hr style="color:#ddd; margin-top:8px" /><p style="margin-top:8px; color:#f60; font-weight:bold">You still need to fix this in the <a href="https://www.mixes.wiki/tools/tracklist_editor/">Tracklist Editor</a></p>';


/*
 * Log functions
 */

// log
function log( text ) {
	console.log( debugFilter + ": " + text );
}

// logVar
function logVar( variable, string ) {
	if( string !== null ) {
		log( variable + ": " + string );
	} else {
		log( variable + " empty" );
	}
}

// logFunc
function logFunc( functionName ) {
	var seperator = "####################################";
	log( "\n"+ seperator +"\n# "+ functionName +"()\n"+ seperator );
}


/*
 * Create elements
 */

// create_input
function create_input( text, className ) {
	return '<input class="mixeswiki-element input '+ className +'" value="'+text+'" />';
}

// create_note
function create_note( text, className ) {
	return '<span class="mixeswiki-element note '+ className +'">'+text+'</span>';
}
