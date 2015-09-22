angular.module('cmyy.services', [])

.factory('account', ['$q', account]);

function account($q) {
    var _db;
    var _account;

    function onDatabaseChange(change) {  
        var index = findIndex(_account, change.id);
        var account = _account[index];

        if (change.deleted) {
            if (account) {
                _account.splice(index, 1); // delete
            }
        } else {
            if (account && account._id === change.id) {
                _account[index] = change.doc; // update
            } else {
                _account.splice(index, 0, change.doc) // insert
            }
        }
    }

    // Binary search, the array is by default sorted by _id.
    function findIndex(array, id) {  
        var low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

    return {
        initDB: function() {
            _db = new PouchDB('cmyy');
            console.log('create db:---------');
            console.log(_db);
        },
        getAllItems: function() {
            if (!_account) {
                return $q.when(_db.allDocs({include_docs: true})).then(function(docs){
                    _account = docs.rows.map(function(row){
                        row.doc.date = new Date(row.doc.date);
                        return row.doc;
                    });
                    console.log('get all items~~~~');

                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true}).on('change', onDatabaseChange);

                    return _account;
                });
            } else {
                return $q.when(_account);
            }
        },
        addItem: function(item) {
            return $q.when(_db.post(item));
        },
        updateItem: function(item) {
            return $q.when(_db.put(item));
        },
        deleteItem: function(item) {
            return $q.when(_db.remove(item));
        }
    };
}
