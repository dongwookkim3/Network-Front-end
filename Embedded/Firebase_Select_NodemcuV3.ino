#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define API_KEY ""
#define DATABASE_URL "" 

#define USER_EMAIL ""
#define USER_PASSWORD ""

#define LED1_PIN D5
#define LED2_PIN D6

#define buzzer_PIN D4

LiquidCrystal_I2C lcd(0x27, 16, 2);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup(){
  Serial.begin(115200);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(1000);
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
  Firebase.reconnectWiFi(true);
  Firebase.begin(&config, &auth);
  
  lcd.begin();
  lcd.backlight();
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(buzzer_PIN, OUTPUT);
}

void loop(){
  Firebase.ready();
  String temperature1_string = (Firebase.RTDB.getFloat(&fbdo, F("/Smart_Plant/DHT1/temperature")) ? String(fbdo.to<float>(), 2) : "Error");
  String temperature2_string = (Firebase.RTDB.getFloat(&fbdo, F("/Smart_Plant/DHT2/temperature")) ? String(fbdo.to<float>(), 2) : "Error");
  String humidity1_string = (Firebase.RTDB.getFloat(&fbdo, F("/Smart_Plant/DHT1/humidity")) ? String(fbdo.to<float>(), 2) : "Error");
  String humidity2_string = (Firebase.RTDB.getFloat(&fbdo, F("/Smart_Plant/DHT2/humidity")) ? String(fbdo.to<float>(), 2) : "Error");
  String SoilMoisture_string = (Firebase.RTDB.getInt(&fbdo, F("/Smart_Plant/SOILMOISTURE/SoilMoisture")) ? String(fbdo.to<int>()) : "Error");
  String unzi_string = (Firebase.RTDB.getInt(&fbdo, F("/Smart_Plant/unzi")) ? String(fbdo.to<int>()) : "Error");
  float temperature1=temperature1_string.toFloat();
  float temperature2=temperature2_string.toFloat();
  float humidity1=humidity1_string.toFloat();
  float humidity2=humidity2_string.toFloat();
  float temperature=(temperature1 + temperature2) / 2;
  float humidity=(humidity1 + humidity2) / 2;
  int SoilMoisture=SoilMoisture_string.toInt();
  int unzi=unzi_string.toInt();
  
  Serial.printf("Temperature: %.2f\n", temperature);
  Serial.printf("Humidity: %.2f\n", humidity);
  Serial.printf("Soil Moisture: %d\n", SoilMoisture);
  Serial.printf("Unzi: %d\n", unzi);
  Serial.println("");
  
  lcd.setCursor(0,0);
  lcd.print("H:");
  lcd.print(humidity);
  lcd.print(" T:");
  lcd.print(temperature);
  lcd.setCursor(0,1);
  
  if ((temperature>=16 && temperature<=25) && (humidity>=40 && humidity<=70)){
    digitalWrite(LED1_PIN, LOW);
  }
  else {
    digitalWrite(LED1_PIN, HIGH);
  }
  if (SoilMoisture<=700){
    digitalWrite(LED2_PIN, LOW);
  }
  else {
    digitalWrite(LED2_PIN, HIGH);
  }
  if (unzi==1){
    digitalWrite(buzzer_PIN,HIGH);
  }
  else {
    digitalWrite(buzzer_PIN,LOW);
  }
  if (((temperature>=16 && temperature<=25) && (humidity>=40 && humidity<=70)) && (SoilMoisture<=700)){
    lcd.print("I FEEL GOOD");
  }
  else if (((temperature>=16 && temperature<=25) && (humidity>=40 && humidity<=70))){
    lcd.print("I WANT WATER");
  }
  else if ((SoilMoisture<=700)){
    lcd.print("CONTROL T&H");
  }
  else {
    lcd.print("I FEEL BAD");
  }
  delay(1000);
}
