/**
 *
 * @param authKey
 * @param senderId
 * @param route : Value can be 1 for Promotional Router or 4 for Transactional Route
 */
module.exports = function (authKey, senderId) {

    if (authKey == null || authKey == "") {
        throw new Error("Authorization Key not provided.");
    }

    if (senderId == null || senderId == "") {
        throw new Error("Sender Id is not provided.");
    }

    /* if (route == null || route == "") {
        throw new Error("MSG91 router Id is not provided.");
    } */

    this.smsCount = function (message, callback) {

        callback = modifyCallbackIfNull(callback);

        message = validateMessage(message);

        var isUnicode = isUnicodeString(message);
        
        // for fixing this issue - http://help.msg91.com/article/59-problem-with-plus-sign-api-send-sms
        
        var specialChars = ['+', '&', '#', '%', '@', '/', ';', '=', '?', '^', '|']; // EncodeUriComponent Doesn't work on ! * ( ) . _ - ' ~ `
        
        if (specialChars.some(function (v) {
                return message.indexOf(v) >= 0;
            })) {
            // if there is at least one special character present in message string
            message = encodeURIComponent(encodeURIComponent(message));
        }

        var postData = "&message=" + message;
        //sender_id=BLKSMS&mobile_no=9876543210%2C987456321&message=YOUR_MESSAGE'
         //+ "&country_coded=" + countryCode
        if(isUnicode){
            postData += "&unicode=1";
        }
        var options = {
            hostname: 'digicools.online',
            port: 80,
            path: '/api_v2/message/count',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                "authorization": `Bearer ${authKey}`,
                "Cache-Control": "no-cache",
            }
        };

        makeHttpRequest(options, postData, function(err, data){
            callback(err, data);
        });
    };
    this.sendSMS = function (mobileNos, message, callback) {

        callback = modifyCallbackIfNull(callback);

        mobileNos = validateMobileNos(mobileNos);

        message = validateMessage(message);

        var isUnicode = isUnicodeString(message);
        
        // for fixing this issue - http://help.msg91.com/article/59-problem-with-plus-sign-api-send-sms
        
        var specialChars = ['+', '&', '#', '%', '@', '/', ';', '=', '?', '^', '|']; // EncodeUriComponent Doesn't work on ! * ( ) . _ - ' ~ `
        
        if (specialChars.some(function (v) {
                return message.indexOf(v) >= 0;
            })) {
            // if there is at least one special character present in message string
            message = encodeURIComponent(encodeURIComponent(message));
        }

        var postData = "&sender_id=" + senderId + "&mobile_no=" + mobileNos + "&message=" + message;
        //sender_id=BLKSMS&mobile_no=9876543210%2C987456321&message=YOUR_MESSAGE'
         //+ "&country_coded=" + countryCode
        if(isUnicode){
            postData += "&unicode=1";
        }

        var options = {
            hostname: 'digicools.online',
            port: 80,
            path: '/api_v2/message/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                "authorization": `Bearer ${authKey}`,
                "Cache-Control": "no-cache",
            }
        };

        makeHttpRequest(options, postData, function(err, data){
            callback(err, data);
        });
    };

    this.getBalance = function(callback) {

        if(arguments.length == 1) {
            callback = customRoute;
            customRoute = null;
        }

        callback = modifyCallbackIfNull(callback);

        //var currentRoute = customRoute || route;

        var options = {
            hostname: 'digicools.online',
            port: 80,
            path: '/api_v2/user/balance?api_key=' + authKey,
            method: 'GET'
        };

        makeHttpRequest(options, null, function(err, data){
            callback(err, data);
        });
    }
    this.getSMSCount = function(message) {

        if(arguments.length == 1) {
            callback = customRoute;
            customRoute = null;
        }

        callback = modifyCallbackIfNull(callback);

        var isUnicode = isUnicodeString(message);

        var options = {
            hostname: 'digicools.online',
            port: 80,
            path: '/api_v2/message/count?api_key='+authKey+"&message="+message+"&unicode="+isUnicode,
            method: 'GET'
        };

        makeHttpRequest(options, null, function(err, data){
            callback(err, data);
        });
    }

    return this;

};

function validateMobileNos(mobileNos){

    if (mobileNos == null || mobileNos == "") {
        throw new Error("MSG91 : Mobile No is not provided.");
    }

    if(mobileNos instanceof Array){
        mobileNos = mobileNos.join(",");
    }

    return mobileNos
}

function validateMessage(message){

    if (message == null || message == "") {
        throw new Error("MSG91 : message is not provided.");
    }

    return message;
}

function modifyCallbackIfNull(callback){
    return callback || function(){};
}

function isUnicodeString(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 255) { return true; }
    }
    return false;
}

function makeHttpRequest(options, postData, callback) {

    var http = require("http");
    var data = "";
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback(null, data);
        })
    });

    req.on('error', function (e) {
        callback(e);
    });

    if(postData!=null){
        req.write(postData);
    }

    req.end();

}