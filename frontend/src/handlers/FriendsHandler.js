import axios from 'axios'

export default class FriendsHandler {
    
    baseURL = 'http://localhost:2023'

    sendRequest(data) {
        return axios.post(`${this.baseURL}/sendRequest`, data)
    }

    getRequests(id) {
        return axios.get(`${this.baseURL}/getRequests/${id}`)
    }

    undoRequest(data) {
        return axios.post(`${this.baseURL}/undoRequest`, data)
    }

    addFriend(data) {
        return axios.post(`${this.baseURL}/addFriend`, data)
    }

    getFriends(id) {
        return axios.get(`${this.baseURL}/getFriends/${id}`)
    }

    deleteFriend(id, data) {
        return axios.post(`${this.baseURL}/deleteFriend/${id}`, data)
    }

    blockUser(id, data) {
        return axios.post(`${this.baseURL}/blockUser/${id}`, data)
    }

    unblockUser(id, data) {
        return axios.post(`${this.baseURL}/unblockUser/${id}`, data)
    }
}