import axios from "axios";


const http = axios.create({
  url: '/'
})

http.interceptors.request.use(config => config, err => err);

http.interceptors.response.use(data => {
  if (data.status === 200) {
    return data.data
  } else {
    return {
      code: -1,
      ...data
    }
  }
})

export default http;