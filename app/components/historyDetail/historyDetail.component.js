function HistoryDetail($scope, $route,CONFIG,Rest,detailServices,locationService,historyMemberService, NgTableParams, userHeartBeatService){
    var ctrl = this;
    
    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.getHistoryDetail();
        locationService.setSubLocation('History Detail');
    };
    
    ctrl.getHistoryDetail = function(){
        var headers = {
            'X-TOKEN': localStorage.getItem('edplusId'),
            'X-ROOMID' : detailServices.getHistoryDetail()
        }
        Rest.get('/v1/roomHistoryDetail', headers)
        .success(function(result){
            ctrl.roomheader = {
                roomName: result.data.room.roomName,
                schedule: result.data.room.schedule,
                duration: result.data.room.duration,
                totalMember: result.data.room.totalMember
            };

            ctrl.instructor = {
                name: result.data.roomMember[0].instructor
            };

        var members = [];
        var i = 1;
        angular.forEach(result.data.roomMember, function(entry) {
            if("memberName" in entry){
            entry['No'] = i;
            i++;
            members.push(entry);
        }
        });

        $scope.memberTable = new NgTableParams({ count: 8 },{dataset :members});

        })
        .error(function(error,status){
            console.log('error catch');
        });
    };

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}

app.component('historydetail',{
    templateUrl:'app/components/historyDetail/historyDetail.html',
    controller: HistoryDetail
});
