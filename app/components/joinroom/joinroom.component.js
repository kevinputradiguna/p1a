function JoinroomController($scope, Rest, $q, $route, $location, $filter, $sce, $resource,CONFIG,detailServices,locationService,NgTableParams, userHeartBeatService, profileConference){
    var ctrl = this;
    var arrayJoinroom = [];

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.initializeList();
        locationService.setSubLocation('Join Room');
    };

    ctrl.initializeList = function(){
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId") 
        };
        Rest.get('/v1/roomList', hdrs)
        .success(function(result){
            arrayJoinroom = result.data;
            var i = 1;
            //create date with UTC timestamp to compare with UTC from Database
            var timeUtc = new Date().getTime();
            // console.log(timeUtc);
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
            angular.forEach(arrayJoinroom, function(entry) {
                //IF - ELSE for check time, show button if
                if(timeUtc > entry['schedule'] && entry['instructorId'] == localStorage.getItem('userId')){
                    entry['showStartButton'] = true;
                    entry['showJoinButton'] = false;
                    entry['showSchedule'] = false;
                
                    // entry['scheduleShow'] = $sce.trustAsHtml('<a id=\"'+entry['roomName']+'\" class=\"btn btn-danger\" onclick=\"join('+entry['roomName']+')\">Join Room</a>');
                    // entry['scheduleShow'] = $sce.trustAsHtml('<a ng-href=\"#;\" ng-click=\"joiningRoom(\''+entry['roomName']+'\','+entry['schedule']+');\" class=\"btn btn-danger\">Start Room</a>');
                }
                else if(timeUtc > entry['schedule'] && entry['instructorId'] != localStorage.getItem('userId') && entry['status'] == 3){
                    entry['showStartButton'] = false;
                    entry['showJoinButton'] = true;
                    entry['showSchedule'] = false;
                    // entry['scheduleShow'] = $sce.trustAsHtml('<a ng-href=\"#;\" ng-click=\"joiningRoom();\" class=\"btn btn-primary\">Join Room</a>');
                }
                else{
                    entry['showStartButton'] = false;
                    entry['showJoinButton'] = false;
                    entry['showSchedule'] = true;
                    entry['scheduleShow'] = $sce.trustAsHtml($filter('date')(entry['schedule'], "yyyy-MM-dd | HH:mm:ss") +" "+ timezoneString);
                }
                entry['NO'] = i;
                i++;
            });
            $scope.arraysdata = arrayJoinroom;
            $scope.arrays = arrayJoinroom;
            $scope.tableParamsTable = new NgTableParams({ count: 8 }, { dataset: $scope.arrays });



        })
        .error(function(error, status){
            console.log('error catch');
        });

    };




    $scope.redirectTo = function(data){
        detailServices.setEvaluationDetail(data.roomId);
        $location.url('/evaluationDetail').replace();
    };

    
    $scope.joiningRoom = function(roomName, schedule){
        localStorage.setItem('roomName', roomName);
        console.log("this enter");
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId")
        };
        var body = {}
        body['roomName'] = roomName;
        body['schedule'] = schedule;

        Rest.post('/v1/joinRoom', body, hdrs)
        .success(function(result){
            if(result.status == 0){
                localStorage.setItem('sessionId', result.data.sessionId);
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('apiKey', result.data.apiKey);
                profileConference.setProfileConference(result.data.profileData);
                localStorage.setItem('propic',result.data.profileData.picture);
                localStorage.setItem('insId', result.data.insId);
                localStorage.setItem('isInstructor', result.data.isInstructor);
                localStorage.setItem('roomMember', JSON.stringify(result.data.memberData));
                localStorage.setItem('totalMember',result.data.totalMember);
                $location.url('/conference').replace();
            }
        })
        .error(function(error, status){
            console.log("error catch");
        });

    }

    function join(roomName){
        var scope = angular.element(document.getElementById(roomName)).scope();
        scope.$apply(function(roomName){
            scope.joiningRoom(roomName);
        })
    }
    
    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarGuest;
    $scope.$route = $route;
}

app.component('joinroom',{
    templateUrl:'app/components/joinroom/joinroom.html',
    controller: JoinroomController
});
