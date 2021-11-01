import {makeAutoObservable} from "mobx";

interface CoinsObject {
    [key: string]: any
}

class CoinTableStore {
    coins: CoinsObject = {};
    socket: any;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.fetchCoins()
            .then(() => this.startSocket())
            .then(() => this.readSocket())
    }

    setCoinsData(data: any) {
        for (let i = 0; i < data.length; i++) {
            this.coins[data[i].id] = data[i];
        }
    }

    changeCoinsPrices(newPrices: any) {
        for (let coinId in newPrices) {
            if (this.coins[coinId]) {
                this.coins[coinId].priceUsd = newPrices[coinId];
            }
        }
    }

    fetchCoins() {
        return fetch("https://api.coincap.io/v2/assets")
            .then(res => res.json())
            .then(json => this.setCoinsData(json.data))
            .catch(() => setTimeout(this.fetchCoins, 1000))
    }

    startSocket() {
        this.socket = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
        this.socket.onclose = () => setTimeout(() => this.startSocket(), 5000);
    }

    readSocket() {
        if (this.socket instanceof WebSocket) {
            this.socket.onmessage = evt => {
                const newPrices = JSON.parse(evt.data);
                this.changeCoinsPrices(newPrices);
            }
        }
    }
}

export default new CoinTableStore();