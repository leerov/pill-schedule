import React from 'react';
import { Medication } from '../types';
import { DateUtils } from '../utils/dateUtils';
import { ColorUtils } from '../utils/colorUtils';
import { StorageUtils } from '../utils/storage';

interface TrackerTableProps {
  med: Medication;
  onUpdate: () => void;
}

export const TrackerTable: React.FC<TrackerTableProps> = ({ med, onUpdate }) => {
  const startDate = med.startDate ? new Date(med.startDate + "T00:00:00") : new Date();
  const timesSet = new Set<string>();
  med.phases.forEach(p => p.times.forEach(t => timesSet.add(t)));
  const timePriority = ['Утро', 'Обед', 'Вечер', 'Приём'];
  let times = timePriority.filter(t => timesSet.has(t));
  timesSet.forEach(t => { if (!times.includes(t)) times.push(t); });
  if (times.length === 0) times = ["Приём"];

  const checkedDoses = StorageUtils.getCheckedDoses(med.id);
  const dark = ColorUtils.darken(med.color, 0.12);

  let cum2 = 0;
  let doseCounter = 0;
  let rowsHtml: JSX.Element[] = [];

  med.phases.forEach((p, pIdx) => {
    rowsHtml.push(
      <tr key={`div-${pIdx}`} className="phase-divider">
        <td colSpan={times.length + 1}>{p.label}{p.maintenance ? " · далее по этой же схеме" : ""}</td>
      </tr>
    );
    for (let d = 1; d <= p.days; d++) {
      const date = DateUtils.addDays(startDate, cum2);
      cum2++;
      const cells = times.map((t, tIdx) => {
        if (p.times.includes(t)) {
          doseCounter++;
          const currentDoseIndex = doseCounter;
          const isChecked = checkedDoses.has(currentDoseIndex);
          return (
            <td key={tIdx}>
              <input
                type="checkbox"
                className="dose-check"
                checked={isChecked}
                onChange={(e) => {
                  StorageUtils.setCheckedDose(med.id, currentDoseIndex, e.target.checked);
                  onUpdate();
                }}
                style={{ accentColor: dark }}
              />
            </td>
          );
        }
        return <td key={tIdx} className="cell-empty"></td>;
      });
      rowsHtml.push(
        <tr key={`row-${pIdx}-${d}`}>
          <td>День {d}<span className="day-date">{DateUtils.fmtDate(date)}</span></td>
          {cells}
        </tr>
      );
    }
  });

  const headerCells = times.map((t, i) => <th key={i}>{t}</th>);

  return (
    <div className="tracker-wrap">
      <table className="tracker">
        <thead>
          <tr>
            <th>&nbsp;</th>
            {headerCells}
          </tr>
        </thead>
        <tbody>{rowsHtml}</tbody>
      </table>
    </div>
  );
};