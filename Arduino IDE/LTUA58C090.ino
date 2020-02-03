#include <NDIRZ16.h>
#include <SoftwareSerial.h>
#define analogMQ7 A0
SoftwareSerial Serial1(7 ,6); // RX, TX
SoftwareSerial s_serial(8,9);

NDIRZ16 myco2 = NDIRZ16(&s_serial);

int MQ7sensorValue = 0;
int sensor=A1;
int CH4;
long pmat10=0;
long pmat25=0;
long pmat100=0;
char buf[50];
void setup() {
s_serial.begin(9600);  
Serial.begin(9600);

Serial1.begin(9600);

pinMode(sensor,INPUT);
analogWrite(analogMQ7, HIGH); 
analogWrite(analogMQ7, 71.4); 
//delay(1000);
}
void loop() {
int count = 0;
unsigned char c;
unsigned char high;
    
while (Serial1.available()) { 
    
analogWrite(analogMQ7, HIGH);  
MQ7sensorValue = analogRead(analogMQ7);

c = Serial1.read();
if((count==0 && c!=0x42) || (count==1 && c!=0x4d)){
break;
}
else if(count == 4 || count == 6 || count == 8 || count == 10 || count == 12 || count == 14){ 
high = c;
}
else if(count == 11){
}
else if(count == 13){
pmat25 = 256*high + c;
if(pmat25<10){
  Serial.print("0");
  Serial.print(pmat25);
  }
  else{
  Serial.println(pmat25);
  }
}
else if(count == 15){ 
pmat100 = 256*high + c;
if(pmat100<10){
  Serial.print("0");
  Serial.print(pmat100);
  }
  else{
  Serial.println(pmat100);
  }
  CH4=analogRead(sensor);
  Serial.println(CH4);
  Serial.println(MQ7sensorValue); 
}
count++;
}
while(Serial1.available())Serial1.read();
Serial.println();
delay(1000);
}
