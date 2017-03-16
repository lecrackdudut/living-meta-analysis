// these are tests that support the home page
(function (window, document) { // eslint-disable-line no-unused-vars

  var lima = window.lima;
  var _ = lima._;

  function test200(assert, url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // false for synchronous requests
    xhr.send();

    assert(xhr.status === 200, "cannot load " + url);
  }

  _.addTest(function testHomepageLinks(assert) {
    test200(assert, "/api/metaanalyses/tomas.rubin@port.ac.uk/MisinformationEffect/");
    test200(assert, "/api/metaanalyses/tomas.rubin@port.ac.uk/MyMeta-analysis/");
  });

})(window, document);
