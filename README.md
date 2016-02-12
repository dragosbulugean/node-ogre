# OGRE - Object Graph Relation Endeavour

A Node.js package allowing easy interaction with the Neo4j's REST API.

Has a thick model architecture, so models know what to do with themselves.
Create, update, delete, retrieve themselves from the datastore.

High level and low level Query API exposed.
Query models and their relations, bringing them together from the datastore.

Persistence is a breeze.
Persist models and their relations in one call.
Persist the relations by saving the main model representation.

Written in Javascript ES6 wih async await API.
All interaction with the OGRE and throughout OGRE is made in the async evented spirit of node.js
but Promises are used rather than callbacks, as they are easier to handle/read.

Read the tutorial to get a general feel of the workflow introduced by OGRE here:
[Tutorial](https://github.com/Kalon/node-ogre/blob/master/tutorial.md)
