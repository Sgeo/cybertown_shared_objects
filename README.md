# Cybertown Revival
Cybertown Revival is a community-driven project by former users of Cybertown. The purpose is to put together a online, fully-working version of the Cybertown VRML community.

## What was/is Cybertown?

Taken from the [Cybertown Wikipedia Page](https://en.wikipedia.org/wiki/CyberTown):

> Cybertown (CT) (formerly Colony City) was a free (changed to pay per year in 2002), family friendly, online community. There were places (chat rooms) available either through a 2D or 3D chat environment. Users were able to have jobs within the community, earning virtual money called CC's (CityCash) that could be used to buy 3D homes and items. Each user was allowed a free 2D home and could locate it within any of a number of colonies subdivided into neighborhoods and blocks. 

## How to join the revival community?

You can join in with others interested in this project:
* [Discord](https://discord.gg/s5Hetxf)
* [Reddit](https://www.reddit.com/r/Cybertown/)

## How to run this project

For developers, you will need node to run this project. The main server file is `server.js`. One you have cloned the repository, run `npm install` to install all the dependences, then run `node server.js`. 

This will start the node server which will allow you to access a localised version of the project.

## Basic Notes on Project Directory Structure

Although this isn't all encompassing, here is a basic description of some of the important directories of the project. This is likely to change in the future.

* `public` - static content of the website. 
* `ctwgl` - just a dumping ground for the files from an older project
* `server.js` - the main server. 
* `PACKETS.md` - additional documentation (WIP)
* `000-00a`, `enter`, `gameshow`, `places`, `sounds`, `textures` - assets used for the worlds
* `xite_js` - Code that interacts with X_ITE to provide some functionality similar to Cybertown.
* `x_ite_mods` - Code that modifies X_ITE to make it act more like Blaxxun
* `data` - JSON files describing worlds and available avatars



