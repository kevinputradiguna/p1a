function HistoryDetailHeader($scope){
    var timezone = new Date().getTimezoneOffset();
    $scope.timezoneString = "";
    if(timezone == -420){
        $scope.timezoneString = "WIB";
    }
    else if(timezone == -480){
        $scope.timezoneString = "WITA";
    }
    else if(timezone == -540){
        $scope.timezoneString = "WIT";
    }
}


app.component('historydetailheader',{
    templateUrl:'app/components/historyDetail/historyDetailHeader.html',
    controller: HistoryDetailHeader,
    bindings: {
        roomheader: '=',
        instructor: '='
    }
});