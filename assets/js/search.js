---
---
$(document).ready(function(){
  // Initialize Materialize components
  $('.parallax').parallax();
  $('.nav-search nav').pushpin({
    top: $('.nav-search nav').offset().top
  });

  // Algolia Instantsearch init
  const scrollAnchor = $('.nav-search').offset().top;
  const isMobile = window.matchMedia('only screen and (max-width: 768px)');
  const search = instantsearch({
    appId: 'QA1231C5W9',
    apiKey: 'b4035f7c5949a27a229bbda51aeb8329',
    indexName: 'grantmakers_io',
    urlSync: true
  });

  // Define templates
  const templateHits = `{% include algolia-template-hits.html %}`;
  const templateRefinementItem = `{% include algolia-template-refinement-item.html %}`;
  const templateRefinementHeader = `{% include algolia-template-refinement-header.html %}`;
  const templateShowMoreActive = `{% include algolia-template-show-more-active.html %}`;
  const templateShowMoreInactive = `{% include algolia-template-show-more-inactive.html %}`;

  // Define color palette
  const widgetHeaderClasses = ['card-header', 'blue-grey', 'lighten-4', 'z-depth-1'];


  // Construct widgets
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-box',
      poweredBy: true,
      reset: true,
      queryHook: function(query, search) {
        readyToSearchScrollPosition();
        search(query);
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
      cssClasses: {
        time: 'small text-muted-max'
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        empty: 'No results',
        allItems: templateHits,
      },
      transformData: function(arr) {
        // Format numbers and currency
        for (var i = 0, len = arr.hits.length; i < len; i++) {
          let n = arr.hits[i].grant_amount;
          let formattedNumber = '$' + formatter.format(n);
          arr.hits[i].grant_amount = formattedNumber;
        }
        return arr;
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#refinement-list--tax_year',
      attributeName: 'tax_year',
      sortBy: ['name:desc'],
      limit: 5,
      collapsible: true,
      showMore: {
        templates: {
          active: templateShowMoreActive,
          inactive: templateShowMoreInactive,
        },
      },
      templates: {
        header: 'Tax Year' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        for (var i = 1; i <= 1; ++i) {
          let n = item.count;
          let formattedNumber = formatter.format(n);
          item.count = formattedNumber;
        }
        return item;
      }
    })
  )

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#refinement-list--grantee_state',
      attributeName: 'grantee_state',
      limit: 5,
      collapsible: {
        collapsed: true
      },
      showMore: {
        templates: {
          active: templateShowMoreActive,
          inactive: templateShowMoreInactive,
        },
      },
      templates: {
        header: 'State' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        for (var i = 1; i <= 1; ++i) {
          let n = item.count;
          let formattedNumber = formatter.format(n);
          item.count = formattedNumber;
        }
        return item;
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#refinement-list--grantee_city',
      attributeName: 'grantee_city',
      limit: 5,
      collapsible: {
        collapsed: true
      },
      showMore: {
        templates: {
          active: templateShowMoreActive,
          inactive: templateShowMoreInactive,
        },
      },
      templates: {
        header: 'City' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        for (var i = 1; i <= 1; ++i) {
          let n = item.count;
          let formattedNumber = formatter.format(n);
          item.count = formattedNumber;
        }
        return item;
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.clearAll({
      container: '#clear-all',
      templates: {
        link: 'Clear all'
      },
      autoHideContainer: false,
      cssClasses: {
        root: 'btn',
        link: 'white-text'
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      maxPages: 20,
      scrollTo: '.nav-search',
      cssClasses: {
        root: 'pagination',
        page: 'waves-effect',
        active: 'active',
        disabled: 'disabled'
      }
    })
  );
  
  search.start();

  function readyToSearchScrollPosition() {
    $('html, body').animate({scrollTop: scrollAnchor}, '500', 'swing');
  }

  const formatter = new Intl.NumberFormat('en-US', {
    'style': 'decimal',
    'minimumFractionDigits': 0,
  });
});
