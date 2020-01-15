const validateMobileNos = function (mobileNos){

    if (mobileNos == null || mobileNos == "") {
        throw new Error("Mobile No is not provided.");
    }

    if(mobileNos instanceof Array){
        mobileNos = mobileNos.join(",");
    }
    return mobileNos
}

const validateMessage = function(message){

    if (message == null || message == "") {
        throw new Error("Message is not provided.");
    }

    return message;
}

const isUnicodeString =function(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 255) { return true; }
    }
    return false;
}

const isContainsNonLatinCodepoints = function (s) {
    return /[^\u0000-\u00ff]/.test(s);
}

module.exports = {
    validateMobileNos,
    validateMessage,
    isUnicodeString,
    isContainsNonLatinCodepoints
}