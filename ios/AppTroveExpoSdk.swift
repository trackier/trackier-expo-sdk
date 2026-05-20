
import Foundation
import apptrove_ios_sdk
import React


@objc(AppTroveExpoSdk)
class AppTroveExpoSdk: RCTEventEmitter, DeepLinkListener {

  var hasListeners = false
	
	override func startObserving() {
		self.hasListeners = true
	}
	
	override func stopObserving() {
		self.hasListeners = false;
	}
	
	func onDeepLinking(result: apptrove_ios_sdk.DeepLink) {
		if (!self.hasListeners) {
			return
		}
		if (result.getUrl() == nil) {
			print("Deeplink URL is nil")
		} else {
			let url = result.getUrl() ?? ""
			var deepLinkData: [String: Any] = [:]
			deepLinkData["url"] = url
			deepLinkData["isDeferred"] = true
			deepLinkData["deepLinkValue"] = result.getDlv()
			deepLinkData["partnerId"] = result.getPid()
			deepLinkData["pid"] = result.getPid()
			deepLinkData["campaign"] = result.getCamp()
			deepLinkData["camp"] = result.getCamp()
			deepLinkData["campaignId"] = result.getCampId()
			deepLinkData["campId"] = result.getCampId()
			deepLinkData["ad"] = result.getAd()
			deepLinkData["adId"] = result.getAdId()
			deepLinkData["adSet"] = result.getAdSet()
			deepLinkData["adSetId"] = result.getAdSetId()
			deepLinkData["channel"] = result.getChannel()
			deepLinkData["clickId"] = result.getClickId()
			deepLinkData["message"] = result.getMessage()
			deepLinkData["p1"] = result.getP1()
			deepLinkData["p2"] = result.getP2()
			deepLinkData["p3"] = result.getP3()
			deepLinkData["p4"] = result.getP4()
			deepLinkData["p5"] = result.getP5()

			let queryParams = AppTroveExpoSdk.getQueryParams(uri: url)
			deepLinkData["siteId"] = queryParams["sid"]
			deepLinkData["sid"] = queryParams["sid"]
			deepLinkData["subSiteId"] = queryParams["ssid"]
			deepLinkData["ssid"] = queryParams["ssid"]

			var sdkParams: [String: Any] = [:]
			for (key, value) in queryParams {
				sdkParams[key] = value
			}
			if let params = result.getSDKParamsDictionary() {
				for (key, value) in params {
					sdkParams[key] = "\(value)"
				}
			}
			deepLinkData["sdkParams"] = sdkParams

			sendEvent(withName: "apptrove_deferredDeeplink", body: deepLinkData)
		}
	}

	private static func getQueryParams(uri: String) -> [String: String] {
		var map = [String: String]()
		guard let url = URL(string: uri), let components = URLComponents(url: url, resolvingAgainstBaseURL: false), let queryItems = components.queryItems else {
			return map
		}
		for item in queryItems {
			map[item.name] = item.value
		}
		return map
	}
	
	open override func supportedEvents() -> [String] {
		["apptrove_deferredDeeplink"]
	  }

    @objc(initializeSDK:)
	func initializeSDK(_ dict: NSDictionary) -> Void {
		let appToken = dict["appToken"] as! String;
		let environment = dict["environment"] as! String;
		let deeplinking = dict["hasDeferredDeeplinkCallback"] as! Bool?
		let config = AppTroveSDKConfig(appToken: appToken , env: environment)
		config.setSDKType(sdkType: "react_native_sdk")
		config.setAppSecret(secretId: dict["secretId"] as! String, secretKey: dict["secretKey"] as! String)
		config.setSDKVersion(sdkVersion: "2.0.2")
		if (deeplinking != nil) {
			config.setDeeplinkListerner(listener: self)
		}
		if let regionStr = dict["region"] as? String {
			switch regionStr.lowercased() {
			case "in":
					config.setRegion(.IN)
					print("india region has been set")
			case "global":
					config.setRegion(.GLOBAL)
					print("GLobal region has been set")
			default:
					config.setRegion(.NONE)
			}
		}
		AppTroveSDK.initialize(config: config)
	}


