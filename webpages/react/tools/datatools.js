/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
export function populateCircularMa(ma) {
  // circular ref of ma in each paper
  for (const paper of ma.papers) {
    paper.metaanalysis = ma;
    let i = 0;
    // circular ref of parent paper in each experiment
    for (const exp of paper.experiments) {
      exp.index = i;
      exp.paper = paper;
      i += 1;
    }
  }

  // excluded = true in each excluded experiment
  const hashPapers = generateIDHash(ma.papers);
  for (const excludedExp of ma.excludedExperiments) {
    const [paperId, expIndex] = excludedExp.split(',');
    if (hashPapers[paperId].experiments[expIndex] !== undefined) {
      hashPapers[paperId].experiments[expIndex].excluded = true;
    }
  }
  ma.hashcols = generateIDHash(ma.columns);

  ma.groups = getGroups(ma);
  // if (ma.groupingColumns !== undefined) {
  //   for (const groupingCol of ma.groupingColumns) {
  //   }
  // }

  for (let col of ma.columns) {
    if (!col.id) {
      const colWithParsedFormula = populateParsedFormula(col, ma, ma.hashcols);
      col = Object.assign(col, colWithParsedFormula);
    }
  }

  for (let aggr of ma.aggregates) {
    const aggrWithParsedFormula = populateParsedFormula(aggr, ma, ma.hashcols);
    aggr = Object.assign(aggr, aggrWithParsedFormula);
  }

  for (let aggr of ma.groupingAggregates) {
    const aggrWithParsedFormula = populateParsedFormula(aggr, ma, ma.hashcols);
    aggr = Object.assign(aggr, aggrWithParsedFormula);
  }

  for (let graph of ma.graphs) {
    const aggrWithParsedFormula = populateParsedFormula(graph, ma, ma.hashcols);
    graph = Object.assign(graph, aggrWithParsedFormula);
  }
}


// DATATABLE FUNCTIONS
function generateIDHash(objects) {
  const retval = {};
  objects.forEach((obj) => {
    if (obj.id) retval[obj.id] = obj;
  });
  return retval;
}

export function formatNumber(x) {
  if (typeof x !== 'number') return x;
  const xabs = Math.abs(x);
  // if (xabs >= 1000) return x.toFixed(0);
  // this would drop the decimal point from large values (needs tweaks in padNumber below)
  if (xabs >= 100) return x.toFixed(1);
  if (xabs >= 10) return x.toFixed(2);
  // if (xabs >= 1) return x.toFixed(2);
  return x.toFixed(3);
}

function populateParsedFormula(col, ma, hashcols) {
  const formula = window.lima.parseFormulaString(col.formula, hashcols);
  formula.metaanalysis = ma;
  return formula;
}

export function isColCompletelyDefined(col) {
  if (col == null) return false;
  if (col.id) return true;
  if (!col.formulaObj) return false;
  for (let i = 0; i < col.formulaParams.length; i += 1) {
    if (!isColCompletelyDefined(col.formulaParams[i])) {
      return false;
    }
  }
  return true;
}

function isExperimentsTableColumn(col) {
  return col.id || (col.formulaObj && col.formulaObj.type === window.lima.FORMULA_TYPE);
}

function isAggregate(col) {
  return col.formulaObj && col.formulaObj.type === window.lima.AGGREGATE_TYPE;
}

function getExperimentsTableDatumValue(col, experiment) {
  let val = null;
  if (col.id) {
    const mappedColumnId = col.sourceColumnMap[experiment.paper.id];
    // not a computed column
    if (experiment
        && experiment.data
        && experiment.data[mappedColumnId]
        && experiment.data[mappedColumnId].value != null) {
      val = experiment.data[mappedColumnId].value;
    }
  } else {
    // computed column
    const inputs = [];

    if (isColCompletelyDefined(col)) {
      const formula = col.formulaObj;
      if (formula == null) return NaN;
      // compute the value
      // if anything here throws an exception, value cannot be computed
      for (const param of col.formulaParams) {
        inputs.push(getDatumValue(param, experiment));
      }
      val = formula.func.apply(null, inputs);
    }
    // if the result is NaN but some of the inputs were empty, change the result to empty.
    if (typeof val === 'number' && isNaN(val)) {
      if (inputs.some((x) => x == null || x === '')) val = null;
    }
  }

  return val;
}

export function getDatumValue(col, experiment) {
  const { papers } = experiment.paper.metaanalysis;
  if (isExperimentsTableColumn(col)) {
    return getExperimentsTableDatumValue(col, experiment);
  } if (isAggregate(col)) {
    if (col.grouping) {
      const group = getGroup(experiment);
      if (group == null) {
        // no need to run the grouping aggregate if we don't have a group
        console.warn('trying to compute a grouping aggregate without a group');
        return NaN;
      }
      return getAggregateDatumValue(col, papers, group);
    }
    return getAggregateDatumValue(col, papers);
  }
}

export function getAggregateDatumValue(aggregate, papers, group) {
  const ma = papers[0].metaanalysis; // TODO: bug when
  // console.log(papers);
  if (!aggregate.grouping) group = null;

  // return NaN if we have a group but don't have a grouping column
  if (group != null && ma.groupingColumnObj == null) {
    console.warn('trying to compute a grouping aggregate without a grouping column');
    return NaN;
  }

  const inputs = [];
  let val;
  if (isColCompletelyDefined(aggregate)) {
    const formula = aggregate.formulaObj;
    if (formula == null) return NaN;

    // compute the value
    // if anything here throws an exception, value cannot be computed
    for (const param of aggregate.formulaParams) {
      let currentInput;
      if (isExperimentsTableColumn(param)) {
        currentInput = [];
        for (const paper of papers) {
          for (const exp of paper.experiments) {
            // ignore excluded values
            if (exp.excluded) continue;

            // ignore values with the wrong groups
            if (group != null && getGroup(exp) !== group) continue;

            currentInput.push(getDatumValue(param, exp));
          }
        }
      } else if (isAggregate(param)) {
        if (!param.grouping) {
          currentInput = getAggregateDatumValue(param, papers, undefined);
        } else if (param.grouping && group != null) {
          currentInput = getAggregateDatumValue(param, papers, group);
        } else if (param.grouping && group == null) {
          // currentParam is grouping but we don't have a group
          // so currentInput should be an array per group
          const groups = getGroups(ma);
          currentInput = [];
          for (const g of groups) {
            currentInput.push(getAggregateDatumValue(param, papers, g));
          }
        }
      }
      inputs.push(currentInput);
    }
    val = formula.func.apply(null, inputs);
  }

  return val;
}

export function getGroups(ma) {
  const groupingColumnObj = window.lima.parseFormulaString(ma.groupingColumn, ma.hashcols);
  ma.groupingColumnObj = groupingColumnObj;
  if (!groupingColumnObj) return [];

  const groups = [];
  for (const paper of ma.papers) {
    for (const exp of paper.experiments) {
      if (exp.excluded) continue;
      const group = getGroup(exp);

      if (group != null && group !== '' && groups.indexOf(group) === -1) groups.push(group);
    }
  }

  groups.sort(); // alphabetically
  return groups;
}

function getGroup(experiment) {
  const { groupingColumnObj } = experiment.paper.metaanalysis;
  if (groupingColumnObj) {
    return getDatumValue(groupingColumnObj, experiment);
  }
}
