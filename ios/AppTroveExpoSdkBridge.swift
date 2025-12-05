//
//  AppTroveExpoSdkBridge.swift
//  apptrove-expo-sdk
//
//  This file bridges Swift Trackier SDK to Objective-C
//

import Foundation
import trackier_ios_sdk

// Expose TrackierSDK classes to Objective-C
@objc public class AppTroveSDKBridge: NSObject {
  
  @objc public static func initializeSDK(config: [String: Any]) {
    guard let appToken = config["appToken"] as? String,
          let environment = config["environment"] as? String else {
      return
    }
    
    let sdkConfig = TrackierSDKConfig(appToken: appToken, env: environment)
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
    
    TrackierSDK.initialize(config: sdkConfig)
  }
  
  @objc public static func setEnabled(_ value: Bool) {
    TrackierSDK.setEnabled(value: value)
  }
  
  @objc public static func getAppTroveId() -> String {
    return TrackierSDK.getTrackierId()
  }
  
  @objc public static func setUserId(_ userId: String) {
    TrackierSDK.setUserID(userId: userId)
  }
  
  @objc public static func setUserEmail(_ userEmail: String) {
    TrackierSDK.setUserEmail(userEmail: userEmail)
  }
  
  @objc public static func setUserName(_ userName: String) {
    TrackierSDK.setUserName(userName: userName)
  }
  
  @objc public static func setUserPhone(_ userPhone: String) {
    TrackierSDK.setUserPhone(userPhone: userPhone)
  }
  
  @objc public static func trackAsOrganic(_ value: Bool) {
    TrackierSDK.trackAsOrganic(organic: value)
  }
  
  @objc public static func setUserAdditionalDetails(_ details: [String: Any]) {
    TrackierSDK.setUserAdditionalDetails(userAdditionalDetails: details)
  }
  
  @objc public static func waitForATTUserAuthorization(_ timeoutInterval: Int) {
    TrackierSDK.waitForATTUserAuthorization(timeoutInterval: timeoutInterval)
  }
  
  @objc public static func updateAppleAdsToken(_ token: String) {
    TrackierSDK.updateAppleAdsToken(token: token)
  }
  
  @objc public static func updatePostbackConversion(_ conversionValue: Int) {
    TrackierSDK.updatePostbackConversion(conversionValue: conversionValue)
  }
  
  @objc public static func subscribeDeeplink() {
    if #available(iOS 13.0, *) {
      TrackierSDK.subscribeAttributionlink()
    }
  }
  
  @objc public static func parseDeepLink(_ uri: String) {
    TrackierSDK.parseDeepLink(uri: uri)
  }
  
  @objc public static func getAd() -> String {
    return TrackierSDK.getAd()
  }
  
  @objc public static func getAdID() -> String {
    return TrackierSDK.getAdID()
  }
  
  @objc public static func getAdSet() -> String {
    return TrackierSDK.getAdSet()
  }
  
  @objc public static func getCampaign() -> String {
    return TrackierSDK.getCampaign()
  }
  
  @objc public static func getCampaignID() -> String {
    return TrackierSDK.getCampaignID()
  }
  
  @objc public static func getChannel() -> String {
    return TrackierSDK.getChannel()
  }
  
  @objc public static func getP1() -> String {
    return TrackierSDK.getP1()
  }
  
  @objc public static func getP2() -> String {
    return TrackierSDK.getP2()
  }
  
  @objc public static func getP3() -> String {
    return TrackierSDK.getP3()
  }
  
  @objc public static func getP4() -> String {
    return TrackierSDK.getP4()
  }
  
  @objc public static func getP5() -> String {
    return TrackierSDK.getP5()
  }
  
  @objc public static func getClickId() -> String {
    return TrackierSDK.getClickId()
  }
  
  @objc public static func getDlv() -> String {
    return TrackierSDK.getDlv()
  }
  
  @objc public static func getPid() -> String {
    return TrackierSDK.getPid()
  }
  
  @objc public static func getIsRetargeting() -> Bool {
    let value = TrackierSDK.getIsRetargeting()
    return value == "true" || value == "1"
  }
  
  @objc public static func trackEvent(_ eventMap: [String: Any]) {
    guard let eventId = eventMap["eventId"] as? String else {
      return
    }
    
    let event = TrackierEvent(id: eventId)
    
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
    
    TrackierSDK.trackEvent(event: event)
  }
}

