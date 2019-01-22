angular.module('home')
    .controller('homeController', ['$window', '$http', '$timeout', function($window, $http, $timeout) {
        this.insUrl = '';
        this.message = null;
        this.images = [];

        this.getResources = () => {
            if (!this.insUrl) {
                this.message = {
                    class: 'text-danger',
                    text: 'Please provide url!'
                };
                return;
            }
            $http
                .post('/endpoint/getImageResourcesFromUrl', { url: this.insUrl })
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        this.images = res.data;
                        console.log(this.images);
                        this.message = {
                            class: 'text-success',
                            text: 'Successfully get resources from this url.'
                        };
                    } else {
                        this.message = {
                            class: 'text-danger',
                            text: 'Failed to get resources from this url.'
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.message = {
                        class: 'text-danger',
                        text: err.data.message || 'Failed to get resources from this url.'
                    };
                });
        };

    }]);
