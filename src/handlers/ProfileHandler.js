import axios from 'axios'

export default class ProfileHandler {
    
    baseURL = 'http://localhost:2023'

    getUser(id) {
        return axios.get(`${this.baseURL}/getUser/${id}`)
    }
}