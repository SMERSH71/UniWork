const shemas = require("./shemas.json")

class dataChecker {
    checkData(name, obj) {
        if(JSON.stringify(obj) == "{}" || obj == undefined || typeof obj !== "object") return false//0
        let o, l , t, r = true//1
        for (var key in obj) {
            o = shemas[name][key]
            if(typeof o === "undefined" && !o.isnull) r = false//0
            if (o.check && !o.isnull) {
                l = this.checkLength(obj[key], o.length, o.valid)
                t = this.checkType(obj[key], o.type)
                if(!l || !t) r = false//0
            }
        }
        return r
    }
    checkLength(data, length, type){
        switch (type) {
            case "=":
                if((''+data).length == length){
                    return true//1
                }
                break;
            case "<=":
                if((''+data).length <= length && (''+data).length != 0){
                    return true//1
                }
                break;

            default:
                break;
        }
        return false//0
    }
    checkType(data, type) {
        if(type == "number") data = +data
        if(isNaN(data) && type != "string") return false//0
        if(typeof data === type){
            return true//1
        }else{
            return false//0
        }
    }
}

module.exports = new dataChecker() 