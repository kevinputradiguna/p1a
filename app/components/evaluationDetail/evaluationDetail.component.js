function EvaluationDetailController($scope, Rest, $q, $route, $location, CONFIG,detailServices, locationService,NgTableParams, userHeartBeatService){
    var ctrl = this;
    var arrayEvaluation = [];

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.initializeList();
        locationService.setSubLocation('Evaluation Detail');
    };

    ctrl.initializeList = function(){
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId"),
            "X-ROOMID": detailServices.getEvaluationDetail()
        };
        Rest.get('/v1/evaluationDetail', hdrs)
        .success(function(result){
            arrayEvaluation = result.data;
            var i = 1;
            angular.forEach(arrayEvaluation, function(entry) {
                entry['NO'] = i;
                entry['roomId'] = detailServices.getEvaluationDetail();
                entry['passingStatic'] = entry['passing'];
                i++;
            });
            $scope.arrays = arrayEvaluation;
            $scope.tableParamsTable = new NgTableParams({ count: 8 }, { dataset : $scope.arrays});
        })
        .error(function(error, status){
            console.log('error catch');
        });
    };

    $scope.changePassing = function(no){
        // if()
        $scope.arrays[no]['passing'] = true;
    }

    $scope.update = function(){
        console.log($scope.arrays);
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId")
        };
        var body = {}
        body['roomId'] = detailServices.getEvaluationDetail();
        body['data'] = $scope.arrays;

        Rest.put('/v1/evaluationUpdate', body, hdrs)
        .success(function(result){
            if(result.status == 0){
                alert("Data has been updated.");
                ctrl.initializeList();
            }else{
                $scope.alertValue = true;
            }
        })
        .error(function(error, status){
            console.log("error catch");
        });
    };

    $scope.backTo = function(){
        $location.url('/evaluation').replace();
    }

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}

app.component('evaluationdetail',{
    templateUrl:'app/components/evaluationDetail/evaluationDetail.html',
    controller: EvaluationDetailController
});
