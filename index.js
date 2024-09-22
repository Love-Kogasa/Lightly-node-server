const http = require( "http" ),
  { parse } = require( "url" ),
  fs = require( "fs" ),
  { join } = require( "path" ),
  mime = require( "mimetype" )
class Server {
    constructor( dirname = ".", cb = false ){
        var tags
        this.tags = tags = new Map()
        this.tags.set( "node", function( pn, res, req ){
            function toJs( jso ){
                if( typeof jso !== "object" && typeof jso !== "function" ){
                    return JSON.stringify( jso )
                } else if( typeof jso === "function" ){
                    return jso.toString()
                } else {
                    var rets = []
                    for( let key of Object.keys(jso) ){
                        rets.push( key + " : " + toJs( jso[key] ))
                    }
                    return "{" + rets.join(",") + "}"
                }
            }
            function require( mod ){
                var module = {}
                if( mod.indexOf( "./" ) === -1 ){
                    eval( fs.readFileSync( mod ).toString() )
                } else {
                    let dir = join( join( dirname, "node_modules" ), mod ),
                      { main } = JSON.parse(fs.readFileSync( join( dir, "package.json") ).toString())
                    eval( join( dir, main ))
                }
                return module.exports || module
            }
            var jsc = {}
            try {
                jsc = require( pn )
            } catch( err ) {
                jsc = require( "./" + pn )
            }
            return "var " + pn.split("/").slice(-1).join("").split(".")[0] + " = " + toJs(jsc)
        } )
        this.server = http.createServer( function( req, res ){
            try {
                var { pathname } = parse( req.url )
                if( cb ) cb( pathname, res, req )
                pathname = pathname.slice(-1) === "/" ? pathname + "index.html" : pathname
                res.setHeader( "Content-Type", mime.lookup( pathname ))
                if( !!(pathname.indexOf( ":" )+1) ){
                    try {
                        var tau = pathname.split( ":" ),
                          tpn = join( dirname, tau.slice(1).join(":") )
                        var path = fs.existsSync( tpn ) ? tpn : tau.slice(1)
                        res.end(tags.get( join( ".", tau[0] ) )( path, res, req ))
                    } catch( err ){
                        res.end( fs.readFileSync( join( dirname, pathname ) ))
                    }
                } else {
                    res.end( fs.readFileSync( join( dirname, pathname ) ))
                }
            } catch( err ) {
                res.end( err.toString() )
                console.error( err.toString() )
            }
        } )
    }
    listen( port, cb ){
        this.server.listen( port, cb )
        return this
    }
}

module.exports = { Server }