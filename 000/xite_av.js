(function() {
    
    X3D(function() {
        let browser = X3D.getBrowser();
        browser.addBrowserCallback({}, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let avInline = browser.currentScene.createNode("Inline");
                avInline.url = new X3D.MFString("/avatars/wizards/wizardfem.wrl");
                browser.currentScene.addRootNode(avInline);
            }
        });
    });
})();