# Performance measurements of streaming JSON parsers

This repo contains some basic measurements that measure the performance and continuous memory usage of several streaming JSON parsers for JavaScript.

Note that this repo does not aim to be a fully-fledged benchmark.
It's just a small test for myself.

Considered metrics:

* Execution time
* Memory usage

## Tested libraries

* [`stream-json`](https://www.npmjs.com/package/stream-json)
* [`jsonparse`](https://www.npmjs.com/package/jsonparse)
* [SAX variant of `jsonparse`](https://gist.github.com/creationix/1821394)
* [`clarinet`](https://www.npmjs.com/package/clarinet)
* [`json-event-parser`](https://github.com/Tpt/json-event-parser.js)

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

Results obtained by executing on PrevailPro P3000 (i7-7700HQ, 32GB DDR4).

| Library                    | Execution time | Memory |
|----------------------------|----------------|--------|
| `stream-json`              | 4.770s         | 89MB   |
| `jsonparse`                | 3.381s         | 410MB  |
| SAX variant of `jsonparse` | 1.973s         | 100MB  |
| `clarinet`                 | 2.425s         | 94MB   |
| `json-event-parser`        | 2.152s         | 94MB   |

## License

This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
