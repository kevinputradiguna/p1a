function EvaluationController($scope, Rest, $q, $route, $location, CONFIG, detailServices,locationService, NgTableParams, userHeartBeatService){
    var ctrl = this;
    var arrayEvaluation = [];

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.initializeList();
        locationService.setSubLocation('Evaluation');
    };

    ctrl.initializeList = function(){
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId") 
        };
        Rest.get('/v1/evaluation', hdrs)
        .success(function(result){
            arrayEvaluation = result.data;
            var i = 1;
            angular.forEach(arrayEvaluation, function(entry) {
                entry['NO'] = i;
                i++;
            });
            $scope.arrays = arrayEvaluation;
            $scope.tableParamsTable = new NgTableParams({ count: 8 }, { dataset : $scope.arrays});
        })
        .error(function(error, status){
            console.log('error catch');
        });
    };

    $scope.redirectTo = function(data){
        detailServices.setEvaluationDetail(data.roomId);
        $location.url('/evaluationdetail').replace();
    };


    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}

app.component('evaluation',{
    templateUrl:'app/components/evaluation/evaluation.html',
    controller: EvaluationController
});
