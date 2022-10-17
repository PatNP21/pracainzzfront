import axios from 'axios'

export default class PostHandler {
    
    baseURL = 'http://localhost:2023'

    getPosts() {
        return axios.get(`${this.baseURL}/getAllPosts`)
    }

    getUserPosts(id) {
        return axios.get(`${this.baseURL}/getUsersPosts/${id}`)
    }

    writePost(data) {
        return axios.post(`${this.baseURL}/writePost`, data)
    }

    deletePost(data, id) {
        return axios.post(`${this.baseURL}/deletePost/${id}`, data)
    }

    getAuthorById(id) {
        return axios.get(`${this.baseURL}/getAuthor/${id}`)
    }

    getComments(id) {
        return axios.get(`${this.baseURL}/getComments/${id}`)
    }

    writeComment(data) {
        return axios.post(`${this.baseURL}/addComment`, data)
    }

}