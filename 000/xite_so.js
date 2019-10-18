X3D(function() {
    let browser = X3D.getBrowser();
    browser.addBrowserCallback(null, async function(eventType) {
        console.log(eventType);
        if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
            //let exp = browser.createVrmlFromString("Transform { translation 0 1.75 0 children[Inline { url \"/dbobjects/5000/5000exp.wrl\" }] }")[0];
            let so = browser.currentScene.createProto("SharedObject")
            so.translation = new X3D.SFVec3f(0, 1.75, 0);
            let inline = browser.currentScene.createNode("Inline")
            inline.url = new X3D.MFString("/dbobjects/5000/5000exp.wrl");
            so.children[0] = inline;
            browser.currentScene.addRootNode(so);
        }
    });
});