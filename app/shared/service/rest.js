app.factory('Rest', ['$http', '$q', '$location', 'CONFIG', function($http, $q, $location,CONFIG) {
    
    var obj = {};
    var serviceBase = CONFIG.apiLocalhost;
    var contentType = 'Content-Type';
    var appJson = 'application/json;charset=utf-8';
    var headerToken = 'X-TOKEN';

    obj.get = function(q,hdrs){
        if(hdrs == undefined) hdrs = {};
        hdrs[contentType] = appJson;
        var token = localStorage.getItem('edplusId') || '';
        if(token != '') hdrs[headerToken] = token;
        return $http({
            method: 'GET',
            url: serviceBase + q,
            headers: hdrs,
        });
    };

    obj.post = function(q, object, hdrs) {
        if(hdrs == undefined) hdrs = {};
        hdrs[contentType] = appJson;
        var token = localStorage.getItem('edplusId') || '';
        if(token != '') hdrs[headerToken] = token;
        return $http({
            method: 'POST',
            url: serviceBase + q,
            headers: hdrs,
            data: object
        });
    }

    obj.put = function(q, object, hdrs) {
        if(hdrs == undefined) hdrs = {};
        hdrs[contentType] = appJson;
        var token = localStorage.getItem('edplusId') || '';
        if(token != '') hdrs[headerToken] = token;
        return $http({
            method: 'PUT',
            url: serviceBase + q,
            headers: hdrs,
            data: object
        });
    }

    return obj;
}]);