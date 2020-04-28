class Candlestick {
    constructor({
        low, high, close, open, price, interval, startTime = new Date(), volume
    }) {
        this.startTime = startTime
        this.interval = interval
        this.open = open || price
        this.close = close  || price
        this.high = high  || price
        this.low = low   || price
        this.volume = volume || 1e-5
        this.state = close ? 'close' : 'open'
    }

    average(){
        return (this.close + this.high + this.low)/3
    }

    onPrice({ price, volume, time = new Date() }) {
        if(this.state === 'closed') {
            throw new Error('Trying to add to closed candlestick')
        }

        this.volume = this.volume + volume

        if(this.high < price) { this.high = price }
        if(this.low > price) { this.low = price }

        this.close = price

        const delta = (time - this.startTime)* 1e-3 // ==0.001

        if(delta >= this.interval) {
            this.state = 'closed'
        }
    }
}

module.exports = Candlestick;