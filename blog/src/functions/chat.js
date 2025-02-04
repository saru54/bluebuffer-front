import { reactive, ref } from "vue";

export const chatModelStore = reactive({
  visible: ref(false),
  data: ref(null),
  open() {
    this.visible = true;
  },
  close() {
    this.visible = false;
  },
  toggle(){
    this.visible = !this.visible
  },
  send(data){
    this.data =  data
  },
  clear(){
    this.data =null
  }
});
