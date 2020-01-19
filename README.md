# String clearing, mapper HTML-tags and BB-codes

### Using

```js
const stroka = require('stroka');

let text = '[b] Chip [/b] &amp; <span> Dale </span>';

console.log(stroka(text));
//=> Chip & Dale

console.log(stroka(text, {
    decode_text: false // Default: true
}));
//=> Chip &amp; Dale

console.log(stroka(text, {
    clear_html_tags: false // Default: true
}));
//=> Chip & <span> Dale </span>

console.log(stroka(text, {
    clear_bb_codes: false // Default: true
}));
//=> [b] Chip [/b] & Dale

console.log(stroka(text, {
    create_map_tags: true // Default: false
}));
//=> {
//=>   text: '_4_',
//=>   tags: [ '[b]', '[/b]', '<span>', '</span>', '_0_ Chip _1_ & _2_ Dale _3_' ],
//=>   options: { create_map_tags: true }
//=> }

console.log(stroka(text, {
    create_map_tags: true,
    min_chars_between_tags: 4 // Default: 30
}));
//=> {
//=>   text: '_0_ Chip _4_ Dale _3_',
//=>   tags: [ '[b]', '[/b]', '<span>', '</span>', '_1_ & _2_' ],
//=>   options: { create_map_tags: true, min_chars_between_tags: 4 }
//=> }

console.log(stroka(text, {
    create_map_tags: true, 
    min_chars_between_tags: 4, 
    merging_tags: false // Default: true
})); // Default: true
//=> {
//=>   text: '_0_ Chip _1_ & _2_ Dale _3_',
//=>   tags: [ '[b]', '[/b]', '<span>', '</span>' ],
//=>   options: { create_map_tags: true, min_chars_between_tags: 4, merging_tags: false }
//=> }

console.log(stroka(text, {
    create_map_tags: true, 
    min_chars_between_tags: 4, 
    symbol_side_left: "$", // Default: _
    symbol_side_right: "" // Default: _
}));
//=> {
//=>   text: '$0 Chip $4 Dale $3',
//=>   tags: [ '[b]', '[/b]', '<span>', '</span>', '$1 & $2' ],
//=>   options: {
//=>     create_map_tags: true,
//=>     min_chars_between_tags: 4,
//=>     symbol_side_left: '$',
//=>     symbol_side_right: ''
//=>   }
//=> }

console.log(stroka(stroka(text, {
    create_map_tags: true,
    min_chars_between_tags: 4
})));
//=> [b] Chip [/b] & <span> Dale </span>

console.log(stroka(stroka(stroka(text, {
    create_map_tags: true,
    min_chars_between_tags: 4
}))));
//=> Chip & Dale
```