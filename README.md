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

## Skip scripts that are already loaded

A script can opt out of loading when one of its sources was already loaded by a
previous `multiloader` call. Use the object form with `once: true`:

```javascript
// skip if a.js was loaded before (by any multiloader call), otherwise load it
multiloader({ src: 'https://a.com/a.js', once: true })

// string and array forms still work and can be mixed with object items
multiloader(
  { src: 'https://a.com/a.js', once: true },
  ['https://a.com/b.js', 'https://b.com/b.js'],
  { src: ['https://a.com/c.js', 'https://b.com/c.js'], once: true },
  () => console.log('All Loaded!')
)
```

Notes:

- When any source of an item loads, **all** of that item's sources are marked in
  `window._multiloader_loaded`, so alternative URLs also count as loaded.
- The map is filled for every successfully loaded item; `once: true` only
  controls whether the item is skipped.
- `multiloader('https://a.com/a.js')` (old form) still loads unconditionally.
- Concurrent calls are not deduplicated: the flag is set when the script has
  actually finished loading.
