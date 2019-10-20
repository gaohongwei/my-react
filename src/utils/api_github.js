import axios from "axios";

export default  function getUser(username){
  return axios.get(`https://api.github.com/users/${username}`)
}

