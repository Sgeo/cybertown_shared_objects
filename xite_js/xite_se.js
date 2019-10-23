// Reflect shared events for demonstration purposes
// SE:toServer triggered when VRML wants to send events to the server
// SE:fromServer should be triggered on incoming events

BxxEvents.addEventListener("SE:toServer", function(e) {
    console.log("Event:", e.detail);
    BxxEvents.dispatchEvent(new CustomEvent("SE:fromServer", {detail: e.detail}));
});

(function() {
    const TYPES = {
        "bool": {
            toJSON: e => e,
            fromJSON: e => e
        },
        "color": {
            toJSON: color => ({r: color.r, g: color.g, b: color.b}),
            fromJSON: color => new X3D.SFColor(color.r, color.g, color.b)
        },
        "float": {
            toJSON: e => e,
            fromJSON: e => e
        },
        "int32": {
            toJSON: e => e,
            fromJSON: e => e
        },
        "rotation": {
            toJSON: rotation => ({x: rotation.x, y: rotation.y, z: rotation.z, angle: rotation.angle}),
            fromJSON: rotation => new X3D.SFRotation(rotation.x, rotation.y, rotation.z, rotation.angle)
        },
        "string": {
            toJSON: e => e,
            fromJSON: e => e
        },
        "time": {
            toJSON: e => e,
            fromJSON: e => e
        },
        "vec2f": {
            toJSON: vec2f => ({x: vec2f.x, y: vec2f.y}),
            fromJSON: vec2f => new X3D.SFVec2f(vec2f.x, vec2f.y)
        },
        "vec3f": {
            toJSON: vec3f => ({x: vec3f.x, y: vec3f.y, z: vec3f.z}),
            fromJSON: vec3f => new X3D.SFVec2f(vec3f.x, vec3f.y, vec3f.z)
        }
    };
    
    X3D(function() {
        X3D.getBrowser().addBrowserCallback({}, function(eventType) {
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                let sharedZone;
                try {
                    sharedZone = X3D.getBrowser().currentScene.getNamedNode("SharedZone");
                } catch(e) {
                    console.log("No SharedZone detected!");
                    return;
                }
                for(let i = 0; i < sharedZone.events.length; i++) {
                    let eventNode = sharedZone.events[i];
                    for(let typeName of Object.keys(TYPES)) {
                        eventNode.addFieldCallback(typeName + "ToServer", {}, function(val) {
                            let eventObj = {name: eventNode.name, type: typeName, value: TYPES[typeName].toJSON(val)};
                            BxxEvents.dispatchEvent(new CustomEvent("SE:toServer", {detail: eventObj}));
                        });
                    }
                }
            }
        });
    });
})();