function PopUpSignIn($scope,Rest,$q, $location){
    var ctrl = this;

    ctrl.$onInit = function(){
        ctrl.getCaptcha();
    };

    ctrl.getCaptcha = function(){
        ctrl.generateCaptcha().then(function(result){
            document.getElementById('signin-captchaImage').src = result.data.image;
            localStorage.setItem('captchaId', result.data.id);
        })
    };

    $scope.reCaptcha = function(){
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
    
    $scope.login = function(){
        var loginParam = {};
        loginParam['loginId'] = $scope.email;
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
                            $location.url('/createroom').replace();
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
app.component('popupsignin',{
    templateUrl:'app/components/signin/popupsignin.html',
    controller: PopUpSignIn,
});