function SignInController($scope,Rest,$q, $location,CONFIG){
    var ctrl = this;
    
    ctrl.$onInit = function(){
        // $scope.show = false;
        // $scope.alertValue = false;
        $scope.topMenu = CONFIG.topMenu;
        ctrl.getCaptcha();
    };

    // $scope.showPopUp = function(){
    //     var showValue = $scope.show;
    //     if(showValue == true){
    //         $scope.show = false;
    //     }else{
    //         $scope.show = true;
    //     }
    // };


    ctrl.getCaptcha = function(){
        ctrl.generateCaptcha().then(function(result){
            document.getElementById('signin-captchaImage').src = result.data.image;
            localStorage.setItem('captchaId', result.data.id);
        })
    };

    $scope.reCaptcha = function($event){
        $event.preventDefault();
        ctrl.generateCaptcha().then(function(result){
            document.getElementById('signin-captchaImage').src = result.data.image;
            localStorage.setItem('captchaId', result.data.id);
        });
    };

    ctrl.generateCaptcha = function(){
        var deferred = $q.defer();
        Rest.get('/v1/captcha')
            .success(function(result){
                deferred.resolve(result);
            });
        return deferred.promise;
    
    };
    
    $scope.login = function($event){
        $event.preventDefault();
        var loginParam = {};
        loginParam['loginId'] = $scope.emailAddress;
        loginParam['password'] = $scope.password;
        var captchaSecret = $scope.captchaSecret;
        validateCaptcha(captchaSecret).then(function(result){
            loginParam['captchaValid'] = result.data.isValid;
            if(result.status == 0 && result.data.isValid == 0){
                Rest.post('/v1/loginUser', loginParam)
                    .success(function(result){
                        if(result.status == 0){
                            localStorage.setItem('edplusId',result.data.edplusId);
                            localStorage.setItem('userRole',result.data.userRole);
                            localStorage.setItem('userId', result.data.userId);
                            localStorage.removeItem('captchaId');
                            if(result.data.userRole == 1){
                                $location.url('/createroom').replace();
                            }
                            else{
                                $location.url('/joinroom').replace(); 
                            }
                        }else{
                            $scope.alertValue = true;
                        }
                    })
                    .error(function(error, status){
                        console.log("error catch");
                    });
            }
        });
    };

    function validateCaptcha(captchaSecret){
        var deferred = $q.defer();
        var captcha = {};
        captcha['id'] = localStorage.getItem('captchaId');
        captcha['secret'] = captchaSecret;
        Rest.post('/v1/captcha',captcha)
            .success(function(result){
                if(result.data.isValid == 0){
                    deferred.resolve(result);
                }else{
                    $scope.alertValue = true;
                }
            })
            .error(function(error, status){
                console.log("error catch");
            });
            return deferred.promise;
    };

}

app.component('signin',{
    templateUrl:'app/components/signin/signin.html',
    controller: SignInController
});


