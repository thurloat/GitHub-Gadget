/**
 * Our GitHub Client!
 */
xob.GitHub = function() {
    
    // Initialize the API
    this.api = new xob.GitHubAPI('http://github.com/api/v2/json');
    
    // Pre-populate the Xobni Profile with the associated GitHub username if one exists.
    this.github_username = xob.Prefs.get('github_' + xob.Viewport.viewer.id);
};

/**
 * Search GitHub for the username provided.
 */
xob.GitHub.prototype.user_search = function(username, callback){
    
    // Render the API call with the username
    var api_call = xob.GitHubAPI.render_api(
        xob.GitHubAPI.search,
        username);
    
    // Ship it off to the GitHubAPI request dispatcher
    this.api.request(api_call, function(response){
        
        var users = [];

        for (var us_i=0; us_i < response.data.users.length; us_i++) {

            var search_user = response.data.users[us_i];            
            users.push(new xob.GitHub.User(search_user));
        };
        
        callback(users);
    });
};

/**
 * Save a github username to remeber for the next gadget load.
 */
xob.GitHub.prototype.save_user = function(user, callback){
    this.github_username = user.username;
    xob.Prefs.set('github_' + xob.Viewport.viewer.id, user.username);
    
    return callback(user)
};


/**
 * Call to load a single user's full profile information from GitHub
 */
xob.GitHub.prototype.load_profile = function(username, callback){
    
    var api_call = xob.GitHubAPI.render_api(
        xob.GitHubAPI.show_user,
        username);
    
    this.api.request(api_call, function(response){
        callback(new xob.GitHub.User(response.data.user));
    });
};

/**
 * Load a list of Repo objects for the GitHub username provided.
 */
xob.GitHub.prototype.load_repos = function(username, callback){
    var api_call = xob.GitHubAPI.render_api(
        xob.GitHubAPI.repo_list,
        username);
    
    this.api.request(api_call, function(response){
        
        var repos = [];
        
        for (var i = response.data.repositories.length - 1; i >= 0; i--){
            var repo = response.data.repositories[i];
            repos.push(new xob.GitHub.Repo(repo));
        };
        
        callback(repos);
    });
}

/**
 * Standard GitHub User object mapping so we can attach functionality to the
 * JSON Data returned from the API.
 */
xob.GitHub.User = function(json_data){
    this.gravatar_id = json_data.gravatar_id;
    this.company = json_data.company;
    this.full_name = json_data['name'];
    this.username = json_data.login;
    this.email = json_data.email;
    this.loc = json_data['location'];
    this.date_signed_up = json_data.created_at;
};

/**
 * Quick shortcut to render the User's gravatar picture url.
 */
xob.GitHub.User.prototype.get_picture = function(){
    return 'http://gravatar.com/avatar/' + this.gravatar_id + '?s=64';
};

/**
 * A GitHub Repo object wrapper.
 */
xob.GitHub.Repo = function(json_data){
    this.repo_name = json_data['name'];
    this.desc = json_data['description'];
    this.main_language = json_data['language'];
    this.url = json_data.url;
    this.stats = {
        watchers: json_data.watchers,
        forks: json_data.forks
    };
};

/**
 * The GitHub API Low Level methods
 */
xob.GitHubAPI = function(endpoint_url) {
    this.base_url = endpoint_url;
};

xob.GitHubAPI.search = '/user/search/{{ username }}';

xob.GitHubAPI.show_user = '/user/show/{{ username }}';

xob.GitHubAPI.repo_list = '/repos/show/{{ username }}';

/**
 * API Rendering function.
 */
xob.GitHubAPI.render_api = function(api_base, value){
    return api_base.replace('{{ username }}', value);
};

/**
 * core request handler wraps the gadgets.io.makeRequest function with some
 * sane defaults.
 */
xob.GitHubAPI.prototype.request = function(api_call, callback){
    var final_url = this.base_url + api_call,
        request_params = {};
    
    request_params[gadgets.io.RequestParameters.METHOD] = 'GET';
    request_params[gadgets.io.RequestParameters.CONTENT_TYPE] = 
        gadgets.io.ContentType.JSON;
    
    gadgets.io.makeRequest(final_url, function(response){
        callback(response);
    }, request_params);
};