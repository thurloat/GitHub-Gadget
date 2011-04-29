/**
 * Re-declare the xob namespace
 */
var xob = xob || {};

xob.Gadget = {};

/**
 * Gadget boot sequence function. This should be called after
 * the {xob.Viewport} is initialized.
 */
xob.Gadget.init = function(){
    
    // Fire a resize event because of the window's adjustable size.
    xob.Gadget.resize_window_();
    
    // Bind the resize event incase the user resizes the gadget window.
    xob.Gadget.bind_height_handler();
    
    xob.Gadget.client = new xob.GitHub();
    
    xob.Gadget.select_user();
};

xob.Gadget.select_user = function(users){
    
    var panel = $('#select_user');
    panel.empty();
    
    if (users !== undefined){
        // There was a search result returned from the client.
        var user_list = $('<ul/>');
        
        if (users.length > 0){
            for (var u_i=0; u_i < users.length; u_i++) {
                var user = users[u_i],
                    user_list_item = $('<li/>', {
                        text: user.full_name + ' ( ' + user.username + ' )' 
                    });
                
                user_list_item.appendTo(user_list);
            };    
        } else {
            $('<li/>', {text: 'No Results. Try Again'}).appendTo(user_list);
        }
        
        user_list.appendTo(panel);
    }
    
    // Search Box
    $('<p/>', {
        text: 'Search by username'
    }).appendTo(panel);
    
    // Construct the search form using jQuery
    var search_panel = $('<div/>', {id: 'search_panel'}),
        search_box = $('<input/>', {
            type: 'text',
            id: 'user_search'}),
        submit_button = $('<input/>', {
            type: 'submit',
            value: 'Go!',
            id: 'search_button_submit'
        }).click(xob.Gadget.search_handler);
        
    // Insert the Search form into the dom
    search_box.appendTo(search_panel);
    submit_button.appendTo(search_panel);
    search_panel.appendTo(panel);
    
    // make the user view visible
    xob.Gadget.show_view('select_user');
};

/**
 * Search submission handler.
 */
xob.Gadget.search_handler = function(evt){
    // fire away the user search.
    var username = $('#user_search').val();
    
    // Make the call into out GitHub client to execute the search.
    xob.Gadget.client.user_search(username, xob.Gadget.select_user);
};


/**
 * A List of the gadget's static views. These are tied
 * to div #IDs in the main gadget.xml file.
 */
xob.Gadget.views = ['loading', 'details', 'select_user'];

/**
 * A shortcut to discover the currently displaying view.
 */
xob.Gadget.view_showing = null;

/**
 * Switch to one of the standard views. This will hide all other
 * views from the gadget.
 *
 * @param {string} view_name The {xob.Gadget.views} value that you want to show.
 */
xob.Gadget.show_view = function(view_name) {
  for (var i = xob.Gadget.views.length - 1; i >= 0; i--) {
    if (view_name == xob.Gadget.views[i]) {
      xob.Gadget.view_showing = view_name;
      $('#' + view_name).show();
    } else {
      $('#' + xob.Gadget.views[i]).hide();
    }
  }
};


/**
 * Gadget resize handler binding function.
 */
xob.Gadget.bind_height_handler = function() {
  $(window).unbind('resize');
  $(window).resize(function() {
    xob.Gadget.resize_window_();
  });
};

/**
 * Gadget height resize handler.
 *
 * @private
 */
xob.Gadget.resize_window_ = function() {
  var h = $(window).height() - 4;
  $('#container').css('height', h);
};