import React from 'react';
import { getDatumValue, formatNumber } from '../../../tools/datatools';

function Paper(props) {
  const { paper, columns } = props;
  const { title } = paper;
  const nExp = Object.keys(paper.experiments).length;

  return (
    paper.experiments.map((exp, key) => {
      let newPaper;
      let firstTr;
      if (key === 0) {
        newPaper = (
          <td key={title} rowSpan={nExp}>
            {title}
          </td>
        );
        firstTr = 'paperstart';
      }
      return (
        <tr key={exp.ctime + paper.id} className={firstTr}>
          {newPaper}
          <td key={exp.title}>
            {exp.title}
          </td>
          {columns.map((col) => {
            const value = getDatumValue(col, exp);
            let fixed;
            let className;
            if (col.id) {
              fixed = value;
              className = 'data';
            } else {
              fixed = formatNumber(value);
              className = 'computed';
            }
            return (
              <td className={className} key={col.id}>{fixed}</td>
            );
          })}
        </tr>
      );
    })
  );
}

export default Paper;