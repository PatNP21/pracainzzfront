import axios from 'axios'
import { finnhubClient, FinnhubProvider, useFinnhub} from 'react-finnhub'

export default class StockCryptoHandler {

    //backendURL
    baseURL = 'http://localhost:2023'

    //TwelveData APIkey
    api_key = 'b6b8fb83c2044518a6c60785a4e9f5fa'

    //FinnhubAPI key
    client_stock = 'cd5835aad3i7v64c6g9gcd5835aad3i7v64c6ga0'

    //data gotten from TwelveData API
    stocks = 'https://api.twelvedata.com/stocks'
    cryptocurrencies = 'https://api.twelvedata.com/cryptocurrencies'

    //stock
    getAPI(symbol) {
        let API = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${this.api_key}`
        return axios.get(API)
    }

    //crypto
    getCryptoAPI(symbol) {
        let API = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${this.api_key}`
        return axios.get(API)
    }

    getStocks() {
        return axios.get(this.stocks)
    }

    getCryptocurrencies() {
        return axios.get(this.cryptocurrencies)
    }

    paymentSession(data) {
        return axios.post(`${this.baseURL}/createPaymentSession`, data)
    }

    buyStock(data) {
        return axios.post(`${this.baseURL}/buyStock`, data)
    }

    buyCrypto(data) {
        return axios.post(`${this.baseURL}/buyCrypto`, data)
    }

    getBoughtStock(id) {
        return axios.get(`${this.baseURL}/getBoughtStock/${id}`)
    }

    getAmountOfStock(id) {
        return axios.get(`${this.baseURL}/getCountOfStock/${id}`)
    }

    getBoughtCrypto(id) {
        return axios.get(`${this.baseURL}/getBoughtCrypto/${id}`)
    }

    getAmountOfCrypto(id) {
        return axios.get(`${this.baseURL}/getCountOfCrypto/${id}`)
    }

    updateStock(id) {
        return axios.post(`${this.baseURL}/updateStock`, id)
    }

    updateCrypto(id) {
        return axios.post(`${this.baseURL}/updateCrypto`, id)
    }
}