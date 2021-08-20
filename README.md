# Performance measurements of streaming JSON parsers

This repo contains some basic measurements that measure the performance and continuous memory usage of several streaming JSON parsers for JavaScript.

Note that this repo does not aim to be a fully-fledged benchmark.
It's just a small test for myself.

Considered metrics:

* Execution time
* Memory usage
* Robustness (unit tests)
* Usage (number of dependents)
* Maintained (last release)

## Tested libraries

* [`stream-json`](https://www.npmjs.com/package/stream-json)
* [`jsonparse`](https://www.npmjs.com/package/jsonparse)
* [SAX variant of `jsonparse`](https://gist.github.com/creationix/1821394)
* [`clarinet`](https://www.npmjs.com/package/clarinet)

## Executing these measurements

First, clone this repo.

Then, install and execute it with some JSON file:
```bash
$ npm install
$ node --expose-gc index.js some-file.json
```

In my experiments, the input JSON file (144,2MB) was created as follows:
```bash
$ npm install -g @comunica/actor-init-sparql
$ comunica-sparql https://fragments.dbpedia.org/2016-04/en 'construct where { ?s ?p ?o } limit 1000000' -t application/ld+json > dbpedia-1m.jsonld
```

## Results

Results obtained by executing on MacBook Pro (13-inch, 2020, Four Thunderbolt 3 ports); 2,3 GHz Quad-Core Intel Core i7; 16 GB 3733 MHz LPDDR4

| Library                    | Execution time | Memory | Robustness | Usage | Maintained | Notes |
| -------------------------- | -------------- | ------ | ---------- | ----- | ---------- | ----- |
| `stream-json`              | 3.626s         | 65MB   | High       | 139   | June 2021  | Extensive documentation |
| `jsonparse`                | 2.791s         | 384MB  | High       | 175   | 2017       | Accumulates memory! |
| SAX variant of `jsonparse` | 1.431s         | 72MB   | Low        | 0     | /          | Not a proper npm package |
| `clarinet`                 | 2.213s         | 67MB   | High       | 33    | 2019       |       |

## Conclusion

Performance-wise, the SAX variant of `jsonparse` is the clear winner.
However, since it is unmaintained, and no tests are available, it is not recommended.

While `jsonparse` itself is also pretty fast, it suffers from memory issues for large streams (as it still accumulates JSON in memory).
So this is also a no-go.

`stream-json` and `clarinet` both have acceptable performance and memory usage.
While `stream-json` is slower than `clarinet`, it seems to be much better maintained, and has extensive documentation and a broader usage.

**Therefore, even though `stream-json` is slower, it may be considered the best library available at the moment for parsing JSON in a streaming manner.**

## License

This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
