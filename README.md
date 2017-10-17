## Algolia Instantsearch Materialize Jekyll

A Jekyll template for quickly getting up and running with [Algolia](https://www.algolia.com/) and [Materialize](http://materializecss.com/).

Leverages Algolia's Instantsearch library ([docs](https://community.algolia.com/instantsearch.js/)), which makes it drop dead simple to create good search UX.

### Data
An example dataset is provided for convenience. Please use this dataset for your own prototypes.

Change your Algolia credentials in [`search.js`](https://github.com/chadokruse/algolia-materialize-jekyll/blob/64371c9300c180de9a416423286b9bd071e05dad/assets/js/search.js#L15).

### Limitations
I use the template primarily for prototyping purposes, thus robust browser support is not a concern. Due to the use of [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), [IE 11 support](https://caniuse.com/#feat=template-literals) will require minor modification to [`search.js`](https://github.com/chadokruse/algolia-materialize-jekyll/blob/64371c9300c180de9a416423286b9bd071e05dad/assets/js/search.js#L24).

### Bugs & Roadmap
There are a few known bugs and a relatively short wish list (primarily mobile related), all of which are listed in [Issues](https://github.com/chadokruse/algolia-materialize-jekyll/issues).

Materialize is planning a fairly big rewrite of many core components in their upcoming v1.0 release, so be prepared for breaking changes in the very near future. 

### Screenshot & Demo
[Live demo](https://www.chadkruse.com/algolia-materialize-jekyll/)

![Screenshot](assets/img/algolia-materialize-jekyll.png?raw=true "Screenshot")

### License
Both Materialize and Algolia Instantsearch are licensed under the terms of the MIT license.

This project is also licensed under the terms of the MIT license. 