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
import { AppTroveConfig, AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicLinkResult, setDynamicLinkResult] = useState<string>('');
  const [resolveResult, setResolveResult] = useState<string>('');
  const [apptroveId, setApptroveId] = useState<string>('');
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>(
    'https://trackier58.u9ilnk.me/d/VgnGGvylDO'
  );
  const [dynamicLinkConfig, setDynamicLinkConfig] = useState({
    templateId: 'ODLVoS',
    link: 'https://your-domain.com',
    domainUriPrefix: 'https://your-domain.com',
    deepLinkValue: 'https://your-app.com/deep-link',
  });

  useEffect(() => {
    initializeAppTroveSDK();
    getAppTroveId();
  }, []);

  const initializeAppTroveSDK = () => {
    try {
      const appTroveConfig = new AppTroveConfig(
        'XXXXXX-XXXXX-XXXXX-XXXXX-XXXXX', // Replace with your actual AppToken
        AppTroveConfig.EnvironmentDevelopment
      );

      // Set app secret
      // appTroveConfig.setAppSecret("680b4f0038e509a7bbaf5a63", "91fc78c1-aedb-4895-81c8-073cae188708");

      // Set region (NEW FEATURE)
      appTroveConfig.setRegion(AppTroveConfig.IN); // or AppTroveConfig.GLOBAL

      // Set Facebook App ID for Meta attribution (Android)
      appTroveConfig.setFacebookAppId('123456789012345'); // Replace with your actual Facebook App ID

      // Set custom Android ID for device identification (Android)
      appTroveConfig.setAndroidId('custom_android_device_id_123'); // Replace with your custom Android ID

      // Set App ID
      appTroveConfig.setAppId('802830299'); // Replace with your actual App ID

      // Set encryption key for secure data transmission
      // appTroveConfig.setEncryptionKey("xxxEncryTest29393"); // Replace with your encryption key

      // Set encryption type
      // appTroveConfig.setEncryptionType(AppTroveConfig.EncryptionType.AES_GCM); // Use AES_GCM encryption

      // Set attribution parameters (NEW FEATURE)
      appTroveConfig.setAttributionParams({
        ad: 'test_ad',
        partnerId: 'test_partner',
        channel: 'test_channel',
        adId: 'test_ad_id',
        siteId: 'test_site_id',
      });

      // Set deferred deep link callback
      appTroveConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        Alert.alert('Deep Link Received', `URL: ${uri}`);
        console.log('Deferred Deeplink Callback received:', uri);
      });

      AppTroveSDK.initialize(appTroveConfig);
      console.log('AppTrove SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing AppTrove SDK:', error);
      Alert.alert('Error', 'Failed to initialize AppTrove SDK');
    }
  };

  const getAppTroveId = async () => {
    try {
      const id = await AppTroveSDK.getAppTroveId();
      setApptroveId(id);
    } catch (error) {
      console.error('Error getting AppTrove ID:', error);
    }
  };

  const trackSimpleEvent = () => {
    try {
      const appTroveEvent = new AppTroveEvent(AppTroveEvent.ADD_TO_CART);
      appTroveEvent.param1 = 'Product123';
      appTroveEvent.param2 = 'Category456';
      appTroveEvent.couponCode = 'SAVE20';
      appTroveEvent.discount = 2.0;

      // Set user information
      AppTroveSDK.setUserName('John Doe');
      AppTroveSDK.setUserPhone('+1234567890');
      AppTroveSDK.setUserId('user123');

      // Set custom event data
      appTroveEvent.ev = {
        product_name: 'Test Product',
        category: 'Electronics',
      };

      AppTroveSDK.trackEvent(appTroveEvent);
      Alert.alert('Success', 'Simple event tracked successfully!');
    } catch (error) {
      console.error('Error tracking simple event:', error);
      Alert.alert('Error', 'Failed to track simple event');
    }
  };

  const trackRevenueEvent = () => {
    try {
      const appTroveEvent = new AppTroveEvent(AppTroveEvent.PURCHASE);
      appTroveEvent.param1 = 'Product789';
      appTroveEvent.param2 = 'Premium';
      appTroveEvent.couponCode = 'PREMIUM10';
      appTroveEvent.revenue = 29.99;
      appTroveEvent.currency = 'USD';
      appTroveEvent.discount = 5.0;

      // Set user information
      AppTroveSDK.setUserEmail('user@example.com');
      AppTroveSDK.setUserName('Jane Smith');
      AppTroveSDK.setUserPhone('+1987654321');
      AppTroveSDK.setUserId('user456');
      AppTroveSDK.setUserAdditionalDetails({
        clevertap_uid: 'user123',
        user_type: 'premium',
        subscription_status: 'active',
        last_login: '2024-01-15',
      });
      AppTroveSDK.trackEvent(appTroveEvent);
      Alert.alert('Success', 'Revenue event tracked successfully!');
    } catch (error) {
      console.error('Error tracking revenue event:', error);
      Alert.alert('Error', 'Failed to track revenue event');
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
          redirectLink:
            'https://play.google.com/store/apps/details?id=com.example.app',
        },
        iosParameters: {
          redirectLink: 'https://apps.apple.com/app/id123456789',
        },
        socialMetaTagParameters: {
          title: 'Amazing App',
          description: 'Check out this amazing app!',
          imageLink: 'https://example.com/image.jpg',
        },
        sdkParameters: {
          param1: 'value1',
          param2: 'value2',
        },
        attributionParameters: {
          channel: 'social',
          campaign: 'summer_sale',
          mediaSource: 'facebook',
          p1: 'custom_param1',
          p2: 'custom_param2',
          p3: 'custom_param3',
          p4: 'custom_param4',
          p5: 'custom_param5',
        },
      };

      const result = await AppTroveSDK.createDynamicLink(config);
      setDynamicLinkResult(result);
      Alert.alert('Success', 'Dynamic link created successfully!');
    } catch (error) {
      console.error('Error creating dynamic link:', error);
      setDynamicLinkResult(`Error: ${error}`);
      Alert.alert('Error', 'Failed to create dynamic link');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveDeeplinkUrl = async () => {
    if (!deepLinkUrl.trim()) {
      Alert.alert('Error', 'Please enter a deep link URL');
      return;
    }

    setIsLoading(true);
    setResolveResult('');

    try {
      const result = await AppTroveSDK.resolveDeeplinkUrl(deepLinkUrl);
      const resultText = `URL: ${result.url}\nSDK Params: ${JSON.stringify(result.sdkParams, null, 2)}`;
      setResolveResult(resultText);
      Alert.alert('Success', 'Deep link resolved successfully!');
    } catch (error) {
      console.error('Error resolving deep link:', error);
      setResolveResult(`Error: ${error}`);
      Alert.alert('Error', 'Failed to resolve deep link');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDeepLink = () => {
    try {
      AppTroveSDK.parseDeepLink(deepLinkUrl);
      Alert.alert('Success', 'Deep link parsed successfully!');
    } catch (error) {
      console.error('Error parsing deep link:', error);
      Alert.alert('Error', 'Failed to parse deep link');
    }
  };

  const setUserAdditionalDetails = () => {
    try {
      AppTroveSDK.setUserAdditionalDetails({ clevertap_uid: 'sanuuu' });
      Alert.alert('Success', 'User additional details set successfully!');
    } catch (error) {
      console.error('Error setting user additional details:', error);
      Alert.alert('Error', 'Failed to set user additional details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>AppTrove React-Native SDK</Text>
        <Text style={styles.subtitle}>Demo App - All Features</Text>

        {apptroveId && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>AppTrove ID: {apptroveId}</Text>
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

          <TouchableOpacity
            style={styles.button}
            onPress={setUserAdditionalDetails}
          >
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
            onChangeText={(text) =>
              setDynamicLinkConfig({ ...dynamicLinkConfig, templateId: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Link"
            value={dynamicLinkConfig.link}
            onChangeText={(text) =>
              setDynamicLinkConfig({ ...dynamicLinkConfig, link: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Domain URI Prefix"
            value={dynamicLinkConfig.domainUriPrefix}
            onChangeText={(text) =>
              setDynamicLinkConfig({
                ...dynamicLinkConfig,
                domainUriPrefix: text,
              })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Deep Link Value"
            value={dynamicLinkConfig.deepLinkValue}
            onChangeText={(text) =>
              setDynamicLinkConfig({
                ...dynamicLinkConfig,
                deepLinkValue: text,
              })
            }
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
