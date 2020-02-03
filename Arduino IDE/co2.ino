#include <NDIRZ16.h>
#include <SoftwareSerial.h>

//Arduino UNO Pin D2 (Software Serial Rx) <===> Adaptor's Green  Wire (Tx)
//Arduino UNO Pin D3 (Software Serial Tx) <===> Adaptor's Yellow Wire (Rx)
SoftwareSerial mySerial(8,9);
NDIRZ16 myco2 = NDIRZ16(&mySerial);
void setup() 
{
    Serial.begin(9600);
    mySerial.begin(9600);
    Serial.println("Wait 10 seconds for the sensor to starup");
    delay(1000);
};

void loop() {
    if (myco2.measure()) {
        Serial.print("CO2 Concentration is ");
        Serial.print(myco2.ppm);
        Serial.println("ppm");
    }
    delay(1000);
}
