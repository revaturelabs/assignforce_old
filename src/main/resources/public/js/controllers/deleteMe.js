app.controller('LoginCtrl', function($scope, $httpParamSerializerJQLike, $http, SITE_URL, API_URL, ROLE) {

    $scope.login = function() {
        console.log('LOGIN CALLLED');
        makeUser($scope);
        console.log('MAKE USER CALLED');
        $http({
            method : "POST",
            url : SITE_URL.BASE + API_URL.BASE + API_URL.LOGIN,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'},
            data: $httpParamSerializerJQLike($scope.user)
        })//.post(SITE_URL.BASE + API_URL.BASE + API_URL.LOGIN, $httpParamSerializerJQLike($scope.user), {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'})
            .then(function(response) {
                console.log('INSIDE POST TO LOGIN');
                $http.get(SITE_URL.BASE + API_URL.BASE + API_URL.AUTH)
                    .then(function(response) {
                        console.log("Response data");
                        console.log(response.data);
                        if (response.data.authenticated) {
                            var authUser = {
                                username : response.data.principal.username,
                                authority: response.data.principal.authorities[0].authority
                            }
                            //console.log(authUser);
                            //console.log(response.data.principal);
                            $scope.authUser = authUser;
                            switch ($scope.authUser.authority) {
                                case ROLE.RECRUITER:
                                    window.location = SITE_URL.VIEW_CANDIDATES;
                                    break;
                                case ROLE.CANDIDATE:
                                    $scope.candidateEmail = authUser.username;
                                    $http.get(SITE_URL.BASE + API_URL.BASE + API_URL.CANDIDATE + $scope.candidateEmail + API_URL.LINK)
                                        .then(function(response) {
                                            console.log(response.data);
                                            window.location = response.data.urlAssessment;
                                            console.log('CHOOCKED');
                                        })
                                    break;
                                case ROLE.TRAINER:
                                    window.location = SITE_URL.TRAINER_HOME;
                                    break;
                                case ROLE.ADMIN:
                                    window.location = SITE_URL.VIEW_EMPLOYEES;
                                    break;
                                default:
                                    console.log('INVALID LOGIN?');
                                    $scope.username = '';
                                    $scope.password = '';
                                    window.location = SITE_URL.LOGIN;
                            }
                        } else {
                            console.log('!!! INVALID LOGIN');
                            $scope.username = '';
                            $scope.password = '';
                            $scope.bunkCreds = true;
                        }
                    })
            })
    }
}); //end login controller