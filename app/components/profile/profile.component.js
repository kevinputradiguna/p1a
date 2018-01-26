function ProfileController($scope,Rest,$q){
    var ctrl = this;
    
    ctrl.$onInit = function(){
        ctrl.getUserProfile();
    };

    ctrl.getUserProfile = function(){
        Rest.get('/v1/userProfile')
        .success(function(result){
            $scope.firstName = result.data.firstName;
            $scope.lastName = result.data.lastName;
            $scope.email = result.data.email;
            $scope.company = result.data.company;
            $scope.specialist = result.data.specialist;
            $scope.idDoctor = result.data.referenceId;
            $scope.profilePicture = result.data.picture;
        })
        .error(function(error, status){
            console.log("error catch");
        });
    };

    $scope.updateUserProfile = function(){
        var profile = {}
        profile['firstName'] = $scope.firstName;
        profile['lastName'] = $scope.lastName;
        profile['email'] = $scope.email;
        profile['company'] = $scope.company;
        profile['specialist'] = $scope.specialist;
        profile['idDoctor'] = $scope.idDoctor;
        profile['picture'] = $scope.picture;

        Rest.post('/v1/updateProfile', profile)
        .success(function(result){
            if(result.data.inserted == 0){
                console.log("success update");
            }
        })
        .error(function(error,status){
            console.log("error catch");
        });
    };

    $scope.topMenu = 'app/components/template/topmenu.html';
    $scope.sideBar = 'app/components/template/sidebarAdmin.html';
}

app.component('profile',{
    templateUrl:'app/components/profile/profile.html',
    controller: ProfileController
});
