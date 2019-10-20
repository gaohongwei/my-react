import axios from "axios";


export default axios.create({
  baseURL: "https://randomuser.me/api/",
  responseType: "json"
});


async function axios_get(path, options){
  axios.get(path, options)
}

async function axios_put(path, options){
  axios.put(path, options)
}
