var path    = require('path');
var phantom = require('phantom');
var Q       = require('q');

function processBlock (blk) {
        var deferred = Q.defer();

        var code    = blk.body;
        var options = this.book.options.pluginsConfig['flow'];
        var width   = blk.kwargs['width'];

        phantom.create().then(function(ph) {
          ph.createPage().then(function(page) {
            var pagePath = path.join(__dirname, 'renderer.html');
            page.open(pagePath).then(function(status) {
              var result = page.evaluate(function(code, options, width) {
                return render(code, options, width);
              }, code, options, width);
              ph.exit();
              deferred.resolve(result);
            });
          });
        });

        return deferred.promise;
}

module.exports = {
  blocks: {
    flow: {
      // shortcuts have no effects
      // shortcuts: {
      //    parsers: ["markdown", "asciidoc"],
      //    start: "```flow",
      //    end: "```"
      // },
      process: processBlock
    }
  },
  hooks: {
    // Init plugin and read config
    "init": function() {
      if (typeof this.options.pluginsConfig['flow'] === 'undefined') {
        this.options.pluginsConfig['flow'] = {};
      }
    },
    // Before parsing markdown
    "page:before": function(page) {
        // Get all code texts
        flows = page.content.match(/^```flow((.*\n)+?)?```$/igm);
        // Begin replace
        if (flows instanceof Array) {
          for (var i = 0, len = flows.length; i < len; i++) {
            page.content = page.content.replace(
              flows[i], 
              flows[i].replace(/^```flow/, '{% flow %}').replace(/```$/, '{% endflow %}'));
          }     
        }
        // Get all {% flowchart %} and {% endflowchart %}
        flows = page.content.match(/^{% flowchart %}((.*\n)+?)?{% endflowchart %}$/igm);
        // Begin replace
        if (flows instanceof Array) {
          for (var i = 0, len = flows.length; i < len; i++) {
            page.content = page.content.replace(
              flows[i], 
              flows[i].replace(/^{% flowchart %}/, '{% flow %}').replace(/{% endflowchart %}$/, '{% endflow %}'));
          }     
        }
        return page;
    }
  }
};
