BxxEvents = new EventTarget();

X3D(function() {
    let browser = X3D.getBrowser();
    let browserProto = Object.getPrototypeOf(browser);
    browser.addBrowserCallback({}, function(eventType) {
        if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
            let prox = browser.currentScene.createNode("ProximitySensor");
            prox.size = new X3D.SFVec3f(1000000, 1000000, 1000000);
            prox.enabled = true;
            browser.currentScene.addRootNode(prox);
            console.log("Set up prox");
            Object.defineProperty(browserProto, 'viewpointPosition', { get: function() {
                console.log("viewpointPosition");
                return prox.position_changed;
            } });
            Object.defineProperty(browserProto, 'viewpointOrientation', { get: function() {
                return prox.orientation_changed;
            } });
            
            browserProto.getTime = browserProto.getCurrentTime;
        }
    });
    
})