import axios from 'axios'

export default class StockCryptoHandler {

    //TwelveData APIkey
    api_key = 'b6b8fb83c2044518a6c60785a4e9f5fa'

    //data gotten from TwelveData API
    stocks = 'https://api.twelvedata.com/stocks'
    cryptocurrencies = 'https://api.twelvedata.com/cryptocurrencies'

    //stock
    getAPI(symbol) {
        let API = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${this.api_key}`
        return axios.get(API)
    }

    //crypto
    getCryptoAPI(symbol, interval) {
        let API = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${this.api_key}`
        return axios.get(API)
    }

    getStocks() {
        return axios.get(this.stocks)
    }

    getCryptocurrencies() {
        return axios.get(this.cryptocurrencies)
    }
}