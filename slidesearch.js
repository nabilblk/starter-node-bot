/**
 * Created by nabil on 27/05/2016.
 */
var request = require('request')

module.exports = function (query, key) {
    return new SlideSearch(query, key);
}

function SlideSearch(query, key) {
    var self = this
    this.query = query
    self.find = function (query, key, fn) {
        var url = '';
        request({url: url, json: true}, function (error, response, data) {
            if (error) {
                return fn(error)
            }
            if (response.statusCode != 200) {
                return fn(new Error('unxpected status ' + response.statusCode))
            }
            fn(null, data)
        })
    }
}