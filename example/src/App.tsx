import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicLinkResult, setDynamicLinkResult] = useState<string>('');
  const [resolveResult, setResolveResult] = useState<string>('');
  const [trackierId, setTrackierId] = useState<string>('');
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>(
    'https://trackier58.u9ilnk.me/d/nJhl3K1iC5'
  );
  const [dynamicLinkConfig, setDynamicLinkConfig] = useState({
    templateId: 'G3Og1t',
    link: 'https://your-domain.com',
    domainUriPrefix: 'https://your-domain.com',
    deepLinkValue: 'https://your-app.com/deep-link',
  });

  useEffect(() => {
    initializeTrackierSDK();
    getTrackierId();
  }, []);

  const initializeTrackierSDK = () => {
    try {
      const trackierConfig = new TrackierConfig(
        "be82576a-b4e8-40a7-8fe2-c25d924ddc58", 
        TrackierConfig.EnvironmentDevelopment
      );

      // Set app secret
      trackierConfig.setAppSecret("680b4f0038e509a7bbaf5a63", "91fc78c1-aedb-4895-81c8-073cae188708");

      // Set region (NEW FEATURE)
      trackierConfig.setRegion(TrackierConfig.IN); // or TrackierConfig.GLOBAL

      // Set attribution parameters (NEW FEATURE)
      trackierConfig.setAttributionParams({
        ad: "test_ad",
        partnerId: "test_partner",
        channel: "test_channel",
        adId: "test_ad_id",
        siteId: "test_site_id"
      });

      // Set deferred deep link callback
      trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        Alert.alert("Deep Link Received", `URL: ${uri}`);
        console.log("Deferred Deeplink Callback received:", uri);
      });

      TrackierSDK.initialize(trackierConfig);
      console.log("Trackier SDK initialized successfully");
    } catch (error) {
      console.error("Error initializing Trackier SDK:", error);
      Alert.alert("Error", "Failed to initialize Trackier SDK");
    }
  };

  const getTrackierId = async () => {
    try {
      const id = await TrackierSDK.getTrackierId();
      setTrackierId(id);
    } catch (error) {
      console.error("Error getting Trackier ID:", error);
    }
  };

  const trackSimpleEvent = () => {
    try {
      const trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
      trackierEvent.param1 = "Product123";
      trackierEvent.param2 = "Category456";
      trackierEvent.couponCode = "SAVE20";
      trackierEvent.discount = 2.0;
      
      // Set user information
      TrackierSDK.setUserName('John Doe');
      TrackierSDK.setUserPhone("+1234567890");
      TrackierSDK.setUserId("user123");

      // Set custom event data
      trackierEvent.ev = { 
        "product_name": "Test Product", 
        "category": "Electronics" 
      };

      TrackierSDK.trackEvent(trackierEvent);
      Alert.alert("Success", "Simple event tracked successfully!");
    } catch (error) {
      console.error("Error tracking simple event:", error);
      Alert.alert("Error", "Failed to track simple event");
    }
  };

  const trackRevenueEvent = () => {
    try {
      const trackierEvent = new TrackierEvent(TrackierEvent.PURCHASE);
      trackierEvent.param1 = "Product789";
      trackierEvent.param2 = "Premium";
      trackierEvent.couponCode = "PREMIUM10";
      trackierEvent.revenue = 29.99;
      trackierEvent.currency = "USD";
      trackierEvent.discount = 5.0;

      // Set user information
      TrackierSDK.setUserEmail("user@example.com");
      TrackierSDK.setUserName("Jane Smith");
      TrackierSDK.setUserPhone("+1987654321");
      TrackierSDK.setUserId("user456");
      TrackierSDK.setUserAdditionalDetails({
      clevertap_uid: "user123",
      user_type: "premium",
      subscription_status: "active",
      last_login: "2024-01-15"
      });
      TrackierSDK.trackEvent(trackierEvent);
      Alert.alert("Success", "Revenue event tracked successfully!");
    } catch (error) {
      console.error("Error tracking revenue event:", error);
      Alert.alert("Error", "Failed to track revenue event");
    }
  };

  const createDynamicLink = async () => {
    setIsLoading(true);
    setDynamicLinkResult('');
    
    try {
      const config = {
        templateId: dynamicLinkConfig.templateId,
        link: dynamicLinkConfig.link,
        domainUriPrefix: dynamicLinkConfig.domainUriPrefix,
        deepLinkValue: dynamicLinkConfig.deepLinkValue,
        androidParameters: {
          redirectLink: "https://play.google.com/store/apps/details?id=com.example.app"
        },
        iosParameters: {
          redirectLink: "https://apps.apple.com/app/id123456789"
        },
        socialMetaTagParameters: {
          title: "Amazing App",
          description: "Check out this amazing app!",
          imageLink: "https://example.com/image.jpg"
        },
        sdkParameters: {
          param1: "value1",
          param2: "value2"
        },
        attributionParameters: {
          channel: "social",
          campaign: "summer_sale",
          mediaSource: "facebook",
          p1: "custom_param1",
          p2: "custom_param2",
          p3: "custom_param3",
          p4: "custom_param4",
          p5: "custom_param5"
        }
      };

      const result = await TrackierSDK.createDynamicLink(config);
      setDynamicLinkResult(result);
      Alert.alert("Success", "Dynamic link created successfully!");
    } catch (error) {
      console.error("Error creating dynamic link:", error);
      setDynamicLinkResult(`Error: ${error}`);
      Alert.alert("Error", "Failed to create dynamic link");
    } finally {
      setIsLoading(false);
    }
  };

  const resolveDeeplinkUrl = async () => {
    if (!deepLinkUrl.trim()) {
      Alert.alert("Error", "Please enter a deep link URL");
      return;
    }

    setIsLoading(true);
    setResolveResult('');
    
    try {
      const result = await TrackierSDK.resolveDeeplinkUrl(deepLinkUrl);
      const resultText = `URL: ${result.url}\nSDK Params: ${JSON.stringify(result.sdkParams, null, 2)}`;
      setResolveResult(resultText);
      Alert.alert("Success", "Deep link resolved successfully!");
    } catch (error) {
      console.error("Error resolving deep link:", error);
      setResolveResult(`Error: ${error}`);
      Alert.alert("Error", "Failed to resolve deep link");
    } finally {
      setIsLoading(false);
    }
  };

  const parseDeepLink = () => {
    try {
      TrackierSDK.parseDeepLink(deepLinkUrl);
      Alert.alert("Success", "Deep link parsed successfully!");
    } catch (error) {
      console.error("Error parsing deep link:", error);
      Alert.alert("Error", "Failed to parse deep link");
    }
  };

  const setUserAdditionalDetails = () => {
    try {
      TrackierSDK.setUserAdditionalDetails({clevertap_uid: "sanuuu"});
      Alert.alert("Success", "User additional details set successfully!");
    } catch (error) {
      console.error("Error setting user additional details:", error);
      Alert.alert("Error", "Failed to set user additional details");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Trackier React-Native SDK</Text>
        <Text style={styles.subtitle}>Demo App - All Features</Text>
        
        {trackierId && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Trackier ID: {trackierId}</Text>
          </View>
        )}

        {/* Event Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Tracking</Text>
          
          <TouchableOpacity style={styles.button} onPress={trackSimpleEvent}>
            <Text style={styles.buttonText}>Track Simple Event</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={trackRevenueEvent}>
            <Text style={styles.buttonText}>Track Revenue Event</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={setUserAdditionalDetails}>
            <Text style={styles.buttonText}>Set User Additional Details</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Link Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dynamic Link Creation</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Template ID"
            value={dynamicLinkConfig.templateId}
            onChangeText={(text) => setDynamicLinkConfig({...dynamicLinkConfig, templateId: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Link"
            value={dynamicLinkConfig.link}
            onChangeText={(text) => setDynamicLinkConfig({...dynamicLinkConfig, link: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Domain URI Prefix"
            value={dynamicLinkConfig.domainUriPrefix}
            onChangeText={(text) => setDynamicLinkConfig({...dynamicLinkConfig, domainUriPrefix: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Deep Link Value"
            value={dynamicLinkConfig.deepLinkValue}
            onChangeText={(text) => setDynamicLinkConfig({...dynamicLinkConfig, deepLinkValue: text})}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={createDynamicLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Dynamic Link</Text>
            )}
          </TouchableOpacity>

          {dynamicLinkResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Dynamic Link Result:</Text>
              <Text style={styles.resultText}>{dynamicLinkResult}</Text>
            </View>
          )}
        </View>

        {/* Deep Link Resolution Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deep Link Resolution</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter deep link URL"
            value={deepLinkUrl}
            onChangeText={setDeepLinkUrl}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={resolveDeeplinkUrl}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Resolve Deep Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={parseDeepLink}>
            <Text style={styles.buttonText}>Parse Deep Link</Text>
          </TouchableOpacity>

          {resolveResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Resolve Result:</Text>
              <Text style={styles.resultText}>{resolveResult}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});
