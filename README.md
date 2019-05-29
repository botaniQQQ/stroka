### Using

```js
const stroka = require('stroka');
console.log(stroka('Chip&amp;Dale'));
//=> Chip&Dale
```

### Clear HTML

```js
const stroka = require('stroka');
console.log(stroka('Chip&amp;<span>Dale</span>', true));
//=> Chip&Dale
```