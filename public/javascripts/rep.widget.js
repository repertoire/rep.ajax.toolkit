/*
* Repertoire abstract ajax widget
*
* Copyright (c) 2009 MIT Hyperstudio
* Christopher York, 09/2009
*
* Requires jquery 1.3.2+
* Support: Firefox 3+ & Safari 4+.  IE emphatically not supported.
*/

// claim a single global namespace, 'repertoire'
repertoire = {};

//
// Generates a jquery plugin that attaches a widget instance to each matched element
// and exposes plugin defaults.
//
// Usage:
//    $.fn.my_widget = repertoire.plugin(my_widget);
//    $.fn.my_widget.defaults = { /* widget option defaults */ };
//
repertoire.plugin = function(self) {
  var fn = function(options) {
    return this.each(function() {
      var settings = $.extend({}, repertoire.defaults, fn.defaults, html_options($(this)), options);
      self($(this), settings).initialize();
    });
  };
  fn.defaults = { };
  return fn;

  // helper: default widget name and title options from dom
  function html_options($elem) {
    return {
      name: $elem.attr('id'),
      title: $elem.attr('title')
    };
  }
};

// Global defaults inherited by all widgets
//
// Options:
//   path_prefix - prefix to add before all generated urls
//
repertoire.defaults = {
  path_prefix: ''
};


