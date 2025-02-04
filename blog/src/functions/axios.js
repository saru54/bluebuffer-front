import axios from "axios"

const baseURL =  import.meta.env.VITE_BaseUrl;
const axiosInstance = axios.create({
    baseURL:baseURL,
    
})


export default axiosInstance;