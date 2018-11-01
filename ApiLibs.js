/**
 * @author Work
 * @stateless
 */
define('ApiLibs', ['http-context'], function (HttpContext) {
    return function () {
        var self = this;
        
        /*
         * Проверка набора входящих параметров.
         * @param {object} aParams - набор пораметров из http.request.params
         * @param {mas} aRequiredFields - массив обязательных параметров
         * @returns {unresolved}
         */
        self.checkRequiredParams = function(aRequiredFields, callback, onSuccessCallback){
            var err = false;
            var aHttpContext = new HttpContext();
            var requestParams = (aHttpContext.request ? aHttpContext.request.params : aHttpContext);
            var params = {};
            aHttpContext.response.status = 200;
            //aHttpContext.response.headers.add("Access-Control-Allow-Origin", "*");
            aHttpContext.response.contentType = 'text/json';
            for (var i in requestParams){
                params[i] = self.str2Bool(requestParams[i]);
            }
            var unfilled = [];
            aRequiredFields.forEach(function(field){
                if (!params[field]) {
                    err = true;
                    unfilled.push(field)
                }
            });
            if(err){
                self.setResponseCode(aHttpContext, {
                    header: 'Bad params',
                    explanation: unfilled.toString()
                }, 409, onSuccessCallback);
            }
            else{
                if(!callback)
                    return params;
                else callback(params, aHttpContext);
            }
        };
        
        /**
         * Вернуть ответ с http кодом
         * @param {type} aHttpContext
         * @param {type} aCode
         * @param {type} aResponse
         * @returns {undefined}
         */
        self.setResponseCode = function(aHttpContext, aResponse, aCode, aCallback){
            aHttpContext.response.status = aCode ? aCode : 200; 
            aHttpContext.response.headers.add("Access-Control-Allow-Origin", "*");
            aHttpContext.response.contentType = 'text/json';
            if(aCallback)
                aCallback(aResponse);
            else
                aHttpContext.response.body = JSON.stringify(aResponse); //так лучше не делать, почему то все ломает
        };
        
        /**
         * На вход может приходить примитив типа boolean или null в качестве строки
         * 'false', 'true', 'null' что не хорошо
         * Этот метод производит сериализацию и возвращает false если 'false', null если null и т.д.
         * @param {type} str
         * @returns {undefined}
         */
        self.str2Bool = function(str){
            if(str == 'false' || str == false)
                return false;
            else if(str == 'true' || str == true)
                return true;
            else if(str == 'null' || str == null)
                return null;
            else return str;
        }
    };
});