//
// Abstract class for ajax widgets
//
// Handles:
//       - url/query-string construction
//       - data assembly for sending to webservice
//       - change publication and observing
//       - ui event delegation hooks
//       - hooks for injecting custom behaviour
//       - some text format methods
//
// Options on all subclassed widgets:
//
//   url         - provide a url to over-ride the widget's default
//   spinner     - css class to add to widget during ajax loads
//   error       - text to display if ajax load fails
//   injectors   - additional jquery markup to inject into widget (see FAQ)
//   handlers    - additional jquery event handlers to add to widget (see FAQ)
//   pre_update  - additional pre-processing for params sent to webservice (see FAQ)
//
// Sub-classes are required to over-ride two methods: self.update() and self.render().
// See the documentation for these methods for more details.
//
repertoire.widget = function($widget, options) {
  // this object is an abstract class
  var self = {};

  // register a collection of event handlers
  function register_handlers(handlers) {
    $.each(handlers, function(selector, handler) {
      // register each handler
      self.handler(selector, function() {
        // bind self as an argument for the custom handler
        return handler.apply(this, [self]);
      });
    });
  }

  // to run by hand after sub-classes have evaluated
  self.initialize = function() {
    // register any custom handlers
    if (options.handlers !== undefined)
      register_handlers(options.handlers);
    // load once at start up
    self.reload();
  }

  // inject custom markup into widget
  function process_injectors($markup, injectors, data) {
    // workaround for jquery find not matching top element
    $wrapped = $("<div/>").append($markup);

    $.each(injectors, function(selector, injector) {
      var $elems = $wrapped.find(selector);
      if ($elems.length > 0)
        injector.apply($elems, [self, data]);
    });
  }

  //
  // Reload data from webservice and render into widget
  //
  // Integrates state and markup injectors
  //
  self.reload = function() {
    var state = self.state();

    // pass to custom state processor
    if (options.pre_update !== undefined)
      options.pre_update(state);

    // fetch data from webservice, render and update DOM
    self.update(state, function(data) {
      var $markup = self.render(data);

      // inject any custom markup
      if (options.injectors !== undefined)
        process_injectors($markup, options.injectors, data);

      // paint markup into the dom
      $widget.html($markup);
    });
  };

  //
  // Update the widget's data given the current state
  //
  // You may either pre-process the state and write your own webservice access methods
  // or use self.fetch for a generic webservice, e.g.
  //
  // self.update = function(state, callback) {
  //   var url = self.default_url(['projects', 'results']);
  //   self.fetch(state, url, 'html', callback);
  // }
  //
  self.update = function(state, callback) {
    throw "Abstract function: redefine self.update() in your widget."
  }

  //
  // Inject widget-specific markup into default markup from superclass
  //
  // Over-ride this method to call the superclass markup method and then
  // inject your own widget's markup into it, e.g.
  //
  //   ...
  //   var $template_fn = self.render;            // idiom to access super.render()
  //   self.render = function(data) {
  //     $markup = $template_fn(data);            // get template from superclass
  //     return $markup.append('Hello world!');   // inject this widget's markup into it
  //   }
  //
  self.render = function(data) {
    return $('<div class="rep"/>');               // namespace for all other widget css is 'rep'
  };

  //
  // Return any widget state that should be provided to the webservice
  //
  // Over-ride this method to specify additional data for the ajax call
  //
  self.state = function() {
    return {};
  }

  //
  // Utility method to issue an ajax HTTP GET to fetch data from a webservice
  //
  //   state:    params to send as http query line
  //   url:      url of webservice to access
  //   type:     type of data returned (e.g. 'json', 'html')
  //   callback: function to call with returned data
  //
  self.fetch = function(state, url, type, callback) {
    var spinnerClass = options.spinner || 'loading';
    $widget.addClass(spinnerClass);
    $.ajax({
      url: url,
      data: self.to_query_string(state),
      type: 'GET',
      dataType: type,
      // content negoation problems may require:
      /* beforeSend: function(xhr) { xhr.setRequestHeader("Accept", "application/json") } */
      success: callback,
      error:   function() {
        $widget.html(options.error || 'Could not load');
      },
      complete: function () {
        $widget.removeClass(spinnerClass);
      }
    });
  };

  //
  // Format a webservice url, preferring options.url if possible
  //
  self.default_url = function(default_parts) {
    var path_prefix = options.path_prefix || '';
    var parts = default_parts.slice();

    parts.unshift(path_prefix);
    return options.url || parts.join('/');
  };

  //
  // Capitalize and return a string
  //
  self.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
  };

  //
  // Convert a structure of of params to a URL query string suitable for use in an HTTP GET request, compliant with Merb's format.
  //
  //   An example:
  //
  //   Merb::Parse.params_to_query_string(:filter => {:year => [1593, 1597], :genre => ['Tragedy', 'Comedy'] }, :search => 'William')
  //   ==> "filter[genre][]=Tragedy&filter[genre][]=Comedy&filter[year][]=1593&filter[year][]=1597&search=William"
  //
  self.to_query_string = function(value, prefix) {
    var vs = [];
    prefix = prefix || '';
    if (value instanceof Array) {
      jQuery.each(value, function(i, v) {
        vs.push(self.to_query_string(v, prefix + '[]'));
      });
      return vs.join('&');
    } else if (typeof(value) == "object") {
      jQuery.each(value, function(k, v) {
        vs.push(self.to_query_string(v, (prefix.length > 0) ? (prefix + '[' + escape(k) + ']') : escape(k)));
      });
      // minor addition to merb: discard empty value lists { e.g. discipline: [] }
      vs = vs.filter(function(x) { return x !== ""; });
      return vs.join('&');
    } else {
      return prefix + '=' + escape(value);
    }
  };

  function parse_event_selector(event_selector) {
    var s = event_selector.split('!');
    var event, selector;

    if (s.length === 2) {
      event = s[0], selector = s[1];
    } else if (s.length === 1) {
      event = 'click', selector = s[0];
    } else {
      throw "Could not parse event selector: " + event_selector;
    }

    if (event.indexOf('.')<0) {
      // create a default namespace from selector or random number
      namespace = selector.replace(/[^a-zA-z0-9]/g, '') || new Date().getTime();
      event = event + '.' + namespace;
    }

    return [event, selector];
  }

  //
  // Register a handler for dom events on this widget.  Call with an event selector and a standard jquery event
  // handler function, e.g.
  //
  //    self.handler('click.toggle_value!.rep .facet .value', function() { ... });
  //
  // Note the syntax used to identify a handler's event, namespace, and the jquery selector: '<event.namespace>!<target>'.
  // Both event and namespace are optional - leave them out to register a click handler with a unique namespace.
  //
  // To replace an existing handler, register another with the same event name, namespace, and target.  To enable later users
  // to do this, it's best to namespace all your events.
  //
  self.handler = function(event_selector, fn) {
    event_selector = parse_event_selector(event_selector);
    var event    = event_selector[0],
        selector = event_selector[1];  // why doesn't JS support array decomposition?!?

    // provide opportunity to replace existing handlers
    $widget.unbind(event);
    // bind new handler
    $widget.bind(event, function (e) {
      var el = $(e.target);
      var result = false;
      // walk up dom tree for selector
      while (!$(el).is('body')) {
        if ($(el).is(selector)) {
          result = fn.apply($(el)[0], [e]);
          if (result === false)
            e.preventDefault();
          return;
        }
        el = $(el).parent();
      }
    });
  }


  // end of rep.widget factory function
  return self;
};