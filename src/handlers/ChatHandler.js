import axios from 'axios'

export default class ChatHandler {

    baseURL = 'http://localhost:2023'

    getAllUsers() {
        return axios.get(`${this.baseURL}`)
    }

    saveChatMessage(data) {
        return axios.post(`${this.baseURL}/addChatMessage`, data)
    }
    
}