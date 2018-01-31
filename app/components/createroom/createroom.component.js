function CreateRoomController($scope, Rest, $q, $sce, $route, $location, $compile, CONFIG, detailServices, locationService, NgTableParams, userHeartBeatService) {
    var ctrl = this;
    var arrayInstructor = [];
    $scope.email = [];
    // $scope.domList = [];
    $scope.skpPoints = 1;
    $scope.totalMembersInvited = 1;
    $scope.minWatching = 1;

    ctrl.$onInit = function () {
        userHeartBeatService.doHeartBeat();
        ctrl.initializeRoom();
        //document.getElementById('emailAppended').append('<div class="col-md-6" id="emails0"><input type="text" ng-model="email[0]"></div>');
        //document.createElement('<div class="col-md-12" id="emails0"><input type="text" ng-model="email[0]"/></div>')
        addEmailChild($scope.totalMembersInvited);
        $scope.data = {
            duration: null,
            availablesOption: [{
                    value: '30',
                    name: '30 Minutes'
                },
                {
                    value: '60',
                    name: '60 Minutes'
                },
                {
                    value: '90',
                    name: '90 Minutes'
                }
            ]
        }

        locationService.setSubLocation('Create Room');
    };

    // ctrl.createInitialElement(){
    //     var myoption = document.createElement("div");
    //     myOption.setAttribute("id","emails0");
    //     myoption.setAttribute("value", "carvalue");
    //     var text = document.createTextNode("maruti");
    //     myoption.appendChild(text);
    //     document.getElementById("mySelect").appendChild(myoption);
    // }

    ctrl.initializeRoom = function () {
        Rest.get('/v1/room')
            .success(function (result) {
                arrayInstructor = result.data;
            })
            .error(function (error, status) {
                console.log('error catch');
            });
    };

    // $scope.completed = function(ins){
    //     var outputName = [];
    //     angular.forEach(arrayInstructor, function(instructorId){
    //         if(instructorId.firstName.toLowerCase().indexOf(ins.toLowerCase()) >-1){
    //             outputName.push(instructorId);
    //         }
    //     });
    //     $scope.filterInstructor = outputName;
    // }

    // $scope.fillInstructorBox = function(ins){
    //     // var outputFull = [];
    //     // angular.forEach(arrayInstructor, function(instructorId){
    //     //     if(instructorId.firstName.toLowerCase().indexOf(ins.toLowerCase()) >-1){
    //     //         outputFull.push(instructorId);
    //     //     }
    //     $scope.instructor = ins.firstName+' '+ins.lastName;
    //     $scope.hidethis = true;

    // }

    $scope.completed = function (ins) {
        $scope.hidethis = false;
        var output = [];
        angular.forEach(arrayInstructor, function (instructorId) {
            if ((instructorId.firstName.toLowerCase().indexOf(ins.toLowerCase()) >= 0) || instructorId.lastName.toLowerCase().indexOf(ins.toLowerCase()) >= 0) {
                output.push(instructorId);
            }
        });
        $scope.filterInstructor = output;
    }

    var jsonInstructor = {};
    $scope.fillInstructorBox = function (ins) {
        $scope.instructor = ins.firstName + ' ' + ins.lastName;
        ctrl.findJson(ins.id, ins.firstName);
        $scope.hidethis = true;
    }

    ctrl.findJson = function (id, name) {
        resultJson = {};
        angular.forEach(arrayInstructor, function (jsonObj) {
            if (jsonObj.id == id) {
                resultJson = jsonObj;

            }
            jsonInstructor = resultJson;
        })
    };

    $scope.createRoom = function ($event) {
        $event.preventDefault();
        var roomObject = {};
        roomObject['instructor'] = jsonInstructor;
        roomObject['roomName'] = $scope.roomName;
        roomObject['schedule'] = $scope.date3;
        roomObject['duration'] = parseInt($scope.data.duration);
        roomObject['minWatching'] = $scope.minWatching;
        roomObject['skpPoint'] = $scope.skpPoints;
        roomObject['totalMember'] = $scope.email.length;
        roomObject['email'] = $scope.email;
        Rest.post('/v1/createDemo', roomObject)
            .success(function (result) {
                localStorage.setItem('sessionId', result.data.sessionId);
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('apiKey', result.data.apiKey);
                $location.url('/conference').replace();
            })
            .error(function (error, status) {

            });
    }


    function addEmailChild(numberEmail) {
        var number = numberEmail - 1;

        var innerElementHtml = document.createElement('input');
        innerElementHtml.setAttribute("type", "text");
        innerElementHtml.setAttribute("placeholder", "user@example.com");
        innerElementHtml.setAttribute("ng-model", "email[" + number + "]");
        $compile(innerElementHtml)($scope);

        var createdElement = document.createElement('div');
        createdElement.setAttribute("style", "padding-bottom:10px;");
        createdElement.setAttribute("class", "col-md-4");
        createdElement.setAttribute("id", "emails" + number);
        createdElement.appendChild(innerElementHtml);
        var documentAppended = document.getElementById('emailAppended');
        // var compile = $compile(innerElementHtml)($scope.email);

        documentAppended.appendChild(createdElement);
        // var htmlJson = {};
        // var htmlSyntax = "<div id=\"emails"+number+" class=\"col-md-12\"\"><input type=\"text\" ng-model=\"email["+number+"]\"/></div>";
        // htmlJson['html'] = htmlSyntax;
        //$scope.domList.push(document.createElement('<div class="col-md-12" id="emails'+number+'"><input type="text" ng-model="email['+number+']"></div>'));
        // $scope.domList.push($sce.trustAsHtml( htmlSyntax));
    }

    function removeEmailChild(numberEmail) {
        var number = numberEmail - 1;
        var documentAppended = document.getElementById('emailAppended');
        var child = document.getElementById('emails' + number);
        documentAppended.removeChild(child)
        // var documentTr = document.getElementById('emailTr');
        // var child = document.getElementById('emails'+number);
        // $scope.domList.splice(number,1);
    }

    var beforeInput = $scope.totalMembersInvited;
    $scope.inputNumberChanged = function () {
        if (beforeInput > $scope.totalMembersInvited) {
            var diff = beforeInput - $scope.totalMembersInvited;
            if ($scope.totalMembersInvited != 0 && $scope.totalMembersInvited != null) {
                for (var index = beforeInput; index > $scope.totalMembersInvited; index--) {
                    removeEmailChild(index);
                }
                beforeInput = $scope.totalMembersInvited;

            }
        } else if (beforeInput < $scope.totalMembersInvited) {
            // var diff =  $scope.totalMembersInvited - beforeInput;
            for (var index = beforeInput; index < $scope.totalMembersInvited; index++) {
                addEmailChild(index + 1);
            }
            beforeInput = $scope.totalMembersInvited;

        }
        //$scope.emailTable = new NgTableParams({page:1,count:5}, {counts:[5,10,20], dataset : $scope.domList, total : $scope.domList.length});
    }

    $scope.topMenu = CONFIG.topMenu;
    $scope.sideBar = CONFIG.sidebarAdmin;
    $scope.$route = $route;
}


app.component('createroom', {
    templateUrl: 'app/components/createroom/createroom.html',
    controller: CreateRoomController
});