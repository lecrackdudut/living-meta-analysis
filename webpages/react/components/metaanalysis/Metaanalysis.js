import React, { useState } from 'react';
import Tabs from '../layout/Tabs';
import Tags from './tags/TagList';
import Info from './Info';
import DataTable from './datatable/DataTable';
import Aggregates from './aggregates/Aggregates';
import Plots from './plots/Plots';
import Metadata from './Metadata';
import { populateCircularMa } from '../../tools/datatools';
import { populatePlots } from '../../tools/graphtools';

import './Metaanalysis.css';

// returns the view with all the metaanalysis components
function Metaanalysis(props) {
  const { metaanalysis } = props;
  populateCircularMa(metaanalysis);
  populatePlots(metaanalysis);
  const [edit, setEdit] = useState(0);
  const [title] = useState(metaanalysis.title);
  const [tags] = useState(metaanalysis.tags);
  const [info] = useState({
    description: metaanalysis.description,
    published: metaanalysis.published,
  });
  const [table] = useState({
    columns: metaanalysis.columns,
    papers: metaanalysis.papers,
    excluded: metaanalysis.excludedExperiments,
  });
  const [aggregates] = useState(metaanalysis.aggregates);
  const [groupingAggregates] = useState(metaanalysis.groupingAggregates);
  const [graphs] = useState(metaanalysis.graphs);
  const [metadata] = useState({
    enteredByUsername: metaanalysis.enteredByUsername,
    ctime: metaanalysis.ctime,
    mtime: metaanalysis.mtime,
  });

  console.log(metaanalysis);

  const editButtonMessage = edit ? 'STOP' : 'EDIT';

  return (
    <main className="metaanalysis">
      <div className="titlebar">
        <div className="title">
          <p type="input">{title}</p>
        </div>
        <Tags edit={edit} tags={tags} />
        <button className={edit === 0 ? 'btn-start' : 'btn-stop'} type="button" onClick={() => setEdit(edit === 0 ? 1 : 0)}>{editButtonMessage}</button>
      </div>
      <Tabs>
        <Info
          path="/info"
          tabName="Info"
          description={info.description}
          reference={info.published}
        />
        <DataTable
          path="/table"
          tabName="Table"
          columns={table.columns}
          papers={table.papers}
        />
        <Aggregates
          path="/aggregates"
          tabName="Aggregates"
          aggregates={aggregates}
          groupingAggregates={groupingAggregates}
          groupingColumn={metaanalysis.groupingColumnObj.title}
          groups={metaanalysis.groups}
        />
        {/* TODO : delete [2] */}
        <Plots
          path="/plots"
          tabName="Plots"
          graphs={[graphs[2]]}
        />
      </Tabs>
      <Metadata
        username={metadata.enteredByUsername}
        ctime={metadata.ctime}
        mtime={metadata.mtime}
      />
    </main>

  );
}

export default Metaanalysis;
