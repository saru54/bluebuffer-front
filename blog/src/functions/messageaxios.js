import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const messageaxios = axios.create({
    baseURL:baseURL+"/ms",
    
})


export default messageaxios;