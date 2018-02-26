var mqtt = require('mqtt')

const MQTT_ADDR = 'mqtt://rasperrypi:18831'
const MQTT_CLIENTID = 'mqtt2influx'


var client = mqtt.connect(MQTT_ADDR, {
    clientId: MQTT_CLIENTID,
    connectTimeout: 1000,
    reconnecting: true,
    debug: true
})

client.on('connect', () => client.subscribe('#', (err) => console.log(err)))

client.on('offline', () => console.log('Offline!!'))

client.on('reconnect', () => console.log(`Trying reconnect to ${MQTT_ADDR}`))

client.on('error', (error) => console.log(error))

client.on('message', function (topic, message) {
    console.log(`Topic: ${topic} Message: ${message.toString()}`)
})