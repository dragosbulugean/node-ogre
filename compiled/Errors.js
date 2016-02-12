"use strict";

/**
 * Created by Dragos on 7/9/14.
 */

//Errors Ogre can throw
var InvalidTypeError = function InvalidTypeError() {};
InvalidTypeError.prototype = new Error();
var ConstraintError = function ConstraintError() {};
ConstraintError.prototype = new Error();
var NotInstantiatedError = function NotInstantiatedError() {};
NotInstantiatedError.prototype = new Error();
var NodeNotFoundError = function NodeNotFoundError() {};
NodeNotFoundError.prototype = new Error();

module.exports = {
	InvalidTypeError: InvalidTypeError,
	ConstraintError: ConstraintError,
	NotInstantiatedError: NotInstantiatedError,
	NodeNotFoundError: NodeNotFoundError
};