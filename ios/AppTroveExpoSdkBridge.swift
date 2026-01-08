//
//  AppTroveExpoSdkBridge.swift
//  apptrove-expo-sdk
//
//  This file bridges Swift AppTrove SDK to Objective-C
//

import Foundation
import apptrove_ios_sdk

// Expose AppTroveSDK classes to Objective-C
@objc public class AppTroveSDKBridge: NSObject {
  
  @objc public static func initializeSDK(config: [String: Any]) {
    guard let appToken = config["appToken"] as? String,
          let environment = config["environment"] as? String else {
      return
    }
    
    let sdkConfig = AppTroveSDKConfig(appToken: appToken, env: environment)
    sdkConfig.setSDKType(sdkType: "react_native_sdk")
    sdkConfig.setSDKVersion(sdkVersion: "2.0.0")
    
    if let secretId = config["secretId"] as? String,
       let secretKey = config["secretKey"] as? String {
      sdkConfig.setAppSecret(secretId: secretId, secretKey: secretKey)
    }
    
    if let regionStr = config["region"] as? String {
      if regionStr == "IN" {
        sdkConfig.setRegion(.IN)
      } else if regionStr == "GLOBAL" {
        sdkConfig.setRegion(.GLOBAL)
      }
    }
    
    // Set up deep link listener if needed
    if let hasCallback = config["hasDeferredDeeplinkCallback"] as? Bool, hasCallback {
      class DeepLinkListenerImpl: DeepLinkListener {
        let callback: (String) -> Void
        
        init(callback: @escaping (String) -> Void) {
          self.callback = callback
        }
        
        func onDeepLinking(result: DeepLink) {
          callback(result.getUrl())
        }
      }
      
      // Store the listener to prevent it from being deallocated
      let listener = DeepLinkListenerImpl { url in
        // Send event to React Native - this will be handled by the Objective-C layer
        NotificationCenter.default.post(name: NSNotification.Name("AppTroveDeepLinkReceived"), object: nil, userInfo: ["url": url])
      }
      
      // Keep a strong reference to prevent deallocation
      deepLinkListener = listener
      sdkConfig.setDeeplinkListerner(listener: listener)
    }
    
    AppTroveSDK.initialize(config: sdkConfig)
  }
  
  // Keep a strong reference to the deep link listener
  private static var deepLinkListener: DeepLinkListener?
  
  @objc public static func setEnabled(_ value: Bool) {
    AppTroveSDK.setEnabled(value: value)
  }
  
  @objc public static func getAppTroveId() -> String {
    return AppTroveSDK.getAppTroveId()
  }
  
  @objc public static func setUserId(_ userId: String) {
    AppTroveSDK.setUserID(userId: userId)
  }
  
  @objc public static func setUserEmail(_ userEmail: String) {
    AppTroveSDK.setUserEmail(userEmail: userEmail)
  }
  
  @objc public static func setUserName(_ userName: String) {
    AppTroveSDK.setUserName(userName: userName)
  }
  
  @objc public static func setUserPhone(_ userPhone: String) {
    AppTroveSDK.setUserPhone(userPhone: userPhone)
  }
  
  @objc public static func trackAsOrganic(_ value: Bool) {
    AppTroveSDK.trackAsOrganic(organic: value)
  }
  
  @objc public static func setUserAdditionalDetails(_ details: [String: Any]) {
    AppTroveSDK.setUserAdditionalDetails(userAdditionalDetails: details)
  }
  
  @objc public static func waitForATTUserAuthorization(_ timeoutInterval: Int) {
    AppTroveSDK.waitForATTUserAuthorization(timeoutInterval: timeoutInterval)
  }
  
  @objc public static func updateAppleAdsToken(_ token: String) {
    AppTroveSDK.updateAppleAdsToken(token: token)
  }
  
  @objc public static func updatePostbackConversion(_ conversionValue: Int) {
    AppTroveSDK.updatePostbackConversion(conversionValue: conversionValue)
  }
  
