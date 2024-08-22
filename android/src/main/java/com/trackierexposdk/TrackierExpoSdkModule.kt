package com.trackierexposdk

import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.trackier.sdk.DeepLink
import com.trackier.sdk.DeepLinkListener

class TrackierExpoSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android


  @ReactMethod
  fun initializeSDK(initializeMap: ReadableMap) {
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
    if (initializeMap.hasKey("hasDeferredDeeplinkCallback")) {
      sdkConfig.setDeepLinkListener(object : DeepLinkListener {
        override fun onDeepLinking(deepLink: DeepLink) {
          sendEvent(
            reactApplicationContext,
            "trackier_deferredDeeplink",
            deepLink.getUrl()
          )
        }
      })
    }
    com.trackier.sdk.TrackierSDK.initialize(sdkConfig)
  }

  @ReactMethod
  fun setEnabled(value: Boolean) {
    com.trackier.sdk.TrackierSDK.setEnabled(value)
  }

  @ReactMethod
  fun getTrackierId(promise: Promise) {
    val id = com.trackier.sdk.TrackierSDK.getTrackierId()
    promise.resolve(id)
  }

  @ReactMethod
  fun setUserId(userId: String) {
    com.trackier.sdk.TrackierSDK.setUserId(userId)
  }

  @ReactMethod
  fun trackAsOrganic(value: Boolean) {
    com.trackier.sdk.TrackierSDK.trackAsOrganic(value)
  }

  @ReactMethod
  fun setUserEmail(userEmail: String) {
    com.trackier.sdk.TrackierSDK.setUserEmail(userEmail)
  }

  @ReactMethod
  fun setUserName(userName: String) {
    com.trackier.sdk.TrackierSDK.setUserName(userName)
  }

  @ReactMethod
  fun setUserPhone(userPhone: String) {
    com.trackier.sdk.TrackierSDK.setUserPhone(userPhone)
  }

  @ReactMethod
  fun parseDeepLink(uri: String) {
    val data = Uri.parse(uri)
    com.trackier.sdk.TrackierSDK.parseDeepLink(data)
  }

  @ReactMethod
  fun getAd(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getAd())
  }

  @ReactMethod
  fun getAdID(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getAdID())
  }

  @ReactMethod
  fun getAdSet(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getAdSet())
  }

  @ReactMethod
  fun getCampaign(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getCampaign())
  }

  @ReactMethod
  fun getCampaignID(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getCampaignID())
  }

  @ReactMethod
  fun getChannel(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getChannel())
  }

  @ReactMethod
  fun getP1(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getP1())
  }

  @ReactMethod
  fun getP2(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getP2())
  }

  @ReactMethod
  fun getP3(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getP3())
  }

  @ReactMethod
  fun getP4(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getP4())
  }

  @ReactMethod
  fun getP5(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getP5())
  }

  @ReactMethod
  fun getClickId(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getClickId())
  }

  @ReactMethod
  fun getDlv(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getDlv())
  }

  @ReactMethod
  fun getPid(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getPid())
  }

  @ReactMethod
  fun getIsRetargeting(promise: Promise) {
    promise.resolve(com.trackier.sdk.TrackierSDK.getIsRetargeting())
  }

  @ReactMethod
  fun setPreinstallAttribution(pid: String, campaign: String, campaignId: String) {
    com.trackier.sdk.TrackierSDK.setPreinstallAttribution(pid, campaign, campaignId)
  }

  @ReactMethod
  fun setLocalRefTrack(value: Boolean, delimiter: String) {
    com.trackier.sdk.TrackierSDK.setLocalRefTrack(value, delimiter)
  }

  @ReactMethod
  fun fireInstall() {
    com.trackier.sdk.TrackierSDK.fireInstall()
  }

  @ReactMethod
  fun setIMEI(imei1: String, imei2: String) {
    com.trackier.sdk.TrackierSDK.setIMEI(imei1, imei2)
  }

  @ReactMethod
  fun setMacAddress(macAddress: String) {
    com.trackier.sdk.TrackierSDK.setMacAddress(macAddress)
  }

  @ReactMethod
  fun setUserAdditionalDetails(userAdditionalDetailsMap: ReadableMap) {
    // Add implementation if needed
  }

  @ReactMethod
  fun trackEvent(trackierEventMap: ReadableMap) {
    val trackierEvent = com.trackier.sdk.TrackierEvent(trackierEventMap.getString("eventId") ?: "")

    trackierEvent.orderId = trackierEventMap.getString("orderId")
    trackierEvent.currency = trackierEventMap.getString("currency")
    trackierEvent.couponCode = trackierEventMap.getString("couponCode")
    trackierEvent.productId = trackierEventMap.getString("productId")
    trackierEvent.discount = trackierEventMap.getDouble("discount").toFloat()
    trackierEvent.param1 = trackierEventMap.getString("param1")
    trackierEvent.param2 = trackierEventMap.getString("param2")
    trackierEvent.param3 = trackierEventMap.getString("param3")
    trackierEvent.param4 = trackierEventMap.getString("param4")
    trackierEvent.param5 = trackierEventMap.getString("param5")
    trackierEvent.param6 = trackierEventMap.getString("param6")
    trackierEvent.param7 = trackierEventMap.getString("param7")
    trackierEvent.param8 = trackierEventMap.getString("param8")
    trackierEvent.param9 = trackierEventMap.getString("param9")
    trackierEvent.param10 = trackierEventMap.getString("param10")
    trackierEvent.revenue = trackierEventMap.getDouble("revenue")

    val eventValues = TrackierUtil.toMap(trackierEventMap.getMap("ev"))
    val ev = LinkedHashMap<String, Any>()
    eventValues?.let {
      for ((key, value) in it) {
        ev[key] = value.toString()
      }
    }
    trackierEvent.ev = ev
    com.trackier.sdk.TrackierSDK.trackEvent(trackierEvent)
  }

  private fun checkKey(map: ReadableMap, key: String): Boolean {
    return map.hasKey(key) && !map.isNull(key)
  }

  private fun sendEvent(reactContext: ReactApplicationContext, eventName: String, params: String?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }


  companion object {
    const val NAME = "TrackierExpoSdk"
  }
}
