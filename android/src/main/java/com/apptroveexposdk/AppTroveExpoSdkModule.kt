package com.apptroveexposdk

import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.apptrove.sdk.AttributionParams
import com.apptrove.sdk.DeepLink
import com.apptrove.sdk.DeepLinkListener
import com.apptrove.sdk.AppTroveSDKConfig
import com.apptrove.sdk.dynamic_link.AndroidParameters
import com.apptrove.sdk.dynamic_link.DesktopParameters
import com.apptrove.sdk.dynamic_link.DynamicLink
import com.apptrove.sdk.dynamic_link.IosParameters
import com.apptrove.sdk.dynamic_link.SocialMetaTagParameters

class AppTroveExpoSdkModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android

  @ReactMethod
  fun initializeSDK(initializeMap: ReadableMap) {
    try {
      val sdkConfig =
              AppTroveSDKConfig(
                      reactApplicationContext,
                      initializeMap.getString("appToken") ?: "",
                      initializeMap.getString("environment") ?: ""
              )
      sdkConfig.setSDKType("react_native_sdk")
      sdkConfig.setSDKVersion("2.0.0")
      sdkConfig.setAppSecret(
              initializeMap.getString("secretId") ?: "",
              initializeMap.getString("secretKey") ?: ""
      )
      sdkConfig.setManualMode(initializeMap.getBoolean("manualMode"))
      sdkConfig.disableOrganicTracking(initializeMap.getBoolean("disableOrganicTrack"))
    if (initializeMap.hasKey("hasDeferredDeeplinkCallback")) {
      sdkConfig.setDeepLinkListener(
              object : DeepLinkListener {
                override fun onDeepLinking(deepLink: DeepLink) {
                  sendEvent(reactApplicationContext, "apptrove_deferredDeeplink", deepLink.getUrl())
                }
              }
      )
    }
    if (initializeMap.hasKey("region")) {
      val regionStr = initializeMap.getString("region")
      if (regionStr != null) {
                val selectedRegion =
                when (regionStr.uppercase()) {
                  "IN" -> AppTroveSDKConfig.Region.IN
                  "GLOBAL" -> AppTroveSDKConfig.Region.GLOBAL
                  else -> {
                    android.util.Log.w("AppTroveExpoSdk", "Unknown region: $regionStr")
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
      android.util.Log.d("AppTroveExpoSdk", "attributionParams map is missing or null")
    }

    if (initializeMap.hasKey("facebookAppId")) {
      val facebookAppId = initializeMap.getString("facebookAppId")
      if (facebookAppId != null && facebookAppId.isNotEmpty()) {
        sdkConfig.setFacebookAppId(facebookAppId)
      }
    }

    if (initializeMap.hasKey("androidId")) {
      val androidId = initializeMap.getString("androidId")
      if (androidId != null && androidId.isNotEmpty()) {
        sdkConfig.setAndroidId(androidId)
      }
    }

    if (initializeMap.hasKey("appId")) {
      val appId = initializeMap.getString("appId")
      if (appId != null && appId.isNotEmpty()) {
        sdkConfig.setAppID(appId)
      }
    }

    if (initializeMap.hasKey("encryptionType")) {
      val encryptionTypeStr = initializeMap.getString("encryptionType")
      if (encryptionTypeStr != null) {
        sdkConfig.setEncryptionType(AppTroveSDKConfig.EncryptionType.AES_GCM)
      }
    }

    if (initializeMap.hasKey("encryptionKey")) {
      val encryptionKey = initializeMap.getString("encryptionKey")
      if (encryptionKey != null && encryptionKey.isNotEmpty()) {
        sdkConfig.setEncryptionKey(encryptionKey)
      }
    }

      com.apptrove.sdk.AppTroveSDK.initialize(sdkConfig)
      android.util.Log.d("AppTroveExpoSdk", "AppTrove SDK initialized successfully")
    } catch (e: Exception) {
      android.util.Log.e("AppTroveExpoSdk", "Error initializing AppTrove SDK: ${e.message}", e)
      e.printStackTrace()
      throw e
    }
  }

  @ReactMethod
  fun setEnabled(value: Boolean) {
    com.apptrove.sdk.AppTroveSDK.setEnabled(value)
  }

  @ReactMethod
  fun getAppTroveId(promise: Promise) {
    val id = com.apptrove.sdk.AppTroveSDK.getAppTroveId()
    promise.resolve(id)
  }

  @ReactMethod
  fun setUserId(userId: String) {
    com.apptrove.sdk.AppTroveSDK.setUserId(userId)
  }

  @ReactMethod
  fun trackAsOrganic(value: Boolean) {
    com.apptrove.sdk.AppTroveSDK.trackAsOrganic(value)
  }

  @ReactMethod
  fun setUserEmail(userEmail: String) {
    com.apptrove.sdk.AppTroveSDK.setUserEmail(userEmail)
  }

  @ReactMethod
  fun setUserName(userName: String) {
    com.apptrove.sdk.AppTroveSDK.setUserName(userName)
  }

  @ReactMethod
  fun setUserPhone(userPhone: String) {
    com.apptrove.sdk.AppTroveSDK.setUserPhone(userPhone)
  }

  @ReactMethod
  fun parseDeepLink(uri: String) {
    val data = Uri.parse(uri)
    com.apptrove.sdk.AppTroveSDK.parseDeepLink(data)
  }

  @ReactMethod
  fun getAd(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getAd())
  }

  @ReactMethod
  fun getAdID(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getAdID())
  }

  @ReactMethod
  fun getAdSet(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getAdSet())
  }

  @ReactMethod
  fun getCampaign(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getCampaign())
  }

  @ReactMethod
  fun getCampaignID(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getCampaignID())
  }

  @ReactMethod
  fun getChannel(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getChannel())
  }

  @ReactMethod
  fun getP1(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getP1())
  }

  @ReactMethod
  fun getP2(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getP2())
  }

  @ReactMethod
  fun getP3(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getP3())
  }

  @ReactMethod
  fun getP4(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getP4())
  }

  @ReactMethod
  fun getP5(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getP5())
  }

  @ReactMethod
  fun getClickId(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getClickId())
  }

  @ReactMethod
  fun getDlv(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getDlv())
  }

  @ReactMethod
  fun getPid(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getPid())
  }

  @ReactMethod
  fun getIsRetargeting(promise: Promise) {
    promise.resolve(com.apptrove.sdk.AppTroveSDK.getIsRetargeting())
  }

  @ReactMethod
  fun setPreinstallAttribution(pid: String, campaign: String, campaignId: String) {
    com.apptrove.sdk.AppTroveSDK.setPreinstallAttribution(pid, campaign, campaignId)
  }

  @ReactMethod
  fun setLocalRefTrack(value: Boolean, delimiter: String) {
    com.apptrove.sdk.AppTroveSDK.setLocalRefTrack(value, delimiter)
  }

  @ReactMethod
  fun fireInstall() {
    com.apptrove.sdk.AppTroveSDK.fireInstall()
  }

  @ReactMethod
  fun setIMEI(imei1: String, imei2: String) {
    com.apptrove.sdk.AppTroveSDK.setIMEI(imei1, imei2)
  }

  @ReactMethod
  fun setMacAddress(macAddress: String) {
    com.apptrove.sdk.AppTroveSDK.setMacAddress(macAddress)
  }

  @ReactMethod
  fun setUserAdditionalDetails(userAdditionalDetailsMap: ReadableMap) {
    android.util.Log.d("apptrovesdk", "JS map received: $userAdditionalDetailsMap")

    if (checkKey(userAdditionalDetailsMap, "userAdditionalMap")) {
      val map = userAdditionalDetailsMap.getMap("userAdditionalMap")

      if (map != null) {
        val userAdditionalDetail = AppTroveUtil.toMap(map)
        if (userAdditionalDetail != null) {
          // Optional: clean/map to string values if needed
          val ev = LinkedHashMap<String, Any>()
          for ((key, value) in userAdditionalDetail) {
            ev[key] = value?.toString() ?: ""
          }

          android.util.Log.d("apptrovesdk", "Passing to SDK: ${ev.toString()}")
          com.apptrove.sdk.AppTroveSDK.setUserAdditionalDetails(ev) // this calls your Kotlin method
        }
      }
    }
  }

  @ReactMethod
  fun trackEvent(eventMap: ReadableMap) {
    val appTroveEvent = com.apptrove.sdk.AppTroveEvent(eventMap.getString("eventId") ?: "")

    appTroveEvent.orderId = eventMap.getString("orderId")
    appTroveEvent.currency = eventMap.getString("currency")
    appTroveEvent.couponCode = eventMap.getString("couponCode")
    appTroveEvent.productId = eventMap.getString("productId")
    appTroveEvent.discount = eventMap.getDouble("discount").toFloat()
    appTroveEvent.param1 = eventMap.getString("param1")
    appTroveEvent.param2 = eventMap.getString("param2")
    appTroveEvent.param3 = eventMap.getString("param3")
    appTroveEvent.param4 = eventMap.getString("param4")
    appTroveEvent.param5 = eventMap.getString("param5")
    appTroveEvent.param6 = eventMap.getString("param6")
    appTroveEvent.param7 = eventMap.getString("param7")
    appTroveEvent.param8 = eventMap.getString("param8")
    appTroveEvent.param9 = eventMap.getString("param9")
    appTroveEvent.param10 = eventMap.getString("param10")
    appTroveEvent.revenue = eventMap.getDouble("revenue")

    val eventValues = AppTroveUtil.toMap(eventMap.getMap("ev"))
    val ev = LinkedHashMap<String, Any>()
    eventValues?.let {
      for ((key, value) in it) {
        ev[key] = value.toString()
      }
    }
    appTroveEvent.ev = ev
    com.apptrove.sdk.AppTroveSDK.trackEvent(appTroveEvent)
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
          val channel =
                  if (attrParams.hasKey("channel")) attrParams.getString("channel") ?: "" else ""
          val campaign =
                  if (attrParams.hasKey("campaign")) attrParams.getString("campaign") ?: "" else ""
          val mediaSource =
                  if (attrParams.hasKey("mediaSource")) attrParams.getString("mediaSource") ?: ""
                  else ""
          val p1 = if (attrParams.hasKey("p1")) attrParams.getString("p1") ?: "" else ""
          val p2 = if (attrParams.hasKey("p2")) attrParams.getString("p2") ?: "" else ""
          val p3 = if (attrParams.hasKey("p3")) attrParams.getString("p3") ?: "" else ""
          val p4 = if (attrParams.hasKey("p4")) attrParams.getString("p4") ?: "" else ""
          val p5 = if (attrParams.hasKey("p5")) attrParams.getString("p5") ?: "" else ""
          builder.setAttributionParameters(channel, campaign, mediaSource, p1, p2, p3, p4, p5)
        }
      }

      val dynamicLink = builder.build()
      com.apptrove.sdk.AppTroveSDK.createDynamicLink(
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
    com.apptrove.sdk.AppTroveSDK.resolveDeeplinkUrl(
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
    const val NAME = "AppTroveExpoSdk"
  }
}
