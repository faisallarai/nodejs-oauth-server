exports.parse = function(json) {
    if ('string' == typeof json) {
      json = JSON.parse(json);
    }
  
    var profile = {};
    profile.id = String(json.id);
    profile.displayName = json.name;
    profile.username = json.username;
    profile.email = json.email;
  
    return profile;
  };