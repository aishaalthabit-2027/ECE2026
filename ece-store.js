/* ECE Store — simulated backend + cloud storage
   - "Database": browser localStorage (key ece_db_v3)
   - "Session": localStorage (key ece_session_v3)
   - "Cloud storage": IndexedDB (db ece_cloud / store files) holding real uploaded Blobs
   NOTE: single-browser only — data does not sync between users/devices. */
(function () {
  var DB_KEY = 'ece_db_v5';
  var SESSION_KEY = 'ece_session_v5';
  var IDB_NAME = 'ece_cloud';
  var IDB_STORE = 'files';

  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- IndexedDB (cloud storage) ---------- */
  function openIDB() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      };
      r.onsuccess = function (e) { res(e.target.result); };
      r.onerror = function (e) { rej(e.target.error); };
    });
  }
  function idbPut(rec) {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(rec);
        tx.oncomplete = function () { res(); };
        tx.onerror = function (e) { rej(e.target.error); };
      });
    });
  }
  function idbAll() {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var rq = tx.objectStore(IDB_STORE).getAll();
        rq.onsuccess = function () { res(rq.result || []); };
        rq.onerror = function (e) { rej(e.target.error); };
      });
    });
  }
  function idbGet(id) {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var rq = tx.objectStore(IDB_STORE).get(id);
        rq.onsuccess = function () { res(rq.result || null); };
        rq.onerror = function (e) { rej(e.target.error); };
      });
    });
  }
  function idbDel(id) {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(id);
        tx.oncomplete = function () { res(); };
        tx.onerror = function (e) { rej(e.target.error); };
      });
    });
  }

  var Store = {
    /* ---------- database ---------- */
    init: function (seed) {
      var db = null;
      try { db = JSON.parse(localStorage.getItem(DB_KEY)); } catch (e) {}
      if (!db || !db.institutions) {
        db = deepCopy(seed);
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }
      return db;
    },
    load: function () {
      try { return JSON.parse(localStorage.getItem(DB_KEY)); } catch (e) { return null; }
    },
    save: function (db) {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    },
    reset: function () {
      localStorage.removeItem(DB_KEY);
      localStorage.removeItem(SESSION_KEY);
      return openIDB().then(function (db) {
        return new Promise(function (res) {
          var tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).clear();
          tx.oncomplete = function () { res(); };
          tx.onerror = function () { res(); };
        });
      }).catch(function () {});
    },

    /* ---------- session ---------- */
    getSession: function () {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
    },
    setSession: function (u) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); },
    clearSession: function () { localStorage.removeItem(SESSION_KEY); },

    /* ---------- cloud storage (files) ---------- */
    listFiles: function (instId) {
      return idbAll().then(function (all) {
        return all.filter(function (f) { return f.instId === instId; })
          .sort(function (a, b) { return b.at - a.at; })
          .map(function (f) { return { id: f.id, instId: f.instId, name: f.name, type: f.type, size: f.size, tag: f.tag, at: f.at }; });
      });
    },
    countFiles: function () { return idbAll().then(function (all) { return all.length; }); },
    addFile: function (meta, blob) { return idbPut(Object.assign({}, meta, { blob: blob })); },
    getFile: function (id) { return idbGet(id); },
    delFile: function (id) { return idbDel(id); }
  };

  window.ECEStore = Store;
})();
