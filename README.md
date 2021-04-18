# multiloader.js

Load multiple scripts into an HTML page.

Any script can also have multiple alternative sources - in case one fails, it can load from another source. 
Optional callback function is executed when all scripts finished loading.

```javascript
multiloader(  
      // these are alternative versions, only one of them loads:
  ['https://a.com/my1.js', 'https://b.com/my1.js', 'https://c.com/my1.js'],
      // this loads second:
  'https://a.com/my2.js', 
      // this loads third, 3 alternative versions, only one of them loads:
  ['https://a.com/my3.js', 'https://b.com/my3.js', 'https://c.com/my3.js'],
  // ... can load more
  () => console.log('All Loaded!') //optional     
)  
```
```javascript
// minimal, just load one script, the same as just:
// <script src="https://example.com/script.js"></script>
multiloader('https://example.com/script.js') 
```
```javascript
// load one script, with one alternative source
multiloader(['https://example1.com/script.js', 'https://example2.com/script.js']) 
```
