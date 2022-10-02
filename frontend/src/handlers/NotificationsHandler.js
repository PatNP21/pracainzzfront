import axios from 'axios'

export default class NotificationsHandler {
    baseURL = 'http://localhost:2023'

    getNotifications() {
        return axios.get(`${this.baseURL}/getNotifications`)
    }
}