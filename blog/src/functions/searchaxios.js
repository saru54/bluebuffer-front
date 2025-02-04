import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const searchaxios = axios.create({
    baseURL:baseURL+"/search",
    
})


export default searchaxios;