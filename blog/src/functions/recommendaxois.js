import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const recommendaxios = axios.create({
    baseURL:baseURL+"/rec",
    
})


export default recommendaxios;