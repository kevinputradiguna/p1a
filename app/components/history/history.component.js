function HistoryController($scope, $route, $filter,CONFIG,Rest,detailServices,locationService,$location, NgTableParams, userHeartBeatService){
    var ctrl = this;
    var allRoomList = [];

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.getHistory();
        locationService.setSubLocation('History');
    };

    ctrl.getHistory = function(){
        Rest.get('/v1/roomHistory')
        .success(function(result){
            allRoomList = result.data;
            var i = 1;
            var timezone = new Date().getTimezoneOffset();
            var timezoneString = "";
            if(timezone == -420){
                timezoneString = "WIB";
            }
            else if(timezone == -480){
                timezoneString = "WITA";
            }
            else if(timezone == -540){
                timezoneString = "WIT";
            }
            angular.forEach(allRoomList, function(entry) {
                entry['scheduleShow'] = $filter('date')(entry['schedule'], "yyyy-MM-dd | HH:mm:ss") + " " + timezoneString;
                entry['No'] = i;
                i++;
            });
            $scope.roomList = allRoomList;
            $scope.roomTable = new NgTableParams({ count: 8 },{dataset :allRoomList});
        })
        .error(function(error, status){
            console.log('error catch');
        });
    };

    $scope.searchRoom = function(room){
        angular.forEach(allRoomList, function(roomName){
            if(roomName.toLowerCase().equals(room.toLowerCase)){
                $scope.roomList = roomName;
            }
        });
    }

    $scope.completed = function(room){
        var output = [];
        angular.forEach(allRoomList, function(roomName){
            if(roomName.toLowerCase().indexOf(room.toLowerCase) >= 0){
                output.push(roomName);
            }
        });
        $scope.filterRoomBox = output;
    }

    $scope.filterRoomBox = function(room){
        $scope.searchRoomName = room;
        $scope.hidethis = true;
    }

    $scope.redirect = function(room){
        detailServices.setHistoryDetail(room.roomId);
        $location.url('/historydetail').replace();
    }

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}


app.component('history',{
    templateUrl:'app/components/history/history.html',
    controller: HistoryController
});