	@objc func trackEvent(_ dict: NSDictionary) -> Void {
		let currency: String = dict["currency"] as? String ?? ""
		let revenue: Float64 = (dict["revenue"] as? Float64 ?? 0.0)
		let discount: Float64 = (dict["discount"] as? Float64 ?? 0.0)
		let couponCode: String = dict["couponCode"] as? String ?? ""
		let eventId: String = dict["eventId"] as! String
		let orderId: String = dict["orderId"] as? String ?? ""
		let param1: String = dict["param1"] as? String ?? ""
		let param2: String = dict["param2"] as? String ?? ""
		let param3: String = dict["param3"] as? String ?? ""
		let param4: String = dict["param4"] as? String ?? ""
		let param5: String = dict["param5"] as? String ?? ""
		let param6: String = dict["param6"] as? String ?? ""
		let param7: String = dict["param7"] as? String ?? ""
		let param8: String = dict["param8"] as? String ?? ""
		let param9: String = dict["param9"] as? String ?? ""
		let param10: String = dict["param10"] as? String ?? ""
		var ev:Dictionary<String,Any> = dict["ev"] as? Dictionary<String,Any> ?? [:]

		for (key, value) in ev {
			ev[key] = value
		}

		let event = AppTroveEvent(id: eventId)
		event.setRevenue(revenue: revenue, currency: currency)
		event.orderId = orderId
		event.setCouponCode(couponCode: couponCode)
		event.setDiscount(discount: discount)
		event.param1  = param1
		event.param2  = param2
		event.param3  = param3
		event.param4  = param4
		event.param5  = param5
		event.param6  = param6
		event.param7  = param7
		event.param8  = param8
		event.param9  = param9
		event.param10 = param10
		for (key, value) in ev {
			event.addEventValue(prop: key, val: value)
		}
		AppTroveSDK.trackEvent(event: event)
	}

	@objc func setEnabled(_ value: Bool) {
		AppTroveSDK.setEnabled(value: value)
	}

	@objc func setUserId(_ userId: String) {
		AppTroveSDK.setUserID(userId: userId)
	}

	@objc func setUserEmail(_ userEmail: String) {
		AppTroveSDK.setUserEmail(userEmail: userEmail)
	}

	@objc func setUserName(_ userName: String) {
		AppTroveSDK.setUserName(userName: userName)
	}
	
	@objc func setUserPhone(_ userPhone: String) {
		AppTroveSDK.setUserPhone(userPhone: userPhone)
	}
	
	@objc func waitForATTUserAuthorization(_ timeoutInterval: Int) {
		AppTroveSDK.waitForATTUserAuthorization(timeoutInterval: timeoutInterval)
	}

	@objc func updateAppleAdsToken(_ token: String) {
		AppTroveSDK.updateAppleAdsToken(token: token)
	}

	@objc func updatePostbackConversion(_ conversionValue: Int) {
		AppTroveSDK.updatePostbackConversion(conversionValue: conversionValue)
	}

