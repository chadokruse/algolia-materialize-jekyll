---
---
function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  // Helper definitions
  const scrollAnchor = document.querySelector('.nav-search');
  const isMobile = window.matchMedia('only screen and (max-width: 992px)');
  // Initialize Materialize components
  // Note: if the element is created dynamically via Instantsearch widget,
  // the plugin needs to be initialized in the normal Instantsearch workflow
  // using the render method (e.g. search.once('render'...)
  const elemsPA = document.querySelectorAll('.parallax');
  M.Parallax.init(elemsPA);

  const elemsSN = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elemsSN);

  if (!isMobile.matches) { // Use pushpin on desktop only
    const elemPP = document.querySelector('.nav-search nav');
    const optionsPP = {
      top: elemPP.offsetTop,
    };
    M.Pushpin.init(elemPP, optionsPP);
  }

  // Algolia Instantsearch init
  const search = instantsearch({
    appId: '5YBTC21R7O',
    apiKey: 'c6b664e1e04dba1600bd9fe9c1b5bcc0',
    indexName: 'demo',
    numberLocale: 'en-US',
    routing: true,
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
  const widgetHeaderClasses = ['card-header', 'grey', 'lighten-4'];

  // Helper variables - see also helper functions at bottom
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
  });

  // Construct widgets
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#ais-widget-search-box',
      poweredBy: true,
      reset: true,
      queryHook: function(query, searchNew) {
        readyToSearchScrollPosition();
        searchNew(query);
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#ais-widget-stats',
      autoHideContainer: false,
      cssClasses: {
        time: 'small text-muted-max',
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.sortBySelector({
      container: '#ais-widget-sort-by',
      cssClasses: {
        root: 'input-field',
      },
      indices: [
        {name: 'demo', label: 'Most relevant'},
        {name: 'demo_amount_desc', label: 'Grant size'},
      ],
    })
  );

  // TODO Use infiniteHits template if isMobile.matches (aka on mobile devices)
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#ais-widget-hits',
      templates: {
        empty: templateHitsEmpty,
        allItems: templateHits,
      },
      transformData: function(arr) {
        for (let i = 0, len = arr.hits.length; i < len; i++) {
          let n = arr.hits[i].grant_amount;
          let formattedNumber = '$' + formatter.format(n);
          arr.hits[i].grant_amount = formattedNumber;
        }
        return arr;
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-refinement-list--purpose',
      attributeName: 'grant_purpose',
      limit: 5,
      collapsible: {
        collapsed: true,
      },
      showMore: {
        templates: {
          active: templateShowMoreActive,
          inactive: templateShowMoreInactive,
        },
      },
      templates: {
        header: 'Program' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        return formatRefinements(item);
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-refinement-list--tax_year',
      attributeName: 'tax_year',
      sortBy: ['name:desc'],
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-refinement-list--grantee_state',
      attributeName: 'grantee_state',
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-refinement-list--grantee_city',
      attributeName: 'grantee_city',
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.rangeSlider({
      container: '#ais-widget-range-slider',
      attributeName: 'grant_amount',
      collapsible: {
        collapsed: true,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      templates: {
        header: 'Amount' + templateRefinementHeader,
      },
      tooltips: {
        format: function(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        },
      },
      pips: false,
    })
  );

  search.addWidget(
    instantsearch.widgets.currentRefinedValues({
      container: '#ais-widget-current-refined-values',
      clearAll: false,
      clearsQuery: true,
      onlyListedAttributes: true,
      attributes: [
        {name: 'grant_purpose', label: 'Program'},
        {name: 'tax_year', label: 'Tax Year'},
        {name: 'grantee_state', label: 'State'},
        {name: 'grantee_city', label: 'City'},
      ],
      cssClasses: {
        link: ['waves-effect', 'btn', 'btn-custom', 'btn-clear-refinements', 'blue-grey', 'lighten-4'],
        clearAll: ['waves-effect', 'btn', 'btn-custom', 'btn-clear-refinements'],
      },
      templates: {
        item: templateCurrentRefinedValues,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.clearAll({
      container: '#ais-widget-clear-all',
      templates: {
        link: 'Clear all',
      },
      autoHideContainer: false,
      clearsQuery: true,
      cssClasses: {
        root: ['btn', 'btn-custom', 'waves-effect', 'waves-light', 'white-text'],
      },
    })
  );

  // TODO remove pagination on mobile when infiniteHits widgets is used
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#ais-widget-pagination',
      maxPages: 20,
      scrollTo: '.nav-search',
      cssClasses: {
        root: 'pagination',
        page: 'waves-effect',
        active: 'active',
        disabled: 'disabled',
      },
    })
  );

  /* Recreate refinement widgets for mobile views */
  /* Clear all button */
  search.addWidget(
    instantsearch.widgets.clearAll({
      container: '#ais-widget-mobile-clear-all',
      templates: {
        link: '<a class="waves-effect waves-light btn btn grey lighten-5 grey-text text-darken-3">Clear</a>',
      },
      autoHideContainer: false,
      clearsQuery: true,
    })
  );
  /* Slide out */
  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-mobile-refinement-list--purpose',
      attributeName: 'grant_purpose',
      autoHideContainer: false,
      limit: 5,
      collapsible: {
        collapsed: false,
      },
      showMore: {
        templates: {
          active: templateShowMoreActive,
          inactive: templateShowMoreInactive,
        },
      },
      templates: {
        header: 'Program' + templateRefinementHeader,
        item: templateRefinementItem,
      },
      cssClasses: {
        header: widgetHeaderClasses,
        body: 'card-content',
      },
      transformData: function(item) {
        return formatRefinements(item);
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-mobile-refinement-list--tax_year',
      attributeName: 'tax_year',
      autoHideContainer: false,
      sortBy: ['name:desc'],
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-mobile-refinement-list--grantee_state',
      attributeName: 'grantee_state',
      autoHideContainer: false,
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#ais-widget-mobile-refinement-list--grantee_city',
      attributeName: 'grantee_city',
      autoHideContainer: false,
      limit: 5,
      collapsible: {
        collapsed: true,
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
      },
    })
  );

  // Initialize Materialize JS components
  search.once('render', function() {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  });

  // Initialize search
  search.start();

  // Scroll to top of results upon input change
  function readyToSearchScrollPosition() {
    window.scrollTo({
      top: scrollAnchor.offsetTop,
      left: 0,
      behavior: 'auto',
    });
  }

  // Helper functions
  function slugify(text) {
    return text.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function randomId() {
    return Math.random()
      .toString(36)
      .substr(2, 10);
  }

  /* Not currently used
  function formatNumbersOnly(item) {
    // Format numbers
    let n = item.grant_amount;
    let formattedNumber = formatter.format(n);
    item.grant_amount = formattedNumber;
    return item;
  }
  */

  function formatRefinements(item) {
    // Format numbers
    let n = item.count;
    let formattedNumber = formatter.format(n);
    item.count = formattedNumber;
    // Ensure css IDs are properly formatted and unique
    if (item.label) {
      item.cssId = 'id-' + slugify(item.label);
    } else {
      // Fallback
      item.cssId = 'id-' + randomId();
    }
    return item;
  }
});
