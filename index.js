const StreamJson = require('stream-json');
const JsonParse = require('jsonparse');
const JsonParseSax = require('./jsonparse-sax');
const clarinet = require('clarinet');
const {JsonEventParser} = require('json-event-parser');
const fs = require('fs');

const file = process.argv[2];

function evaluate(label, handler) {
    console.log(`--- Running ${label} ---`); // TODO

    let lastTimeout;
    function measureMemory() {
        lastTimeout = setTimeout(() => {
            console.log(`    Interim memory usage for ${label}: ${Math.round(process.memoryUsage.rss() / 1024 / 1024)}MB`);
            measureMemory();
        }, 200);
    }

    return new Promise(((resolve, reject) => {
        measureMemory();
        console.time(label);
        handler(fs.createReadStream(file))
            .on('data', (data) => {
                //console.log(data); // TODO
            })
            .on('end', () => {
                console.timeEnd(label);
                console.log(`=> Final memory usage for ${label}: ${Math.round(process.memoryUsage.rss() / 1024 / 1024)}MB`);

                // Force GC
                clearTimeout(lastTimeout);
                global.gc();
                resolve();
            });
    }));
}

(async function() {
    await evaluate('stream-json', (stream) => stream.pipe(new StreamJson.Parser()));

    await evaluate('jsonparse', (stream) => {
        const jsonParse = new JsonParse();
        jsonParse.onValue = (data) => {
            //console.log(data); // TODO
        };
        stream.on('data', (data) => {
            jsonParse.write(data);
        });
        return stream;
    });

    await evaluate('json-parse-sax', (stream) => {
        const jsonParse = new JsonParseSax.SaxParser({
            onNull: function () {
            },
            onBoolean: function (value) {
            },
            onNumber: function (value) {
            },
            onString: function (value) {
            },
            onStartObject: function () {
            },
            onColon: function () {
            },
            onComma: function () {
            },
            onEndObject: function () {
            },
            onStartArray: function () {
            },
            onEndArray: function () {
            }
        });
        stream.on('data', (data) => {
            jsonParse.parse(data);
        });
        stream.on('end', () => {
            jsonParse.finish();
        });
        return stream;
    });

    await evaluate('clarinet', (stream) => {
        const parser = clarinet.createStream();
        parser.on("value", function (value) {
        });
        return stream.pipe(parser);
    });

    await evaluate('json-event-parser', (stream) => {
        const parser = new JsonEventParser({
            onEvent(_) {
                // no-op
            }
        });
        stream.on('end', () => {
            parser.end();
        }).on('data', (data) => {
            parser.write(data);
        });
        parser.end();
        return stream;
    });
})();
