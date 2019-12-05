# Packets

## JOIN

Sent client->server on connection and reconnection. After client sees server ack, client sends an initial AV packet.

### Contents

* avatar
  * ID of the avatar in /data/avatars.json to use
* room
  * Name of the room to join.
  
## AV:new

Avatar creation packet. Sent only server->client.

Client is expected to handle and cache AV packets that don't yet have a corresponding AV:new

When a new user joins:

* Send AV:new packets to existing users. (Client will follow up with an AV packet afterwards)
* Send AV:new and AV packets to new user corresponding to all the existing users

### Contents

* id
  * Unique identifier of the user. Socket ID (unless insecure to reveal?)
* avatar
  * ID of the avatar in /data/avatars.json to use. Not checked server-side, client should replace with "default" if invalid.

## AV

Avatar update packet. Sent client->server and server->client.

### Contents

* id (server->client only)
  * Unique identifier of the user.
* pos
  * Array of 3 floats: x, y, z.
* rot
  * Array of 4 floats: x, y, z, angle.

## SE

Shared event packet. Sent client->server and server->client.

* name
  * name of the event
* type
  * VRML type of the event. One of:
    * bool
    * color
    * float
    * int32
    * rotation
    * string
    * time
    * vec2f
    * vec3f
* value
  * JSONized value of event


