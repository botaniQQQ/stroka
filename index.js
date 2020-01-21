var entities = new (require('html-entities').AllHtmlEntities)();

module.exports = function (text, options) {
    if (!text) return '';
    var result = '', tags = [];
    options = options || {};
    if (typeof text === 'object') {
        if (
            typeof text.text === 'string' &&
            typeof text.tags === 'object' &&
            text.text && text.tags && text.tags.length
        ) {
            options = typeof text.options === 'object'
                ? text.options
                : options;
            tags = text.tags;
            text = text.text;
            options.create_map_tags = true;
        } else {
            text = typeof text.text === 'string' && text.text
                ? text.text
                : '';
        }
    }
    result = text || '';
    var opts = Object.assign({
        decode_text: true,
        clear_html_tags: true,
        clear_bb_codes: true,
        create_map_tags: false,
        merging_tags: true,
        min_chars_between_tags: 20,
        symbol_side_left: '_',
        symbol_side_right: '_'
    }, typeof options === 'object' ? options : {});
    if (opts.decode_text) {
        result = decodeText(result);
    }
    if (opts.clear_html_tags && !opts.create_map_tags) {
        result = result.replace(/(<[^<\r\n]*?>)/g, '');
    }
    if (opts.clear_bb_codes && !opts.create_map_tags) {
        result = result.replace(/(\[[^\[\r\n]*?])/g, '');
    }
    if (opts.create_map_tags) {
        var c = opts.min_chars_between_tags;
        var l = opts.symbol_side_left
            ? opts.symbol_side_left.replace(/([$^.\[()?*\\|])/g, '\\$1')
            : '';
        var r = opts.symbol_side_right
            ? opts.symbol_side_right.replace(/([$^.\[()?*\\|])/g, '\\$1')
            : '';
        var n = l !== r ? l + r : l;
        if (tags.length) {
            var all = tags.length - 1;
            tags.slice().reverse().forEach(function (tag, i) {
                var rgx = new RegExp((l ? l + '\\s?' : '') + (all - i) + (r ? '\\s?' + r : ''), 'ig');
                result = result
                    .replace(rgx, tag)
                    .replace(/\s+(['"«])\s+([\[<])/ig, ' $1$2')
                    .replace(/([\]>])\s+([.,?!'"»])\s+/ig, '$1$2 ')
                    .replace(/>\s+([^<]*)\s+<\//ig, '>$1</')
                    .replace(/]\s+([^\[]*)\s+\[\//ig, ']$1[/');
            });
        } else {
            var rgx1 = /(<[^<\r\n]*?>|\[[^\[\r\n]*?])/g;
            if (result.indexOf('<') === -1 && result.indexOf('[') === -1) {
                return {
                    text: clearSpace(result),
                    tags: tags,
                    options: options
                };
            } else if (result.indexOf('<') !== -1 && result.indexOf('[') === -1) {
                rgx1 = /(<[^<\r\n]*?>)/g;
            } else if (result.indexOf('<') === -1 && result.indexOf('[') !== -1) {
                rgx1 = /(\[[^\[\r\n]*?])/g;
            }
            result = clearSpace(result).replace(rgx1, function(match, tag) {
                var io1 = tags.indexOf(tag);
                if (io1 !== -1) return ' ' + opts.symbol_side_left + io1 + opts.symbol_side_right + ' ';
                tags.push(tag);
                return ' ' + opts.symbol_side_left + (tags.length - 1) + opts.symbol_side_right + ' ';
            });
            if (opts.merging_tags) {
                var rgx2 = new RegExp('(^[^' + n + ']{1,' + c + '}' + l + '[0-9]+?' + r + '([^' + n + ']{1,' + c + '}' + l + '[0-9]+?' + r + ')*|(' + l + '[0-9]+?' + r + '[^' + n + ']{1,' + c + '})*' + l + '[0-9]+?' + r + '[^' + n + ']{1,' + c + '}$|' + l + '[0-9]+?' + r + '([^' + n + ']{1,' + c + '}' + l + '[0-9]+?' + r + ')+)', 'g');
                result = clearSpace(result).replace(rgx2, function(match, tag) {
                    var io2 = tags.indexOf(tag);
                    if (io2 !== -1) return ' ' + opts.symbol_side_left + io2 + opts.symbol_side_right + ' ';
                    tags.push(tag);
                    return ' ' + opts.symbol_side_left + (tags.length - 1) + opts.symbol_side_right + ' ';
                });
            }
            return {
                text: clearSpace(result),
                tags: tags,
                options: options
            };
        }
    }
    return clearSpace(result);
};

function clearSpace(text) {
    return text
        .replace(/[ \f\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]+/g, ' ')
        .replace(/(\r?\n)+/g, '\n')
        .replace(/\n+/g, '\n')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .replace(/\r+/g, '\r')
        .replace(/\r /g, '\r')
        .replace(/ \r/g, '\r')
        .replace(/(^\s*)|(\s*)$/g, '');
}
function decodeText(text) {
    var result = '', arr = [], i = 0, l, x;
    if (!text) return result;
    text = entities.decode(text);
    arr = text.split(/(%(?:D0|D1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = arr[i];
        }
        result += x;
    }
    return result;
}