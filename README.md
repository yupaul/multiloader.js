# multiloader.js

Load multiple scripts into a HTML page.

Any script can have also have multiple alternative sources, in case one fails, loading from another source. 
Optional callback function is executed when all scripts finished loading.

```javascript
multiloader(  
  ['https://a.com/my1.js', 'https://b.com/my1.js', 'https://c.com/my1.js'], // these are alternative versions, only one loads
  'https://a.com/my2.js', //this loads 2nd  
  ['https://a.com/my3.js', 'https://b.com/my3.js', 'https://c.com/my3.js'], // this loads 3rd, alternative versions, only one loads  
  //can load more
  () => console.log('All Loaded!')      
)  
```