  @objc public static func subscribeDeeplink() {
    if #available(iOS 13.0, *) {
      AppTroveSDK.subscribeAttributionlink()
    }
  }
  
  @objc public static func parseDeepLink(_ uri: String) {
    AppTroveSDK.parseDeepLink(uri: uri)
  }
  
  @objc public static func getAd() -> String {
    return AppTroveSDK.getAd()
  }
  
  @objc public static func getAdID() -> String {
    return AppTroveSDK.getAdID()
  }
  
  @objc public static func getAdSet() -> String {
    return AppTroveSDK.getAdSet()
  }
  
  @objc public static func getCampaign() -> String {
    return AppTroveSDK.getCampaign()
  }
  
  @objc public static func getCampaignID() -> String {
    return AppTroveSDK.getCampaignID()
  }
  
  @objc public static func getChannel() -> String {
    return AppTroveSDK.getChannel()
  }
  
  @objc public static func getP1() -> String {
    return AppTroveSDK.getP1()
  }
  
  @objc public static func getP2() -> String {
    return AppTroveSDK.getP2()
  }
  
  @objc public static func getP3() -> String {
    return AppTroveSDK.getP3()
  }
  
  @objc public static func getP4() -> String {
    return AppTroveSDK.getP4()
  }
  
  @objc public static func getP5() -> String {
    return AppTroveSDK.getP5()
  }
  
  @objc public static func getClickId() -> String {
    return AppTroveSDK.getClickId()
  }
  
  @objc public static func getDlv() -> String {
    return AppTroveSDK.getDlv()
  }
  
  @objc public static func getPid() -> String {
    return AppTroveSDK.getPid()
  }
  
  @objc public static func getIsRetargeting() -> Bool {
    let value = AppTroveSDK.getIsRetargeting()
    return value == "true" || value == "1"
  }
  
  @objc public static func trackEvent(_ eventMap: [String: Any]) {
    guard let eventId = eventMap["eventId"] as? String else {
      return
    }
    
    let event = AppTroveEvent(id: eventId)
    
    if let orderId = eventMap["orderId"] as? String {
      event.orderId = orderId
    }
    if let currency = eventMap["currency"] as? String {
      event.currency = currency
    }
    if let couponCode = eventMap["couponCode"] as? String {
      event.setCouponCode(couponCode: couponCode)
    }
    if let discount = eventMap["discount"] as? Double {
      event.setDiscount(discount: discount)
    }
    if let revenue = eventMap["revenue"] as? Double {
      let currency = eventMap["currency"] as? String ?? "USD"
      event.setRevenue(revenue: revenue, currency: currency)
    }
    
    // Set params
    if let param1 = eventMap["param1"] as? String { event.param1 = param1 }
    if let param2 = eventMap["param2"] as? String { event.param2 = param2 }
    if let param3 = eventMap["param3"] as? String { event.param3 = param3 }
    if let param4 = eventMap["param4"] as? String { event.param4 = param4 }
    if let param5 = eventMap["param5"] as? String { event.param5 = param5 }
    if let param6 = eventMap["param6"] as? String { event.param6 = param6 }
    if let param7 = eventMap["param7"] as? String { event.param7 = param7 }
    if let param8 = eventMap["param8"] as? String { event.param8 = param8 }
    if let param9 = eventMap["param9"] as? String { event.param9 = param9 }
    if let param10 = eventMap["param10"] as? String { event.param10 = param10 }
    
    // Set custom event values
    if let ev = eventMap["ev"] as? [String: Any] {
      for (key, value) in ev {
        event.addEventValue(prop: key, val: value)
      }
    }
    
    AppTroveSDK.trackEvent(event: event)
  }
  
  @objc public static func createDynamicLink(
    config: [String: Any],
    onSuccess: @escaping (String) -> Void,
    onFailure: @escaping (String) -> Void
  ) {
    if #available(iOS 13.0, *) {
      let builder = DynamicLink.Builder()
      
      if let templateId = config["templateId"] as? String {
        builder.setTemplateId(templateId)
      }
      if let link = config["link"] as? String {
        builder.setLink(link)
      }
      if let domainUriPrefix = config["domainUriPrefix"] as? String {
        builder.setDomainUriPrefix(domainUriPrefix)
      }
      if let deepLinkValue = config["deepLinkValue"] as? String {
        builder.setDeepLinkValue(deepLinkValue)
      }
      
      if let androidParams = config["androidParameters"] as? [String: Any],
         let redirectLink = androidParams["redirectLink"] as? String {
        let androidBuilder = AndroidParameters.Builder()
        androidBuilder.setRedirectLink(redirectLink)
        builder.setAndroidParameters(androidBuilder.build())
      }
      
      if let iosParams = config["iosParameters"] as? [String: Any],
         let redirectLink = iosParams["redirectLink"] as? String {
        let iosBuilder = IosParameters.Builder()
        iosBuilder.setRedirectLink(redirectLink)
        builder.setIosParameters(iosBuilder.build())
      }
      
      if let desktopParams = config["desktopParameters"] as? [String: Any],
         let redirectLink = desktopParams["redirectLink"] as? String {
        let desktopBuilder = DesktopParameters.Builder()
        desktopBuilder.setRedirectLink(redirectLink)
        builder.setDesktopParameters(desktopBuilder.build())
      }
      
      if let socialMeta = config["socialMetaTagParameters"] as? [String: Any] {
        let metaBuilder = SocialMetaTagParameters.Builder()
        if let title = socialMeta["title"] as? String {
          metaBuilder.setTitle(title)
        }
        if let description = socialMeta["description"] as? String {
          metaBuilder.setDescription(description)
        }
        if let imageLink = socialMeta["imageLink"] as? String {
          metaBuilder.setImageLink(imageLink)
        }
        builder.setSocialMetaTagParameters(metaBuilder.build())
      }
      
      if let sdkParams = config["sdkParameters"] as? [String: String] {
        builder.setSDKParameters(sdkParams)
      }
      
      if let attrParams = config["attributionParameters"] as? [String: Any] {
        let channel = attrParams["channel"] as? String ?? ""
        let campaign = attrParams["campaign"] as? String ?? ""
        let mediaSource = attrParams["mediaSource"] as? String ?? ""
        let p1 = attrParams["p1"] as? String ?? ""
        let p2 = attrParams["p2"] as? String ?? ""
        let p3 = attrParams["p3"] as? String ?? ""
        let p4 = attrParams["p4"] as? String ?? ""
        let p5 = attrParams["p5"] as? String ?? ""
        builder.setAttributionParameters(
          channel: channel,
          campaign: campaign,
          mediaSource: mediaSource,
          p1: p1,
          p2: p2,
          p3: p3,
          p4: p4,
          p5: p5
        )
      }
      
      let dynamicLink = builder.build()
      
      AppTroveSDK.createDynamicLink(
        dynamicLink: dynamicLink,
        onSuccess: onSuccess,
        onFailure: onFailure
      )
    } else {
      onFailure("iOS 13.0 or later is required for dynamic links")
    }
  }
  
  @objc public static func resolveDeeplinkUrl(
    url: String,
    onSuccess: @escaping ([String: Any]) -> Void,
    onFailure: @escaping (String) -> Void
  ) {
    if #available(iOS 13.0, *) {
      AppTroveSDK.resolveDeeplinkUrl(
        inputUrl: url
      ) { result in
        switch result {
        case .success(let dlData):
          var resultDict: [String: Any] = [:]
          resultDict["url"] = dlData.url
          
          // Convert SDK params to dictionary
          if let sdkParams = dlData.sdkParams {
            var sdkParamsDict: [String: String] = [:]
            for (key, value) in sdkParams {
              sdkParamsDict[key] = String(describing: value)
            }
            resultDict["sdkParams"] = sdkParamsDict
          } else {
            resultDict["sdkParams"] = [:]
          }
          
          onSuccess(resultDict)
        case .failure(let error):
          onFailure(error.localizedDescription)
        }
      }
    } else {
      onFailure("iOS 13.0 or later is required for deeplink resolution")
    }
  }
}

