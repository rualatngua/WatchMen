(function () {

  'use strict';

  angular.module('watchmenFactories', []);

  var factories = angular.module('watchmenFactories');
  var reportCache;
  var pingPluginsCache;
  
  factories.factory('Report', function ($resource, $cacheFactory) {
    reportCache = $cacheFactory('Services');

    setInterval(function(){
      reportCache.removeAll();
    }, 30000);
    
    var Report = $resource('/api/report/services/:id', {id: '@id'}, {
      'get': { method:'GET', cache: reportCache},
      'query': { method:'GET', isArray:true, cache: reportCache}
    });

    Report.clearCache = function () {
      if (reportCache) {
        reportCache.removeAll();
      }
    };

    return Report;
  });

  factories.factory('Service', function ($resource) {
    return $resource('/api/services/:id',
        {id: '@id'}, {

          /**
           * Rest service data
           */
          reset: {
            method: 'POST',
            url: '/api/services/:id/reset'
          }

        });
  });

  factories.factory('PingPlugins', function ($resource, $cacheFactory) {
    pingPluginsCache = $cacheFactory('PingPlugins');
    return $resource('/api/plugins/:id',
        {id: '@id'}, {
          'query': { method:'GET', isArray:true, cache: pingPluginsCache}
        });
  });
})();