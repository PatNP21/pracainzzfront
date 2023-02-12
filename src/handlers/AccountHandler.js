import axios from 'axios'

export default class AccountHandler {

    baseURL = 'http://localhost:2023'

    registerNewUser(data) {
        return axios.post(`${this.baseURL}/registerClient`, data)
    }

    logToService(data) {
        return axios.post(`${this.baseURL}/login`, data)
    }

    verifyEmail(data) {
        return axios.post(`${this.baseURL}/getEmail`, data)
    }

    setNewPassword(id, data) {
        return axios.put(`${this.baseURL}/changePassword/${id}`, data)
    }
}