import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {
  const [result, setResult] = useState<number | undefined>();

  useEffect(() => {
    TrackierSDK.multiply(3, 7).then(setResult);


const trackierConfig = new TrackierConfig("ee9f21fb-5848-4ed9-8d9c-e4093e6d220c", "testing");

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

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
