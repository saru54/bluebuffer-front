import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const coreaxios = axios.create({
    baseURL:baseURL+"/core",
    
})


export default coreaxios;