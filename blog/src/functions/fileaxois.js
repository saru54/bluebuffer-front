import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const fileaxios = axios.create({
    baseURL:baseURL+"/file",
    
})


export default fileaxios;