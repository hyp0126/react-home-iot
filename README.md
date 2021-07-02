# react-express-mqtt-web
### Web Server
1. ESP8266 MQTT -> GCP(Ubuntu: mosquitto) -> <b>PC(Win10: Express/mongoDB backend) -> PC(Win10: React fontend)</b>

2. ESP8266 MQTT -> GCP(Ubuntu: mosquitto) -> <b>GCP(Express:8080) -> GCP(React:3000) -> GCP(NGINX:Reverse Proxy 443/8443)</b>

3. ESP8266 MQTT -> GCP(mosquitto) -> GCP(Express:8080) -> <b>GCP(NGINX: React Production Build 8888)</b>

4. ESP8266 MQTT -> GCP(mosquitto) -> <b>GCP NGINX(Express -> https://domain/api/ , React -> https://domain/)</b>

5. (ESP8266) & (UNO->Rpi) -> GCP(mosquitto) -> GCP(Express https://domain/api/) -> <b>AWS EC2(React https://aws.domain/)</b>

6. (ESP8266) & (UNO->Rpi) -> <b>AWS#1(mosquitto -> Express, https://mqtt.domain/api/) -> AWS#2(React, https://iot.domain/)</b>

7. (ESP8266) & (UNO->Rpi) -> <b>AWS(mosquitto -> Express, https://mqtt.domain/api/) -> GCP(React, NGINX, https://iot.domain/)</b>

### Webpage Screenshots
<p align="center">
  <img src="https://github.com/hyp0126/react-express-mqtt-web/blob/master/RealTimeGuage.png?raw=true" width="700" />
  <img src="https://github.com/hyp0126/react-express-mqtt-web/blob/master/DailyChart.png?raw=true" width="700" />
</p>
