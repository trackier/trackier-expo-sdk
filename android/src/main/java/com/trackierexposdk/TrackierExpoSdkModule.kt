package com.trackierexposdk

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

class TrackierExpoSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  fun initializeSDK(initializeMap: ReadableMap) {
    Log.d("trackiersdk","inittt----"+initializeMap.toString())
    val sdkConfig = com.trackier.sdk.TrackierSDKConfig(
      reactApplicationContext,
      initializeMap.getString("appToken") ?: "",
      initializeMap.getString("environment") ?: ""
    )
    sdkConfig.setSDKType("react_native_sdk")
    sdkConfig.setSDKVersion("1.6.60")
    sdkConfig.setAppSecret(
      initializeMap.getString("secretId") ?: "",
      initializeMap.getString("secretKey") ?: ""
    )
    sdkConfig.setManualMode(initializeMap.getBoolean("manualMode"))
    sdkConfig.disableOrganicTracking(initializeMap.getBoolean("disableOrganicTrack"))

//    if (initializeMap.hasKey("hasDeferredDeeplinkCallback")) {
//      sdkConfig.setDeepLinkListener { deepLink ->
//        sendEvent(reactApplicationContext, "trackier_deferredDeeplink", deepLink.url)
//      }
//    }

    com.trackier.sdk.TrackierSDK.initialize(sdkConfig)
  }

  companion object {
    const val NAME = "TrackierExpoSdk"
  }
}
