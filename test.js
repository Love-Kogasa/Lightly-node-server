var {Server} = require( "./index" )
new Server( "./tspage" ).listen( 7074, () => console.log( "127.0.0.1:7074" ) )