function statisticController($scope, Rest, $q, $route, $location,CONFIG, detailServices,locationService,NgTableParams,userHeartBeatService){
    var ctrl = this;
    var arrayEvaluation = [];

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.initializeList();
        locationService.setSubLocation('Statistic');
    };

    ctrl.initializeList = function(){
        // var hdrs = {
        //     "X-TOKEN": localStorage.getItem("edplusId") 
        // };
        // Rest.get('/v1/evaluation', hdrs)
        // .success(function(result){
        //     arrayEvaluation = result.data;
        //     var i = 1;
        //     angular.forEach(arrayEvaluation, function(entry) {
        //         entry['NO'] = i;
        //         i++;
        //     });
        //     $scope.arrays = arrayEvaluation;
        //     $scope.tableParamsTable = new NgTableParams({}, { dataset : $scope.arrays});
        // })
        // .error(function(error, status){
        //     console.log('error catch');
        // });
    };

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}

app.component('statistic',{
    templateUrl:'app/components/statistic/statistic.html',
    controller: statisticController
});
