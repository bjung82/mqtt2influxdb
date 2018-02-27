var mqtt = require('mqtt')
var Influx = require('influxdb-nodejs')

const MQTT_ADDR = 'mqtt://rasperrypi:1883'
const MQTT_CLIENTID = 'mqtt2influx'

const INFLUXDB_DBNAME = 'sensor_data'

const mqttClient = mqtt.connect(MQTT_ADDR, {
    clientId: MQTT_CLIENTID,
    connectTimeout: 1000,
    reconnecting: true,
    debug: true
})

const influxClient = new Influx(`http://rasperrypi:8086/${INFLUXDB_DBNAME}`)
const fieldSchema = {
    'esp32/temperature' : 'f',
    'esp32/humidity' : 'f',
    'esp32/lux' : 'f',
    'esp32/wifi-rssi' : 'f'
}
const tagSchema = {}
influxClient.schema('data', fieldSchema, tagSchema, {stripInknown : true })

mqttClient.on('connect', () => mqttClient.subscribe('#', (err) => console.log(err)))

mqttClient.on('offline', () => console.log('Offline!!'))

mqttClient.on('reconnect', () => console.log(`Trying reconnect to ${MQTT_ADDR}`))

mqttClient.on('error', (error) => console.log(error))

mqttClient.on('message', function (topic, message) {
    console.log(`Topic: ${topic} Message: ${message.toString()}`)

    let data = {}
    data[topic] = String(message)

    influxClient.write('data')
        .field(data).then(() => {}).catch(e => console.error(e))
})