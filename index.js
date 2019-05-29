var entities = new (require('html-entities').AllHtmlEntities)();

module.exports = function (text, html) {
    var out = '', arr, i = 0, l, x;
    if (!text) return out;
    text = entities.decode(text);
    arr = text.split(/(%(?:D0|D1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = arr[i];
        }
        out += x;
    }
    return html
        ? out
            .replace(/(<.*?>)/g, '')
            .replace(/\s+/g, ' ')
            .replace(/(^\s*)|(\s*)$/g, '')
        : out
            .replace(/\s+/g, ' ')
            .replace(/(^\s*)|(\s*)$/g, '')
};