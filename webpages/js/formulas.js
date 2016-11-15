(function (window, document) {
  'use strict';

  var lima = window.lima;
  var _ = lima._;

  lima.listFormulas = function listFormulas() {
    // at some point, the api might want to host a list of formulas with their definitions
    return [
      {
        id: 'logOddsRatio',
        label: 'Log Odds Ratio',
        func: logOddsRatio,
        parameters: [ 'experimental', 'control' ]
      },
      {
        id: 'logOddsRatioPercent',
        label: 'Log Odds Ratio (percentages)',
        func: logOddsRatioPercent,
        parameters: [ 'experimental (%)', 'control (%)' ]
      },
    ];
  }

  function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  };

  lima.getFormulaById = function getFormulaById(id) {
    var formulas = lima.listFormulas();
    for (var i=0; i<formulas.length; i++) {
      if (formulas[i].id === id) return formulas[i];
    }
    return null;
  }

  // here start the functions implementing the formulas

  function logOddsRatio (experimental, control) {
    // validate the input
    if (!isNumber(experimental) || !isNumber(control)) return null;

    // perform the calculation
    try {
      return Math.log((control/(1-control))/(experimental/(1-experimental)));
    }
    catch (err) {
      return null;
    }
  }

  function logOddsRatioPercent (experimental, control) {
    return lima.formulas.logOddsRatio(experimental/100, control/100);
  }
})(window, document);
