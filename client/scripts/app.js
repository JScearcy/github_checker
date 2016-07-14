var app = angular.module('StarterApp', ['ngMaterial', 'ngMessages']);

app.config(['$mdThemingProvider', function($mdThemingProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('grey');
}]);

app.controller('AppCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http){
    $scope.user = {};
    $scope.users = [];

    $scope.submitUser = function(user){
        $http.post("/challenge/add", user).then($scope.findUser());
    };

    $scope.findUser = function(){
        $http.get("/challenge/all").then(function(response){
            $scope.users = response.data;
            console.log($scope.users);
            statusCheck($scope.users);
        });
    };

    var statusCheck = function(array){
        for(var i = 0; i < array.length; i++) {
            var username = array[i].github;
            $http.get("https://api.github.com/users/" + username + "/repos?sort=updated")
                .success(function (data) {
                    findAndUpdatePerson(data);
                });
        }
    };

    var findAndUpdatePerson = function(githubPerson){
        githubPersonName = githubPerson[0].owner.login;

        for(var i = 0; i < $scope.users.length; i++){
            if(githubPersonName === $scope.users[i].github){
                var yesterday = moment().subtract(1, 'days').format("L");
                var today = moment().format("L");

                for(var j = 0; j < githubPerson.length; j++){
                    var commitMomment = moment(githubPerson[j].pushed_at).format("L");

                    if(yesterday == commitMomment){
                        $scope.users[i].yesterday = true;
                    }
                    if(today == commitMomment) {
                        $scope.users[i].today = true;
                    }
                }
                $scope.users[i].imageUrl = githubPerson[0].owner.avatar_url;
                $scope.users[i].link = "http://www.github.com/" + githubPersonName;
            }
        }
    };

    var checkYesterday = function(githubCheck, yesterday){
        if(githubCheck == yesterday){
            return true;
        } else {
            return false;
        }
    };

    $scope.findUser();
}]);

//test comment

