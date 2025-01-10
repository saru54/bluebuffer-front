import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
const globalLoginCondition = ref(false)

export const loginEntity = reactive({
    login(){
        globalLoginCondition.value = true
    },
    unLogin(){
        globalLoginCondition.value = false
    },
    get(){
        return globalLoginCondition.value;
    }
})

export function useLoginConditionDetect(){
    const router = useRouter()
    if(globalLoginCondition.value == false){
        router.push('/LoginPage')
    }
    watch(globalLoginCondition,(newValue)=>{
        if(newValue==false){
            router.push('/LoginPage')
        }
    })
}