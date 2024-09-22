My English is not well so if you didn't understand, I'm sorry  
# Lightly Node Server  
A lightweight Node.js module for creating a simple HTTP server. If you're working on a larger project, consider using `Express`
# Quickly Start  
```js
var {Server} = require( "light-node-server" )
new Server().listen(8080, () => console.log( "127.0.0.1:8080" ))
```
index.html
```html
<h1>lightly-node-server</h1>
```
visit 127.0.0.1:8080 you will see `lightly-node-server`
# Document
Class server   
-- constructor( path, cb )  
---- path : Your pages's root dir. Default is "."  
---- cb( pathname, res, req ) : Callback function when server be visit  
------ pathname : user visit's path  
-- listen( port, cb )  
---- as http.createServer(...).listen  
-- tags  
---- tags.set( tag, cb )  
------ tag : tagname  
------ cb( path, res, req ) : A callback function when a page has this tag and be request  
-------- path : user visit's file's path  
---- tags.get( tag )  
------ tag : tagname  
# Tag
Custom a tag for your special pages and nice function  
set a custom tag
```js
var server = new Server()
server.tags.set( "mytag", (fn) => "u are visiting " + fn )
server.listen(8080)
```
visit http://127.0.0.1:8080/mytag:index.html  
u will see `u are visiting index.html`
  
*node Tag*  
I made a `node` tag for run a js file as nodejs runtime code and use npm module in front-end  
Run test.js and visit http://127.0.0.1:7074/node:log.js  
You will see the `hello` on your terminal and `var log = {hello : () => console.log( "hello" )}` on your browser  
light-node-server/tspage/log.js  
```js
console.log( "hello" )
module.exports = {
    hello : () => console.log( "hello" )
}
```
if u want use an npm-module u can also node:xxx needn't node:node_modules/xxx/index.js
