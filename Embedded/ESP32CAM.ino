#include <mbedtls/base64.h>
#include <base64.h>
#include <FirebaseESP32.h>
#include <esp_camera.h>
#include <WiFi.h>

#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define firebase_url "smartplant-89fe3-default-rtdb.firebaseio.com"
#define firebase_token "KDyhJGvVpHbYoacmffPMilpRMArBs4pnbXOdYbTS"

#define WiFi_SSID "bssm_free"
#define WiFi_PASSWORD "bssm_free"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config_firebase;

void setup(){
  Serial.begin(115200);
  
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_LATEST;

  config.frame_size = FRAMESIZE_SVGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("카메라 초기화 실패", err);
    while(1);
  } else {
    Serial.println("카메라 초기화 성공");
  }

  WiFi.begin(WiFi_SSID, WiFi_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("Connect");

  config_firebase.database_url = firebase_url;
  config_firebase.signer.tokens.legacy_token = firebase_token;

  Firebase.begin(&config_firebase,&auth);
  Firebase.reconnectWiFi(true);
}

void loop(){
  get_photo();
}

void get_photo(){
  camera_fb_t *fb = NULL;
  fb = esp_camera_fb_get();
  if (!fb) return;
  size_t size = fb->len;
  uint8_t *image = (uint8_t*)fb->buf;
  int base64_size = (size + 2 - ((size + 2) % 3)) / 3 * 4 + 1;
  uint8_t *buffer = (uint8_t *)calloc(base64_size,sizeof(char));
  size_t buffer_size = 0;
  int err = mbedtls_base64_encode(buffer,base64_size,&buffer_size,image,size);

  if (err != 0) {
    Serial.println("BASE64 변환 오류");
  } 
  else {
    String base64_code = "data:image/jpeg;base64,";
    base64_code = base64_code + String((char *)buffer);
    Serial.println(base64_code);

    FirebaseJson json;
    json.set("ESP32CAM2",base64_code);
    Firebase.set(fbdo,"Smart_Plant/PHOTO/CAM2",json);
  }
  free(buffer);
  esp_camera_fb_return(fb);
}
