package com.trackierexposdk

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.trackier.sdk.DeepLink
import com.trackier.sdk.DeepLinkListener
import com.trackier.sdk.AttributionParams
import com.trackier.sdk.TrackierSDKConfig
import com.trackier.sdk.dynamic_link.AndroidParameters
import com.trackier.sdk.dynamic_link.DesktopParameters
import com.trackier.sdk.dynamic_link.DynamicLink
import com.trackier.sdk.dynamic_link.IosParameters
import com.trackier.sdk.dynamic_link.SocialMetaTagParameters

class TrackierExpoSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android

  @ReactMethod
  fun initializeSDK(initializeMap: ReadableMap) {
    val sdkConfig = TrackierSDKConfig(
      reactApplicationContext,
      initializeMap.getString("appToken") ?: "",
      initializeMap.getString("environment") ?: ""
    )
    sdkConfig.setSDKType("react_native_sdk")
    sdkConfig.setSDKVersion("1.6.73")
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
    if (initializeMap.hasKey("region")) {
      val regionStr = initializeMap.getString("region")
      if (regionStr != null) {
        val selectedRegion = when (regionStr.uppercase()) {
          "IN" -> TrackierSDKConfig.Region.IN
          "GLOBAL" -> TrackierSDKConfig.Region.GLOBAL
          else -> {
            android.util.Log.w("TrackierExpoSdk", "Unknown region: $regionStr")
            null
          }
        }
        selectedRegion?.let { sdkConfig.setRegion(it) }
      }
    }
    if (initializeMap.hasKey("attributionParams") && !initializeMap.isNull("attributionParams")) {
      val attributionMap = initializeMap.getMap("attributionParams")
      if (attributionMap != null) {
        val attributionParams = AttributionParams()
        if (attributionMap.hasKey("ad")) {
          attributionParams.ad = attributionMap.getString("ad") ?: ""
        }
        if (attributionMap.hasKey("partnerId")) {
          attributionParams.parterId = attributionMap.getString("partnerId") ?: ""
        }
        if (attributionMap.hasKey("channel")) {
          attributionParams.channel = attributionMap.getString("channel") ?: ""
        }
        if (attributionMap.hasKey("adId")) {
          attributionParams.adId = attributionMap.getString("adId") ?: ""
        }
        if (attributionMap.hasKey("siteId")) {
          attributionParams.siteId = attributionMap.getString("siteId") ?: ""
        }
        sdkConfig.setAttributionParams(attributionParams)
      }
    } else {
      android.util.Log.e("TrackierExpoSdk", "attributionParams map is missing or null")
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
  fun setUserAdditionalDetails(readableMap: ReadableMap) {
    val clevertapID = readableMap.getString("clevertap_uid")
    val hashMap1 = HashMap<String, Any>()
    hashMap1["clevertap_uid"] = clevertapID ?: ""
    com.trackier.sdk.TrackierSDK.setUserAdditionalDetails(hashMap1)
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

  @ReactMethod
  fun createDynamicLink(config: ReadableMap, promise: Promise) {
    try {
      val builder = DynamicLink.Builder()

      if (config.hasKey("templateId")) {
        builder.setTemplateId(config.getString("templateId") ?: "")
      }
      if (config.hasKey("link")) {
        builder.setLink(Uri.parse(config.getString("link") ?: ""))
      }
      if (config.hasKey("domainUriPrefix")) {
        builder.setDomainUriPrefix(config.getString("domainUriPrefix") ?: "")
      }
      if (config.hasKey("deepLinkValue")) {
        builder.setDeepLinkValue(config.getString("deepLinkValue") ?: "")
      }
      if (config.hasKey("androidParameters")) {
        val androidParams = config.getMap("androidParameters")
        if (androidParams != null) {
          val androidBuilder = AndroidParameters.Builder()
          if (androidParams.hasKey("redirectLink")) {
            androidBuilder.setRedirectLink(androidParams.getString("redirectLink") ?: "")
          }
          builder.setAndroidParameters(androidBuilder.build())
        }
      }
      if (config.hasKey("iosParameters")) {
        val iosParams = config.getMap("iosParameters")
        if (iosParams != null) {
          val iosBuilder = IosParameters.Builder()
          if (iosParams.hasKey("redirectLink")) {
            iosBuilder.setRedirectLink(iosParams.getString("redirectLink") ?: "")
          }
          builder.setIosParameters(iosBuilder.build())
        }
      }
      if (config.hasKey("desktopParameters")) {
        val desktopParams = config.getMap("desktopParameters")
        if (desktopParams != null) {
          val desktopBuilder = DesktopParameters.Builder()
          if (desktopParams.hasKey("redirectLink")) {
            desktopBuilder.setRedirectLink(desktopParams.getString("redirectLink") ?: "")
          }
          builder.setDesktopParameters(desktopBuilder.build())
        }
      }
      if (config.hasKey("socialMetaTagParameters")) {
        val meta = config.getMap("socialMetaTagParameters")
        if (meta != null) {
          val metaBuilder = SocialMetaTagParameters.Builder()
          if (meta.hasKey("title")) {
            metaBuilder.setTitle(meta.getString("title") ?: "")
          }
          if (meta.hasKey("description")) {
            metaBuilder.setDescription(meta.getString("description") ?: "")
          }
          if (meta.hasKey("imageLink")) {
            metaBuilder.setImageLink(meta.getString("imageLink") ?: "")
          }
          builder.setSocialMetaTagParameters(metaBuilder.build())
        }
      }
      if (config.hasKey("sdkParameters")) {
        val sdkParams = config.getMap("sdkParameters")
        if (sdkParams != null) {
          val paramMap = HashMap<String, String>()
          val iterator = sdkParams.keySetIterator()
          while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            paramMap[key] = sdkParams.getString(key) ?: ""
          }
          builder.setSDKParameters(paramMap)
        }
      }
      if (config.hasKey("attributionParameters")) {
        val attrParams = config.getMap("attributionParameters")
        if (attrParams != null) {
          val channel = if (attrParams.hasKey("channel")) attrParams.getString("channel") ?: "" else ""
          val campaign = if (attrParams.hasKey("campaign")) attrParams.getString("campaign") ?: "" else ""
          val mediaSource = if (attrParams.hasKey("mediaSource")) attrParams.getString("mediaSource") ?: "" else ""
          val p1 = if (attrParams.hasKey("p1")) attrParams.getString("p1") ?: "" else ""
          val p2 = if (attrParams.hasKey("p2")) attrParams.getString("p2") ?: "" else ""
          val p3 = if (attrParams.hasKey("p3")) attrParams.getString("p3") ?: "" else ""
          val p4 = if (attrParams.hasKey("p4")) attrParams.getString("p4") ?: "" else ""
          val p5 = if (attrParams.hasKey("p5")) attrParams.getString("p5") ?: "" else ""
          builder.setAttributionParameters(channel, campaign, mediaSource, p1, p2, p3, p4, p5)
        }
      }

      val dynamicLink = builder.build()
      com.trackier.sdk.TrackierSDK.createDynamicLink(
        dynamicLink,
        { dynamicLinkUrl ->
          promise.resolve(dynamicLinkUrl)
          Unit
        },
        { error ->
          promise.reject("CREATE_DYNAMIC_LINK_FAILED", error)
          Unit
        }
      )
    } catch (e: Exception) {
      promise.reject("CREATE_DYNAMIC_LINK_EXCEPTION", e)
    }
  }

  @ReactMethod
  fun resolveDeeplinkUrl(url: String, promise: Promise) {
    com.trackier.sdk.TrackierSDK.resolveDeeplinkUrl(
      url,
      { resultUrl ->
        try {
          val result = Arguments.createMap()
          result.putString("url", resultUrl.url)
          val sdkParamsMap = Arguments.createMap()
          resultUrl.sdkParams?.forEach { (key, value) ->
            sdkParamsMap.putString(key, value.toString())
          }
          result.putMap("sdkParams", sdkParamsMap)
          promise.resolve(result)
          Unit
        } catch (e: Exception) {
          promise.reject("DL_PARSE_ERROR", e)
          Unit
        }
      },
      { error ->
        promise.reject("RESOLVE_DEEPLINK_FAILED", error)
        Unit
      }
    )
  }

  companion object {
    const val NAME = "TrackierExpoSdk"
  }
}
