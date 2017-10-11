---
---
$(document).ready(function(){
  // Initialize Materialize components
  $('.parallax').parallax();
  $('.nav-search nav').pushpin({
    top: $('.nav-search nav').offset().top
  });

  // Algolia Instantsearch
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
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        empty: 'No results',
        item: templateHits
      },
      transformData: function(hit) {
        // Format numbers and currency
        let formatter = new Intl.NumberFormat('en-US', {
          'style': 'decimal',
          'minimumFractionDigits': 0,
        });

        for (var i = 1; i <= 1; ++i) {
          let n = hit.grant_amount;
          let formattedNumber = '$' + formatter.format(n);
          hit.grant_amount = formattedNumber;
        }
        return hit;
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#refinement-list_tax-year',
      attributeName: 'tax_year',
      sortBy: ['name:desc'],
      limit: 5,
      collapsible: true,
      showMore: true,
      templates: {
        header: 'Tax Year',
      },
      cssClasses: {
        count: 'right',
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#refinement-list_state',
      attributeName: 'grantee_state',
      limit: 5,
      collapsible: true,
      showMore: true,
      templates: {
        header: 'State',
      },
      cssClasses: {
        count: 'right',
      },
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
});
