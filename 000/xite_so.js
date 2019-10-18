X3D(function() {
    let browser = X3D.getBrowser();
    browser.addBrowserCallback(null, async function(eventType) {
        console.log(eventType);
        if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
            let exp = browser.createVrmlFromString("Transform { translation 0 1.75 0 children[Inline { url \"/dbobjects/5000/5000exp.wrl\" }] }")[0];
            browser.currentScene.addRootNode(exp);
        }
    });
});