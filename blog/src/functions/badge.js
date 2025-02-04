import { reactive, ref } from "vue"


// export const infoCountStore = reactive({
//   count: ref(10),
//   data: ref(null),
//   add(){
//     this.count++;
//   },
//   clear(){
//     this.count =0
//   }
// });
export const messageCountStore = reactive({
    count: ref(0),
    data: ref(null),
    add(){
        this.count++;
      },
      clear(){
        this.count =0
      }
  });