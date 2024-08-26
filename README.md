
# trackier-expo-sdk

this is trackier expo and react-nattive package

## Table of Contents

* [Quick Integration Guide](#qs-basic-integration)
    * [Retrieve your app token](#qs-retrieve-app-token)
    * [Getting Google Advertising ID](#qs-getting-gaid)
    * [Initialize the SDK](#qs-initialize-sdk)
    * [Events Tracking](#qs-track-events)
    * [Revenue Events Tracking](#qs-track-event-with-currencey)
    * [Pass the custom params in events](#qs-add-custom-parms-event)
    * [Passing User Data to SDK](#qs-passing-user-data)
    * [SDK Signing](#qs-sdk-signing)
    * [Track Uninstall for Android](#qs-track-uninstall-android)
* [Deep linking](#qs-deeplink)
* [Getting Campaign Data](#qs-campaign-data)
* [Proguard Settings](#qs-progaurd-settings)


## <a id="qs-add-trackier-sdk"></a>Quick Integration Guide

We have created a example app for the react-native SDK integration. 

Please check the [Example](https://github.com/trackier/react-native-sdk/tree/main/example) directory for know to how the `Trackier SDK` can be integrated.


## <a id="qs-basic-integration"></a>Integrate React-Native SDK to your app

For integration, you need to import the trackier library in your project. 

For importing the library in project, you need to run the below command in the `terminal/cmd`.

For Npm
```sh
$ npm i trackier-expo-sdk
```
For Yarn
```sh
$ yarn add trackier-expo-sdk
```

For Ios app, make sure to go to ios folder and install Cocoapods dependencies:

```sh
$ cd ios && pod install
```    

## <a id="qs-getting-gaid"></a> Getting Google Advertising ID

Trackier SDK need the advertising id from the application. 

For achieving this, you need to add some line of code in the build.gradle and also in Manifest.xml for read the Advertising id from the application which is mentioned below

- Add the google advertising id dependency in your app **build.gradle**

```gradle
dependencies {
  // This can be added where the SDK dependency has been added
  implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
}
```

Also update the gradle.properties file by adding this lines in case the gradle version is lower than 7.0

```gradle
android.jetifier.blacklist=moshi-1.13.0.jar
```
- Update your Android Manifest file by adding the following permission. This is required if your app is targeting devices with android version 12+

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

- Add meta data inside the application tag (If not already added)
```xml
<meta-data
            android:name="com.google.android.gms.version"
            android:value="@integer/google_play_services_version" /> // Add this meta-data in the manifest.xml under Application tag.
```
Below are the screenshot of application tag in manifest.xml for the reference

Screenshot[1]

<img width="1000" alt="Screenshot 2022-06-08 at 4 16 40 PM" src="https://user-images.githubusercontent.com/16884982/172598171-2f16460b-9376-40ad-b13d-6be226754aa9.png">


### <a id="qs-retrieve-app-token"></a>Retrieve your app token

1. Login to your Trackier MMP account.
2. Select the application from dashboard which you want to get the app token for.
3. Go to SDK Integration via the left side navigation menu.
4. Copy the SDK Key there to be used as the `"app_token"`.


### <a id="qs-initialize-sdk"></a>SDK integration in app

You should use the following import statement on top of your `.js` file:
```tsx
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';
```

In your `App.tsx` file, add the following code to initialize the Trackier SDK:
```tsx

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxc-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587f4xxxxac0cb370", "9e043b7e-xxxx-xxxx-xxxx-8cf6bfe8daa0");
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);
}
```

Depending on whether you build your app for testing or for production, you must set the environment with one of these values:
```tsx
TrackierConfig.EnvironmentTesting
TrackierConfig.EnvironmentDevelopment
TrackierConfig.EnvironmentProduction
```

Check below the screenshot of above code 

Screenshot[2]

<img width="1000" alt="Screenshot 1" src="https://github.com/user-attachments/assets/bca7a2a3-7d89-41bc-9d61-3118a8652c0c">


### <a id="qs-track-events"></a>Events Tracking

<a id="qs-retrieve-event-id"></a>Trackier events trackings enable to provides the insights into how to user interacts with your app. 
Trackier SDK easily get that insights data from the app. Just follow with the simple events integration process

Trackier provides the `Built-in events` and `Customs events` on the Trackier panel.

#### **Built-in Events** - 

Predefined events are the list of constants events which already been created on the dashboard. 

You can use directly to track those events. Just need to implements events in the app projects.

Screenshot[3]
<img width="1000" alt="Screenshot 4" src="https://github.com/user-attachments/assets/e6894530-9de3-41cc-8268-811ff0fbc551">



### Example code for calling Built-in events

```tsx

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0");
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
    const customData = new Map();
    customData.set("name", "sanu");
    customData.set("phone", "8130300784");
    var jsonData = { "url": "+91-8130300721" ,  "name": "Embassies" };
    trackierEvent.ev = jsonData;
    TrackierSDK.trackEvent(trackierEvent);
  }
}
```

Also check the example app screenshot of above example

Screenshot[4]

<img width="1000" alt="Screenshot 2" src="https://github.com/user-attachments/assets/473b2179-d4d8-4be4-9860-7c37384f471d">


#### **Customs Events** - 

Customs events are created by user as per their required business logic. 

You can create the events in the Trackier dashboard and integrate those events in the app project.

Screenshot[5]

<img width="1000" alt="Screenshot 4" src="https://user-images.githubusercontent.com/16884982/176417552-a8c80137-aa1d-480a-81a3-ea1e03172868.png">



### Example code for calling Customs Events.

```tsx

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0");
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);

  function _onPress_trackSimpleEvent(){
    var trackierEvent = new TrackierEvent("sEMWSCTXeu");//pass your event id here
    trackierEvent.param1 = "XXXXXX";
    trackierEvent.param2 = "kkkkkk";
    trackierEvent.couponCode = "testReact";
    trackierEvent.discount = 2.0;
    TrackierSDK.setUserName('abc');
    TrackierSDK.setUserPhone("813434721");
    TrackierSDK.setUserId("67863872382");
    const customData = new Map();
    customData.set("name", "sanu");
    customData.set("phone", "8130300784");
    var jsonData = { "url": "+91-8130300721" ,  "name": "Embassies" };
    trackierEvent.ev = jsonData;
    TrackierSDK.trackEvent(trackierEvent);
  }
}
```
   
Check below the example screenshot of customs events:-

Screenshot[6]

<img width="1000" alt="Screenshot 4" src="https://github.com/user-attachments/assets/d310a451-4f37-46d4-94de-a8161eab834f">


### <a id="qs-track-event-with-currencey"></a>Revenue Event Tracking

Trackier allow user to pass the revenue data which is generated from the app through Revenue events. It is mainly used to keeping record of generating revenue from the app and also you can pass currency as well.

```tsx
    
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0");
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);

  function _onPress_trackSimpleEvent(){
    var trackierEvent = new TrackierEvent("sEMWSCTXeu");
   //Passing the revenue events be like below example

    revenueEvent.revenue = 2.5; //Pass your generated revenue here.
    revenueEvent.currency = "USD"; //Pass your currency here.
    TrackierSDK.trackEvent(trackierEvent);
  }
}

```

Check below the revenue events calling screenshots.

Screenshot[7]

<img width="1000" alt="Screenshot 6" src="https://github.com/user-attachments/assets/993154f0-96af-4949-86c9-ddcb23ea5d7a">


### <a id="qs-add-custom-parms-event"></a>Pass the custom params in events

```tsx

  import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0");
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);

  function _onPress_trackSimpleEvent(){
    var trackierEvent = new TrackierEvent("sEMWSCTXeu");
    var jsonData = { "url": "+91-8130300721" ,  "name": "Embassies" };
    trackierEvent.ev = jsonData;
    TrackierSDK.trackEvent(trackierEvent);
  }
}
  }
```

- First create a map.
- Pass its reference to trackierEvent.ev param of event.
- Pass event reference to trackEvent method of TrackierSDK.


### <a id="qs-passing-user-data"></a>Passing User Data to SDK

Trackier allows to pass additional data like Userid, Email to SDK so that same can be correlated to the Trackier Data and logs.

Just need to pass the data of User Id, Email Id and other additional data to Trackier SDK function which is mentioned below:-


```js

function _userDetails(){
    var trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
    //Passing the data as mentioned below 
    TrackierSDk.setUserId("XXXXXXXX"); //Pass the UserId values here
    TrackierSDk.setUserEmail("abc@gmail.com"); //Pass the user email id in the argument.
    TrackierSDK.setUserName("abc");
    TrackierSDK.setUserPhone("813434721");
    TrackierSDK.trackEvent(trackierEvent);
}
```

### For Passing Additional Data

Trackier allow for passing the additional user details like UserName, Mobile Number, UserAge, UserGender etc. . You need to first make a hashmap and pass it in setUserAdditionalDetail function. The example are in mentioned below


```js

  function _userDetails(){
    var trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
    //Passing the data as mentioned below 
    TrackierSDk.setUserId("XXXXXXXX"); //Pass the UserId values here
    TrackierSDk.setUserEmail("abc@gmail.com"); //Pass the user email id in the argument.
    TrackierSDK.setUserName("abc");
    TrackierSDK.setUserPhone("813434721");
    var jsonData = {"phone": "+91-8137872378" , "name": "Embassies"};
    TrackierSDK.setUserAdditionalDetails("data", jsonData)
    TrackierSDK.trackEvent(trackierEvent);
  }
```

Below are the screenshots of the customs data passing 

Screenshot[8]

<img width="1000" alt="Screenshot 7" src="https://github.com/user-attachments/assets/71a3330d-21de-41ca-9a86-0ec1ca0800a6">

## <a id="qs-sdk-signing"></a>SDK Signing 

Following below are the steps to retrieve the secretId and secretKey :-

- Login your Trackier Panel and select your application.
- In the Dashboard, click on the `SDK Integration` option on the left side of panel. 
- Under on the SDK Integration, click on the Advanced tab. 
- Under the Advanced tab, you will get the secretId and secretKey.

Please check on the below screenshot

Screenshot[9]

<img width="1000" alt="Screenshot 8" src="https://user-images.githubusercontent.com/16884982/185338826-bcf802d0-c493-4a67-adb3-a9b52bae289e.png">


Check below the example code for passing the secretId and secretKey to the SDK

```tsx

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0"); //SDK Signing
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);
}

}

```

### <a id="qs-track-uninstall-android"></a> Track Uninstall for Android

 **Before you begin**
* [Install `firebase_core`](https://rnfirebase.io/analytics/usage) and add the initialization code to your app if you haven't already.
* Add your app to your Firebase project in the [Firebase console](https://console.firebase.google.com/).

#### Add the Analytics SDK to your app


* Once installed, you can access the `firebase_analytics` plugin by importing it in your JS code:
  ```js
    import analytics from '@react-native-firebase/analytics';
  ```
* Create a new Firebase Analytics instance by with this code
  ```js
    var analytics = analytics();
  ```
* Use the `analytics` instance obtained above to set the following user property:
  ```js
    var trackierId = await TrackierSDK.getTrackierId();
    await analytics().setUserProperty('ct_objectId', trackierId); 
  ``` 

* Adding the above code to your app sets up a common identifier. 
* Set the `app_remove` event as a conversion event in Firebase. 
* Use the Firebase cloud function to send uninstall information to Trackier MMP. 
* You can find the support article [here](https://help.trackier.com/support/solutions/articles/31000162841-android-uninstall-tracking).


### <a id="qs-deeplink"></a> Deep linking 

Deep linking is a techniques in which the user directly redirect to the specific pages of the application by click on the deeplink url.

There are two types deeplinking

* ***Normal deeplinking*** - Direct deep linking occurs when a user already has your app installed on their device. When this is the case, the deep link will redirect the user to the screen specified in the link.

* ***Deferred deeplinking*** - Deferred deep linking occurs when a user does not have your app installed on their device. When this is the case, the deep link will first send the user to the device app store to install the app. Once the user has installed and opened the app, the SDK will redirect them to the screen specified in the link.

Please check below the Deeplinking scenario 

<img width="705" alt="Screenshot 2022-06-22 at 10 48 20 PM" src="https://user-images.githubusercontent.com/16884982/175099075-349910ce-ce7b-4a71-868c-11c34c4331cd.png">


### Normal Deep linking for Android

If a user already has your app on their device, it will open when they interact with a tracker containing a deep link. You can then parse the deep link information for further use. To do this, you need to choose a desired unique scheme name.

You can set up a specific activity to launch when a user interacts with a deep link. To do this:

* Assign the unique scheme name to the activity in your AndroidManifest.xml file.
* Add the intent-filter section to the activity definition.
* Assign an android:scheme property value with your preferred scheme name.

For example, you could set up an activity called FirstActivity to open like this:
#### AndroidManifest.xml 

```

        <activity
            android:name=".Activity.FirstProduct"
            android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data
                android:host="trackier.u9ilnk.me"
                android:pathPrefix="/product"
                android:scheme="https" />
        </intent-filter>
        </activity>

```

```
https://trackier.u9ilnk.me/product?dlv=FirstProduct&quantity=10&pid=sms
```

### Normal Deep linking Setup for iOS
    
There is a Universal Links iOS app opening method which needs to be implemented for deeplink to work. This method directly opens the mobile app at default activity. Universal links take the format of normal web links for example. https://yourbrand.com or https://yourbrand.u9ilnk.me

Follow the steps for configuring Universal Links

**a. Getting the app bundle ID and prefix ID**

1. Log into your Apple Developer Account.
2. On the left-hand menu, select Certificates, IDs & Profiles.
3. Under Identifiers, select App IDs.
4. Click the relevant app.
5. Copy the prefix ID and app bundle ID and insert in app settings page in Trackier MMP.

Screenshot[10]

<img width="1000" alt="Screenshot apple" src="https://user-images.githubusercontent.com/16884982/190552695-060b22bc-e269-4a53-b397-09b6162b2faf.png">

**b. Adding the prefix ID and app bundle ID in the Trackier MMP.**

- Login your Trackier Panel
- Select your application and click on Action button and login as
- In the Dashboard, Click on the `UniLink` option on the left side of panel.
- On the Unilink page, create template by click on Action button which is located on the right side header of the page.
- After creating template, Edit that template by click on the edit button.
- On the edit template page, Add the prefix ID and app bundle ID in the **Link Behaviour (When application is installed)**

Please check the screenshot for the reference

Screenshot[11]

<img width="1000" alt="Screenshot dashboard" src="https://user-images.githubusercontent.com/16884982/190556533-c05419b8-ea6c-4850-9ea3-11ce5545b764.png">

**c. Configure mobile apps to register associated domains**

Configuring mobile apps to register approved domains takes place inside Xcode. It requires the unilink subdomain that you can get from app setting page in Trackier MMP.

1. Follow this [iOS instructions](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
2. Get the unilink subdomain from app settings page in Trackier MMP.
3. In Xcode, click on your project. Click on the project target.
4. Switch to Capabilities tab.
5. Turn on Associated Domain.
6. Add the unilink subdomain that you got from Trackier MMP.
7. The format is applinks:subdomain.unilink.me. Add **applinks:** before the domain as like `applinks:subdomain.unilink.me`

Screenshot[12]

<img width="1000" alt="Screenshotxcode" src="https://user-images.githubusercontent.com/16884982/190557503-a13cbf23-8485-491b-a9d7-dcd86e44c912.png">

To associate a domain with your app, you need to have the associated domain file on your domain and the appropriate entitlement in your app. Once the unilink is created, Trackier hosts the apple-app-site-association file. When a user installs your app, the system attempts to download the associated domain file and verify the domains in your Associated Domains Entitlement.


### Deferred Deep linking

Deferred deep linking happened, when a user does not have your app installed on their device. When the user clicks a trackier URL, the URL will redirect them to the Play Store to download and install your app. When the user opens the app for the first time, the SDK will read the deep_link content.

The Trackier SDK opens the deferred deep link by default. just need to add some code in application class just after initilazation of Trackier SDk

Below are the example of the code :-

```tsx

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NativeEventEmitter, NativeModules} from 'react-native';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

export default function App() {

  useEffect(() => {

    const trackierConfig = new TrackierConfig("ee9f21fb-xxxx-xxxx-xxxxx-e4093e6d220c", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587xxxxxxac0cb370", "9e043b7e-7f44-xxx-xxxxx-8cf6bfe8daa0"); //SDK Signing
    trackierConfig.setDeferredDeeplinkCallbackListener((uri: string) => {
        console.log("Deferred Deeplink Callback received");
        console.log("URL: " + uri);
    });
  
    TrackierSDK.initialize(trackierConfig);
 
  }, []);
}


```
## <a id="qs-campaign-data"></a>Getting Campaign Data
For getting the campaign data, We have a function that return the campaign data. Please check below the example code.

```js

function _onPress_trackSimpleEvent(){
    var trackierEvent = new TrackierEvent(TrackierEvent.UPDATE);
    //Campaign Data 
    TrackierSDK.getAd().then(val => console.log('===getAD: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getCampaign().then(val => console.log('===getCampaign: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getCampaignID().then(val => console.log('===getCampaignID: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getAdSet().then(val => console.log('===getAdSet: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getAdSetID().then(val => console.log('===getAdSetID: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getChannel().then(val => console.log('===getChannel: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getP1().then(val => console.log('===getP1: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getP2().then(val => console.log('===getP2: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getP3().then(val => console.log('===getP3: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getP4().then(val => console.log('===getP4: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getP5().then(val => console.log('===getP5: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getClickId().then(val => console.log('===getClickId: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getDlv().then(val => console.log('===getDlv: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getPid().then(val => console.log('===getPid: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.getIsRetargeting().then(val => console.log('===getIsRetargeting: ', val)).catch(e => console.log('==error: ', e))
    TrackierSDK.trackEvent(trackierEvent);
  }

```

## <a id="qs-progaurd-settings"></a>Proguard Settings 

If your app is using proguard then add these lines to the proguard config file 

``` 
  -keep class com.trackier.sdk.** { *; }
  -keep class com.google.android.gms.common.ConnectionResult {
      int SUCCESS;
  }
  -keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
      com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
  }
  -keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
      java.lang.String getId();
      boolean isLimitAdTrackingEnabled();
  }
  -keep public class com.android.installreferrer.** { *; }
  
```
