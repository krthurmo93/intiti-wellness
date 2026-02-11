import UIKit
import WebKit
import Capacitor

class MirrorWorkViewController: CAPBridgeViewController {

    override func webViewConfiguration(for config: InstanceConfiguration) -> WKWebViewConfiguration {
        let webConfig = super.webViewConfiguration(for: config)
        webConfig.allowsInlineMediaPlayback = true
        webConfig.mediaTypesRequiringUserActionForPlayback = []
        if #available(iOS 15.0, *) {
            webConfig.allowsAirPlayForMediaPlayback = true
        }
        return webConfig
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.uiDelegate = self
    }

    @available(iOS 15.0, *)
    func webView(_ webView: WKWebView,
                 requestMediaCapturePermissionFor origin: WKSecurityOrigin,
                 initiatedByFrame frame: WKFrameInfo,
                 type: WKMediaCaptureType,
                 decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(.grant)
    }
}
