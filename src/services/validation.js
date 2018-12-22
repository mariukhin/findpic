const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

export function checkCard(url, result) {
    if(isValid(pattern, url)){
        return checkPresence(result);
    }else{
        alert("Your card isn`t valid!");
    }
}
export function checkPresence(result) {
    if(result){
        alert("This card is alredy been added!");
        return false;
    }else{
        return true;
    }
}
export function isValid(pattern, val) {
    return pattern.test(val);
}