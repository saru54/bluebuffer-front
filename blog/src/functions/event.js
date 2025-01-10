import { onMounted, onUnmounted } from "vue";

export function useEventListener(target,event,callBack){
    onMounted(()=>{
        target.addEventListener(event,callBack)
    })
    onUnmounted(()=>{
        target.removeEventListener(event,callBack)
    })
}