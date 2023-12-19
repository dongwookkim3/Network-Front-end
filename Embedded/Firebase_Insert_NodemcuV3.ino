#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

#include <DHT.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define API_KEY ""
#define DATABASE_URL "" 

#define USER_EMAIL ""
#define USER_PASSWORD ""

#define PIN_DHT1 D3
#define PIN_DHT2 D4

DHT DHT1(PIN_DHT1,DHT11);
DHT DHT2(PIN_DHT2,DHT11);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

Adafruit_MPU6050 mpu;

int count=0;
double bx=0,by=0,bz=0;

void setup(){
  Serial.begin(115200);
  DHT1.begin();
  DHT2.begin();
  
  mpu.begin();
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(333);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop(){
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  float DHT1_humidity = DHT1.readHumidity();
  float DHT1_temperature = DHT1.readTemperature();
  float DHT2_humidity = DHT2.readHumidity();
  float DHT2_temperature = DHT2.readTemperature();
  
  int analogValue = analogRead(A0);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/SOILMOISTURE/SoilMoisture", analogValue);
  
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/DHT1/humidity", DHT1_humidity);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/DHT1/temperature", DHT1_temperature);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/DHT2/humidity", DHT2_humidity);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/DHT2/temperature", DHT2_temperature);
  
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/GYRO/GX", g.gyro.x);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/GYRO/GY", g.gyro.y);
  Firebase.RTDB.setInt(&fbdo,"Smart_Plant/GYRO/GZ", g.gyro.z);

  if (abs(bx-g.gyro.x)>=3 || abs(by-g.gyro.y)>=3 || abs(bz-g.gyro.z)>=3){
    count++;
    Firebase.RTDB.setInt(&fbdo,"Smart_Plant/unzi", count%2);
  }
  bx=g.gyro.x;
  by=g.gyro.y;
  bz=g.gyro.z;
  delay(1000);
}
