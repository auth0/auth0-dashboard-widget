//wt cron schedule -n mycron "*/30 * * * *" dashboard_cron.js -p "wptest-default" \
//  --secret mongo_connection_string=mongodb://webtasks:123456@ds051873.mongolab.com:51873/dashboard \
//  --secret domain=wptest.auth0.com \
//  --secret app_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqY05ZOHd4YVoxWnVRYjhldlJJSGgzYkt3V0dWdEdqZyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NDMxOTc5NzQsImp0aSI6IjMyNjdkYWM5MTA0NDBlNDFmZTg0NmM0ODk2OTBmYzg1In0.Y44xa8VFfWZK68Nr8fBR_lWJ8CAuT00uST5JPJpPU0o \
//  --output url --profile {WEBTASK PROFILE} mfa-passwordless.js

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var _ = require('lodash');
var moment = require('moment');

module.exports = function (cb, context) {

  var conf = {
    mongo_connection_string : context.data.client_secret,
    domain : context.data.domain,
    app_token : context.data.app_token,
    page_size : context.data.page_size || 100,
    search_engine : context.data.search_engine || 'v2'
  };

  MongoClient.connect(conf.mongo_connection_string, function(err, db) {
    assert.equal(null, err);

    conf.db = db;

    updateUsersData(cb, conf);
  });
}

function updateUsersData(cb, conf) {
  conf.db.collection('settings').findOne( { setting: 'last_sync' }, function(err, doc) {
    load_data(cb, conf.db, 0, '', true, (doc && doc.value) || null);
  });
}

function load_data(cb, conf, page, filter, first, last_sync) {

  if (typeof(page) === 'undefined') page = 0;
  if (typeof(first) === 'undefined') first = false;

  filter = filter || '';
  if (last_sync !== null) {
    var from_date = last_sync.toISOString();
    filter = "last_login:[" + from_date + " TO *]";
  }

  console.log("DATA INITIALIZE: Loading page " + page);
  console.log("\t Filter: ", filter);

  get_users(conf, filter, page, conf.page_size).then(function(content) {

    if (content && content.length > 0) {
      
      console.log("\t PROCESING: "+content.length+" users");
      content.forEach(function(user) {
        conf.db.collection('users').update({ user_id: user.user_id }, mapper( user ), {upsert:true});
      })
      console.log("\t DONE");

      if (content.length === conf.page_size) {
        load_data(conf, page+1, filter, first);
      } else {
        update_last_sync(conf, cb);
      }

    }
    else {
      console.log("\t NO UPDATES");
      conf.db.close();
      cb(null, 'DONE');
    }

  }).catch(function(e){
    console.log('error', e);
  });

}

function update_last_sync(conf,cb) {
  conf.db.collection('settings').update({ setting: 'last_sync' }, { setting: 'last_sync', value: (new Date()) }, {upsert:true}, function() {
    conf.db.close();
    console.log('closed');
    cb(null, 'DONE');
  });
}

function get_users(conf, q, page, per_page) {

  return request({
    url:"https://"+conf.domain+"/api/v2/users",
    headers: {
      "Authorization": "Bearer " + conf.app_token
    },
    qs: {
      search_engine:conf.search_engine,
      q:q,
      page:page,
      per_page:per_page
    }
  }).then(function(response) {
    return JSON.parse(response[1]);
  });

}




// ------------------------------------------------------------------- MAPPERS

var mappers = [
  user_id_mapper(),
  gender_mapper(),
  age_mapper(),
  created_at_mapper(),
  idp_mapper(),
  location_mapper(),
  zipcode_mapper(),
  income_mapper()
];

function mapper(user) {
  var mapped_user = {};
  user.user_metadata = user.user_metadata || {};
  user.app_metadata = user.app_metadata || {};

  mappers.forEach(function(c) {
    mapped_user = c(mapped_user, user);
  })

  return mapped_user;
}

function zipcode_mapper() {

  return function (mapped_user, user) {

    var geoip = user.user_metadata.geoip || user.app_metadata.geoip;

    mapped_user.zipcode = (geoip && geoip.postal_code) || null;

    return mapped_user;
  }
}
function user_id_mapper() {

  return function (mapped_user, user) {

    mapped_user.user_id = user.user_id;

    return mapped_user;
  }
}
function location_mapper() {

  return  function (mapped_user, user) {

    var geoip = user.user_metadata.geoip || user.app_metadata.geoip;
    var location = null;

    if (geoip && geoip.latitude && geoip.longitude) {
      location = {
        latitude: geoip.latitude,
        longitude: geoip.longitude
      }; 
    }

    mapped_user.location = location;

    return mapped_user;
  }
}
function income_mapper() {

  return function (mapped_user, user) {

    var income = user.user_metadata.zipcode_income || user.app_metadata.zipcode_income || null;

    mapped_user.income = income;

    return mapped_user;
  }
}
function idp_mapper() {

  return function (mapped_user, user) {

    mapped_user.idp = user.identities.map(function(identity) {
      return identity.provider;
    });

    return mapped_user;
  }
}
function gender_mapper() {

    return function (mapped_user, user) {
      mapped_user.gender = getGender(user);
      return mapped_user;
    }
}

function getGender(user) {
    if (user.gender) {
        return user.gender.toLowerCase();
    }

    var fullContactInfo = user.user_metadata.fullContactInfo || user.app_metadata.fullContactInfo;

    if (fullContactInfo && fullContactInfo.demographics && fullContactInfo.demographics.gender) {
      return fullContactInfo.demographics.gender.toLowerCase();
    }

    return null;
}
function created_at_mapper() {
  return function (mapped_user, user) {
    mapped_user.created_at = user.created_at;
    return mapped_user;
  }
}
function age_mapper() {
    var buckets = buildAgeBuckets(20, 70, 5);

    return function (mapped_user, user) {

        mapped_user.age = getAge(user);

        if (mapped_user.age === null) {
            mapped_user.agebucket = null;
        } else {

            buckets.forEach(function(bucket){

                if (mapped_user.age >= bucket.from && mapped_user.age <= bucket.to) {
                    mapped_user.agebucket = bucket.name;
                }

            });
        }

        return mapped_user;
    };
}

function buildAgeBuckets(from, to, step) {
    buckets = [];

    buckets.push({
        from:0,
        to:from-1,
        name: '< ' + (from - 1)
    });

    for (a = from; a < to; a += step) {
        buckets.push({
            from:a,
            to: a + step - 1,
            name: step === 1 ? a : ( a + '-' + (a + step - 1))
        });
    }

    buckets.push({
        from:to,
        to:200,
        name: '> ' + to
    });

    return buckets;
}

function getAge(user) {
    if (user.age) {
        return user.age;
    }

    var fullContactInfo = user.user_metadata.fullContactInfo || user.app_metadata.fullContactInfo;

    if (fullContactInfo && fullContactInfo.age) {
        return fullContactInfo.age;
    }
    if (fullContactInfo && fullContactInfo.demographics && fullContactInfo.demographics.age) {
        return fullContactInfo.demographics.age;
    }
    if (fullContactInfo && fullContactInfo.demographics && fullContactInfo.demographics.birthDate) {
        return moment().diff(fullContactInfo.demographics.birthDate, 'years');
    }

    if (user.dateOfBirth) {
        return moment().diff(user.dateOfBirth, 'years');
    }

    if (user.birthday) {
        return moment().diff(user.birthday, 'years');
    }

    return null;
}