---
---
$(document).ready(function(){
  // Initialize Materialize components
  $('.parallax').parallax();
  $('.button-collapse').sideNav();
  $('.nav-search nav').pushpin({
    top: $('.nav-search nav').offset().top
  });

  // Helper definitions
  const scrollAnchor = $('.nav-search').offset().top;
  const isMobile = window.matchMedia('only screen and (max-width: 992px)');

  // Algolia Instantsearch init
  const search = instantsearch({
    appId: 'QA1231C5W9',
    apiKey: 'b4035f7c5949a27a229bbda51aeb8329',
    indexName: 'grantmakers_io',
    urlSync: true,
  });

  // Define templates
  const templateHits = `{% include algolia-template-hits.html %}`;
  const templateHitsEmpty = `{% include algolia-template-hits-empty.html %}`;
  const templateRefinementItem = `{% include algolia-template-refinement-item.html %}`;
  const templateRefinementHeader = `{% include algolia-template-refinement-header.html %}`;
  const templateCurrentRefinedValues = `{% include algolia-template-current-refined-values.html %}`;
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
      autoHideContainer: false,
      cssClasses: {
        time: 'small text-muted-max'
      },
    })
  );

  // TODO Use infiniteHits template if isMobile.matches (aka on mobile devices)
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        empty: templateHitsEmpty,
        allItems: templateHits,
      },
      transformData: function(arr) {
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
        header: 'Tax Year' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        return formatRefinements(item);
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
        return formatRefinements(item);
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
        return formatRefinements(item);
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.currentRefinedValues({
      container: '#current-refined-values',
      clearAll: false,
      clearsQuery: true,
      onlyListedAttributes: true,
      attributes: [
        {name: 'tax_year', label: 'Tax Year'},
        {name: 'grantee_state', label: 'State'},
        {name: 'grantee_city', label: 'City'},
      ],
      cssClasses: {
        link: ['waves-effect', 'btn', 'btn-custom', 'btn-clear-refinements', 'blue-grey', 'lighten-4'],
        clearAll: ['waves-effect', 'btn', 'btn-custom', 'btn-clear-refinements']
      },
      templates: {
        item: templateCurrentRefinedValues,
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
      clearsQuery: true,
      cssClasses: {
        root: ['btn', 'btn-custom', 'waves-effect','waves-light', 'white-text'],
      }
    })
  );

  // TODO remove pagination on mobile when infiniteHits widgets is used
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

  // Scroll to top upon input change
  function readyToSearchScrollPosition() {
    $('html, body').animate({scrollTop: scrollAnchor}, '500', 'swing');
  }

  // Helper functions
  function slugify (text) {
    return text.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  function randomId() {
    return Math.random()
      .toString(36)
      .substr(2, 10);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    'style': 'decimal',
    'minimumFractionDigits': 0,
  });

  function formatRefinements(item) {
    // Format numbers
    let n = item.count;
    let formattedNumber = formatter.format(n);
    item.count = formattedNumber;
    // Ensure css IDs are properly formatted and unique
    if(item.label) {
      item.cssId = 'id-' + slugify(item.label);
    } else {
      // Fallback
      item.cssId = 'id-' + randomId();
    }
  return item;
}
});
