/**
 * @author wangxiao
 * 
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

'use strict';

angular.module('atomApp')
.factory('wdAccount', 
['$rootScope', '$http', 'wdStorage', '$q',
function($rootScope, $http, wdStorage, $q) {
    // 是否检查过登录状态
    var isCheckLoginFlag = false;
    return {
        check: function() {
            var d = $q.defer();
            if (isCheckLoginFlag) {
                if (wdStorage.item('isLogin')) {
                    d.resolve({
                        is_succ: true
                    });
                } else {
                    d.resolve({
                        is_succ: false
                    });
                }
            } else {
                isCheckLoginFlag = true;
                $http.get('/check').then(function(data) {
                    if (data.is_succ) {
                        wdStorage.item('isLogin', true);
                        d.resolve({
                            is_succ: true
                        });
                    } else {
                        wdStorage.removeAll();
                        d.resolve({
                            is_succ: false
                        });
                    }
                });
            }
            return d.promise;
        },
        verifyPhone: function(num) {
            return $http.get('/verify', {
                params: {
                    phone: String(num)
                }
            });
        },
        register: function(opts) {
            var p = $http.post('/register', opts);
            p.then(function(data) {
                if (data.is_succ) {
                    wdStorage.item('isLogin', true);
                }
            });
            return p;
        },
        login: function(opts) {
            wdStorage.removeAll();
            var p = $http.post('/login', opts);
            p.then(function(data) {
                if (data.is_succ) {
                    wdStorage.item('isLogin', true);
                    if (data.is_set_info) {
                        wdStorage.item('is_set_info', true);
                    }
                    if (data.is_set_risk) {
                        wdStorage.item('is_set_risk', true);
                    }
                }
            });
            return p;
        },
        logout: function() {
            wdStorage.removeAll();
            return $http.get('/logout');
        },
        setInfo: function(opts) {
            var p = $http.post('/set_info', opts);
            p.then(function(data) {
                if (data.is_succ) {
                    wdStorage.item('is_set_info', true);
                }
            });
            return p;
        },
        getInfo: function() {
            return $http.get('/get_info');
        },
        setRisk: function(opts) {
            var p = $http.post('/risk', opts);
            p.then(function(data) {
                if (data.is_succ) {
                    wdStorage.item('is_set_risk', true);
                }
            });
            return p;
        },
        changePassword: function(opts) {
            return $http.post('/change_password', opts);
        },
        verifyPasswordPhone: function(num) {
            return $http.get('/find_password', {
                params: {
                    phone: String(num)
                }
            });
        },
        findPassword: function(opts) {
            return $http.post('/find_password', opts);
        }
    };
    // 结束 
}]);
