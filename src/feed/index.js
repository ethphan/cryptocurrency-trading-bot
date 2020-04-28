const CoinbasePro  = require('coinbase-pro')
const config = require('../../configuration')

const key = config.get('COINBASEPRO_API_KEY')
const secret = config.get('COINBASEPRO_API_SECRET')
const passphrase = config.get('COINBASEPRO_API_PASSPHRASE')
const wsUrl = config.get('COINBASEPRO_WS_URL')

class Feed  {
    constructor({ product, onUpdate, onError}) {
        this.product = product
        this.onUpdate = onUpdate
        this.onError = onError
        this.running = false
    }

    async start() {
        this.running = true
        this.socket = new CoinbasePro.WebsocketClient(
            [this.product],
            wsUrl,
            {key, secret, passphrase},
            {channels: ['user', 'heartbeat']}
        )

        this.socket.on('message', data => {
            if(data.type === 'heartbeat') { return }
            this.onUpdate(data)
        })

        this.socket.on('error', error => {
            this.onError(error)
            this.socket.connect()
        })

        this.socket.on('close', () => {
            if(this.running) {
                this.socket.connect()
            }
        })
    }

    async stop() {
        this.running = false
        this.socket.close()
    }

}

module.exports = exports = Feed