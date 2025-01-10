import { ref, toValue } from "vue";

export function useFetch(url){
    const data = ref(null)
    const error = ref(null)

    fetch(toValue(url)).then((response)=>response.json()).then((json)=>data.value = json).catch(err=> error.value =err)
    return {data,error}
}