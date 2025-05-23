import axios from "axios";



 const AxiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true,
})

const useAxiosPublic = () => {
  return AxiosPublic;
};

export default useAxiosPublic;

