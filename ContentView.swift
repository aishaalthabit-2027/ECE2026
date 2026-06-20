import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebView()
            .environment(\.layoutDirection, .rightToLeft)
            .edgesIgnoringSafeArea(.all)
    }
}

struct WebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let preferences = WKPreferences()
        preferences.javaScriptEnabled = true
        
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        
        // Important: Set semantic content attribute for RTL
        if #available(iOS 10.0, *) {
            webView.semanticContentAttribute = .forceRightToLeft
        }
        
        // Load local HTML file
        if let htmlPath = Bundle.main.path(forResource: "\u{0646}\u{0638}\u{0627}\u{0645} \u{062a}\u{0631}\u{0627}\u{0648}\u{0636} \u{0627}\u{0644}\u{062a}\u{0631}\u{064a}\u{0636} \u{0627}\u{0644}\u{0645}\u{0628}\u{0643}\u{0631", ofType: "dc.html") {
            let url = URL(fileURLWithPath: htmlPath)
            let request = URLRequest(url: url)
            webView.load(request)
        }
        
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // Update if needed
    }
}
