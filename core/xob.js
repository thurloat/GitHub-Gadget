var xob = xob || {};

/**
 * Error Logger shortcut, only outputs to the log if in debug mode.
 *
 * @param {string} value A string to be output to the log.
 */
xob.log = function(value) {
  if (sd.DEBUG) {
    if (typeof value == 'object') {
      gadgets.log(gadgets.json.stringify(value));
    } else {
      gadgets.log(value);
    }
  }
};


/**
 * Viewport tie in to the Xobni opensocial info.
 * @const
 */
xob.Viewport = {};

/**
 * The contextual user (displaying in xobni)
 *
 * @type {Object} Xobni opensocial user object.
 */
xob.Viewport.viewer = null;

/**
 * Viewport Boot Sequence. Loads in necessary xobni opensocial information
 * Loads the xobni user, and the user within the context of the current
 * email.
 * @param {Function} callback The callback function to execute after values
 *   have been set.
 */
xob.Viewport.init = function(callback){
    osapi.people.getOwner().execute(function(person){
        sd.Viewport.viewer = person;
        callback();
    });
};

/**
 * Shortcut function to get a list of the contextual user's email addresses
 * from the xobni opensocial user.
 *
 * @return {Array.string} A list of emails for the user being displayed.
 */
xob.Viewport.viewer_email_list = function() {
    var emails = [];
    for (var ei=0; ei < xob.Viewport.viewer.emails.length; ei++) {
        emails.push(xob.Viewport.viewer.emails[ei]);
    };
    return emails;
};