	@objc func subscribeDeeplink() {
		if #available(iOS 13.0, *) {
			AppTroveSDK.subscribeAttributionlink()
		}
	}
	
	@objc func getAd(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getAd())
	}
	
	@objc func getAdID(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getAdID())
	}

	@objc func getCampaign(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getCampaign())
	}
	
	@objc func getCampaignID(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getCampaignID())
	}
	
	@objc func getAdSet(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getAdSet())
	}
	
	@objc func getChannel(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getChannel())
	}
	
	@objc func getP1(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getP1())
	}
	
	@objc func getP2(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getP2())
	}
	
	@objc func getP3(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getP3())
	}
	
	@objc func getP4(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getP4())
	}
	
	@objc func getP5(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getP5())
	}
	
	@objc func getClickId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getClickId())
	}
	
	@objc func getDlv(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getDlv())
	}
	
	@objc func getPid(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getPid())
	}
	
	@objc func getIsRetargeting(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getIsRetargeting())
	}

	@objc func getAppTroveId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		resolve(AppTroveSDK.getAppTroveId())
	}
	
	@objc func trackAsOrganic(_ value: Bool) {
		// Do nothing, android only method
	}

	@objc func setLocalRefTrack(_ value: Bool, withDelim delimeter: String) {
		// Do nothing, android only method
	}

	@objc func setUserAdditionalDetails(_ userAdditionalMap: NSDictionary) {
		print("JS map received: \(userAdditionalMap)")
		
		var userAdditionalDetails: [String: Any] = [:]
		
		// Convert NSDictionary to Swift Dictionary
		for (key, value) in userAdditionalMap {
			if let keyString = key as? String {
				userAdditionalDetails[keyString] = value
			}
		}
		
		// Optional: clean/map to string values if needed
		var cleanedDetails: [String: String] = [:]
		for (key, value) in userAdditionalDetails {
			cleanedDetails[key] = "\(value)"
		}
		
		print("Passing to SDK: \(cleanedDetails)")
		AppTroveSDK.setUserAdditionalDetails(userAdditionalDetails: cleanedDetails)
	}

	@objc func fireInstall() {
		// Do nothing, android only method
	}

	@objc func parseDeepLink(_ url: String) {
		AppTroveSDK.parseDeepLink(uri: url)
	}

	@objc func sendAPNToken(_ token: String) {
		AppTroveSDK.sendAPNToken(token: token)
	}

	@objc func createDynamicLink(_ config: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
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

		if let androidParams = config["androidParameters"] as? NSDictionary {
			let androidBuilder = AndroidParameters.Builder()
			if let redirectLink = androidParams["redirectLink"] as? String {
				androidBuilder.setRedirectLink(redirectLink)
			}
			builder.setAndroidParameters(androidBuilder.build())
		}

		if let iosParams = config["iosParameters"] as? NSDictionary {
			let iosBuilder = IosParameters.Builder()
			if let redirectLink = iosParams["redirectLink"] as? String {
				iosBuilder.setRedirectLink(redirectLink)
			}
			builder.setIosParameters(iosBuilder.build())
		}

		if let desktopParams = config["desktopParameters"] as? NSDictionary {
			let desktopBuilder = DesktopParameters.Builder()
			if let redirectLink = desktopParams["redirectLink"] as? String {
				desktopBuilder.setRedirectLink(redirectLink)
			}
			builder.setDesktopParameters(desktopBuilder.build())
		}

		if let meta = config["socialMetaTagParameters"] as? NSDictionary {
			let metaBuilder = SocialMetaTagParameters.Builder()
			if let title = meta["title"] as? String {
				metaBuilder.setTitle(title)
			}
			if let description = meta["description"] as? String {
				metaBuilder.setDescription(description)
			}
			if let imageLink = meta["imageLink"] as? String {
				metaBuilder.setImageLink(imageLink)
			}
			builder.setSocialMetaTagParameters(metaBuilder.build())
		}

		if let sdkParams = config["sdkParameters"] as? [String: String] {
			builder.setSDKParameters(sdkParams)
		}

		if let attrParams = config["attributionParameters"] as? NSDictionary {
			let channel = attrParams["channel"] as? String ?? ""
			let campaign = attrParams["campaign"] as? String ?? ""
			let mediaSource = attrParams["mediaSource"] as? String ?? ""
			let p1 = attrParams["p1"] as? String ?? ""
			let p2 = attrParams["p2"] as? String ?? ""
			let p3 = attrParams["p3"] as? String ?? ""
			let p4 = attrParams["p4"] as? String ?? ""
			let p5 = attrParams["p5"] as? String ?? ""
			builder.setAttributionParameters(channel: channel, campaign: campaign, mediaSource: mediaSource, p1: p1, p2: p2, p3: p3, p4: p4, p5: p5)
		}

		let dynamicLink = builder.build()
		if #available(iOS 13.0, *) {
				AppTroveSDK.createDynamicLink(dynamicLink: dynamicLink, onSuccess: { url in
						resolve(url)
				}, onFailure: { error in
						reject("CREATE_DYNAMIC_LINK_FAILED", error, nil)
				})
		} else {
				// Fallback on earlier versions
		}
	}

	@objc func resolveDeeplinkUrl(_ url: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		if #available(iOS 13.0, *) {
				AppTroveSDK.resolveDeeplinkUrl(inputUrl: url) { result in
						switch result {
						case .success(let dlData):
								var resultMap: [String: Any] = [:]
								resultMap["url"] = dlData.url
								
								if let sdkParams = dlData.sdkParams {
										var sdkParamsMap: [String: String] = [:]
										for (key, value) in sdkParams {
												sdkParamsMap[key] = "\(value)"
										}
										resultMap["sdkParams"] = sdkParamsMap
								}
								
								resolve(resultMap)
								
						case .failure(let error):
								reject("RESOLVE_DEEPLINK_FAILED", error.localizedDescription, error)
						}
				}
		} else {
				// Fallback on earlier versions
		}
	}

}

