import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {
  const [result, setResult] = useState<number | undefined>();

  useEffect(() => {
    //TrackierSDK.multiply(3, 7).then(setResult);


const trackierConfig = new TrackierConfig("ee9f21fb-5848-4ed9-8d9c-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);

trackierConfig.setAppSecret("640710587f41ea36ac0cb370", "9e043b7e-7f44-403c-ae11-8cf6bfe8daa0");

// Uncomment if needed
// trackierConfig.setManualMode(true);
// TrackierSDK.setLocalRefTrack(true, "_");

// TrackierSDK.setMacAddress("672736278");
// TrackierSDK.setIMEI("61621267121", "892837283283823982");

trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
    console.log("Deferred Deeplink Callback received");
    console.log("URL: " + uri);
});

TrackierSDK.initialize(trackierConfig);

  }, []);


  function _onPress_trackSimpleEvent(){
    var trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
    trackierEvent.param1 = "XXXXXX";
    trackierEvent.param2 = "kkkkkk";
    trackierEvent.couponCode = "testReact";
    trackierEvent.discount = 2.0;
    TrackierSDK.setUserName('abc');
    TrackierSDK.setUserPhone("813434721");
    TrackierSDK.setUserId("67863872382");
   // TrackierSDK.getTrackierId().then(val => console.log('===trackierid: ', val)).catch(e => console.log('==error: ', e))
    //trackierEvent.setEventValue("param","8130300721");
   // trackierEvent.setEventValue("param2",2.0);
    const customData = new Map();
    customData.set("name", "sanu");
    customData.set("phone", "8130300784");
    TrackierSDK.parseDeepLink("https://trackier58.u9ilnk.me/d/K5H7J2MkgU")
    //trackierEvent.ev = customData;
    var jsonData = { "url": "+91-8130300721" ,  "name": "Embassies" };
    trackierEvent.ev = jsonData;
    //trackierEvent.setEventValue("param",jsonData);
    //TrackierSDK.fireInstall();
    //TrackierSDK.parseDeepLink("https://www.trackier.com/d?ad=sanu&adset=sanu2")
    TrackierSDK.trackEvent(trackierEvent);
  }

  function _onPress_trackRevenueEvent(){
    var trackierEvent1 = new TrackierEvent(TrackierEvent.PURCHASE);
    trackierEvent1.param1 = "XXXXXX";
    trackierEvent1.param2 = "kkkkkkk";
    trackierEvent1.couponCode = "testReact";
    //trackierEvent1.discount = 2.0;
    TrackierEvent.set
    trackierEvent1.revenue = 2.5;
    trackierEvent1.currency = "USD";
    TrackierSDK.trackEvent(trackierEvent1);
    TrackierSDK.setEnabled(true);
    TrackierSDK.setUserEmail("anuj@trackier.com");
    TrackierSDK.setUserName("Sanu");
    TrackierSDK.setUserPhone("8130300721");
    TrackierSDK.setUserId("abcd");

    TrackierSDK.trackAsOrganic(false);
    TrackierSDK.setLocalRefTrack(true,"test");
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{ color: "black", fontSize: 30 }}>Trackier React-Native Sdk</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={_onPress_trackSimpleEvent}>
          <Text>Track Simple Event</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={_onPress_trackRevenueEvent}>
          <Text>Track Revenue Event</Text>
        </TouchableHighlight>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
