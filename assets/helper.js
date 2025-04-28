function unserialize(data) {
    var error = function (type, msg, filename, line) {
        throw new window[type](msg, filename, line);
    };
    var read_until = function (data, offset, stopchr) {
        var buf = [];
        var chr = data.slice(offset, offset + 1);
        var i = 2;
        while (chr != stopchr) {
            if ((i + offset) > data.length) {
                error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1), offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };
    var read_chrs = function (data, offset, length) {
        buf = [];
        for (var i = 0; i < length; i++) {
            var chr = data.slice(offset + (i - 1), offset + i);
            buf.push(chr);
        }
        return [buf.length, buf.join('')];
    };
    var _unserialize = function (data, offset) {
        if (!offset) offset = 0;
        var buf = [];
        var dtype = (data.slice(offset, offset + 1)).toLowerCase();

        var dataoffset = offset + 2;
        var typeconvert = function (x){return x;}
        var chrs = 0;
        var datalength = 0;

        switch (dtype) {
            case "i":
                typeconvert = function (x){return formatFloat(x);};
                var readData = read_until(data, dataoffset, ';');
                var chrs = readData[0];
                var readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case "b":
                typeconvert = function (x){return (formatFloat(x) == 1);};
                var readData = read_until(data, dataoffset, ';');
                var chrs = readData[0];
                var readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case "d":
                typeconvert = function (x){return parseFloat(x);};
                var readData = read_until(data, dataoffset, ';');
                var chrs = readData[0];
                var readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case "n":
                readdata = null;
                break;
            case "s":
                var ccount = read_until(data, dataoffset, ':');
                var chrs = ccount[0];
                var stringlength = ccount[1];
                dataoffset += chrs + 2;

                var readData = read_chrs(data, dataoffset + 1, formatFloat(stringlength));
                var chrs = readData[0];
                var readdata = readData[1];
                dataoffset += chrs + 2;
                if (chrs != formatFloat(stringlength) && chrs != readdata.length) {
                    error('SyntaxError', 'String length mismatch');
                }
                break;
            case "a":
                var readdata = {};

                var keyandchrs = read_until(data, dataoffset, ':');
                var chrs = keyandchrs[0];
                var keys = keyandchrs[1];
                dataoffset += chrs + 2;

                for (var i = 0; i < formatFloat(keys); i++) {
                    var kprops = _unserialize(data, dataoffset);
                    var kchrs = kprops[1];
                    var key = kprops[2];
                    dataoffset += kchrs;

                    var vprops = _unserialize(data, dataoffset);
                    var vchrs = vprops[1];
                    var value = vprops[2];
                    dataoffset += vchrs;

                    readdata[key] = value;
                }

                dataoffset += 1;
                break;
            default:
                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    };
    return _unserialize(data, 0)[2];
}