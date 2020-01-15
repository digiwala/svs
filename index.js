const axios = require('axios').default
let baseUrl = `http://digicools.online`;
const { validateMobileNos,validateMessage,isUnicodeString,isContainsNonLatinCodepoints } = require('./helper')

let SVSAPI = axios.create({
    baseURL:baseUrl,
    Headers:{
        "Cache-Control": "no-cache",
    }
})

class SVS {
    constructor(apiKey){
        this.apiKey = apiKey || null
    }
    async getSMSCounts ({apiKey, message, unicode}){
        try {
            let result =  await SVSAPI.get(
                `${baseUrl}/api_v2/message/count`,
                {
                    params:{
                        api_key:apiKey || this.apiKey,
                        message:message,
                        unicode:unicode || isUnicodeString(message) || 0
                    }
                }
            )
            console.log(result.data.data)
            return result.data.data
        } catch (error) {
            return error       
        }
    }
    async checkBalance(apiKey){
        try {
            let result =  await SVSAPI.get(
                `${baseUrl}/api_v2/user/balance`,
                {
                    params:{
                        api_key: apiKey || this.apiKey
                    }
                }
            )
            //console.log(result.data.data)
            return result.data.data
        } catch (error) {
            return error       
        }
    }
    async filterMobileNumbers({apiKey,mobileNumbers}){
        let validatedMobileNos =  validateMobileNos(mobileNumbers);
        try {
            let result =  await SVSAPI.get(
                `/api_v2/contact/filter_number`,
                {
                    params:{
                        api_key:apiKey || this.apiKey,
                        mobile_number:validatedMobileNos
                    }
                }
            )
            //console.log(result.data.data)
            return result.data.data
        } catch (error) {
            return error       
        }
    }
    async userSignUp({apiKey,name,username,mobile,email}){
        try {
            let result =  await SVSAPI.post(
                `${baseUrl}/api_v2/user/signup`,
                {
                    name:name || '',
                    username:username || '',
                    mobile_no:mobile || '7000547479',
                    email:email ||'ajayst27@gmail.com'
                },
                {
                    headers:{
                        authorization: `Bearer ${apiKey || this.apiKey}`,
                    },
                },
            )
            //console.log(result.data.data)
            return result.data
        } catch (error) {
            //console.log('error' + error)
            return error       
        }
    }
    async manageClientCredit({apiKey,username,creditType,credit,serviceType,pricePerCredit}){
        try {
            let result =  await SVSAPI.post(
                `${baseUrl}/api_v2/user/credit`,
                {
                    username:username || '',
                    credit_type:creditType || 'sms', // 'sms' || 'voice'
                    credit:credit || '5',
                    service_type:serviceType || 'open_dnd', //Transactional,Promotional,open_dnd,voice_call
                    price_per_credit:pricePerCredit || '.20',
                },
                {
                    headers:{
                        authorization: `Bearer ${apiKey || this.apiKey}`,
                    },
                },
            )
            //console.log(result.data.data)
            return result.data
        } catch (error) {
            //console.log('error' + error)
            return error       
        }
    }
    async sendSMS({apiKey,senderId,message,mobileNumbers,scheduleDateTime,countryCode}){
        let isUnicode = isUnicodeString(message);
        let validatedMobileNos = validateMobileNos(mobileNumbers);
        let filteredMobileNos = await this.filterMobileNumbers({mobileNumbers:validatedMobileNos})
        var data = {
            sender_id: senderId,
            message: message,
            mobile_no: filteredMobileNos,
        }
        scheduleDateTime ? data.schedule_date_time = scheduleDateTime : null
        countryCode ? data.country_coded = countryCode : null
        //isUnicodeString ? data.unicode = true : null
        try {
            let result =  await SVSAPI.post(
                `${baseUrl}/api_v2/message/send`,
                data,
                {
                    headers:{
                        authorization: `Bearer ${apiKey || this.apiKey}`,
                    },
                },
            )
            console.log(result.data.data)
            return result.data
        } catch (error) {
            console.log('error' + error)
            return error       
        }
    }
    async sendUnicodeSMS({username,password,senderId,message,mobileNumbers,flash,scheduleDateTime,countryCode}){
        var data = {
            username:username,
            password:password,
            sender:senderId,
            message:message,
            numbers:mobileNumbers,
            flash:flash || false
        }
        scheduleDateTime ? data.posting_time = scheduleDateTime : null
        countryCode ? data.country_coded = countryCode : null
        let isUnicode = isUnicodeString(message);
        isUnicode ? data.unicode = true : null 
        try {
            let result =  await SVSAPI.get(
                `${baseUrl}/api/pushsms.php`,
                {
                    params:data
                }
            )
            console.log(result)
            return result.data
        } catch (error) {
            return error       
        }
    }
}
module.exports = SVS;

