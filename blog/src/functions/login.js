import { ref } from "vue"

const globalLoginCondition = ref(false)

export function setLoginCondition(condition){
    globalLoginCondition.value = condition
}

export function getLoginCondition(){
    return globalLoginCondition.value
}
export function setUnLoginCondition(){
    globalLoginCondition.value = false
}

