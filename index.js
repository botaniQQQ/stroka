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
    if (html) {
        out = out.replace(/(<.*?>)/g, '');
    }
    return out
        .replace(/[ \f\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]+/g, ' ')
        .replace(/(\r?\n)+/g, '\n')
        .replace(/\n+/g, '\n')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .replace(/\r+/g, '\r')
        .replace(/\r /g, '\r')
        .replace(/ \r/g, '\r')
        .replace(/(^\s*)|(\s*)$/g, '')
};