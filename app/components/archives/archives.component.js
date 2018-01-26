function Archives($scope,$route,Rest,CONFIG, locationService,userHeartBeatService){

    var ctrl = this;

    ctrl.$onInit = function(){
        userHeartBeatService.doHeartBeat();
        ctrl.getArchives();
        locationService.setSubLocation('Video Archives');
    };

    ctrl.getArchives = function(){

        Rest.get('/v1/archives').
        success(function(result){
            $scope.archiveList = result.data;
        })
        .error(function(error,status){

        });
    };

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarAdmin;
    $scope.$route = $route;
}

function ArchivesDetail($scope,$route,Rest,CONFIG){
    $scope.archive.instructorName = archives.insName;
    $scope.archive.roomName = archives.name;
    $scope.archive.totalDuration = archives.duration;
    $scope.archive.totalMember = archives.totalMember;
    
    $scope.downloadVideo = function(){
        //download video function
    }

    
    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarAdmin;
    $scope.$route = $route;
}


app.component('archives',{
    templateUrl:'app/components/archives/archives.html',
    controller: Archives
});

app.component('archivesdetail',{
    templateUrl:'app/components/archives/archivesDetail.html',
    controller: ArchivesDetail,
    bindings:{
        archives : '='
    }
});