Utility = {
    uniqArray: function(array) {
        var result = Array.from(new Set(array));
        return result
    }
}

module.exports = Utility