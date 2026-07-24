import React from 'react';
import { Medication } from '../types';
import { ColorUtils } from '../utils/colorUtils';
import { DateUtils } from '../utils/dateUtils';

const getMedIcon = (type: string, color: string) => {
  const lightColor = ColorUtils.lighten(color, 0.55);
  if (type === "tablet-round") {
    return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="4" y="4" width="48" height="48" rx="10" fill="#fff" stroke="${color}" stroke-width="1.4" opacity="0.9"/>
      <g opacity="0.55">
        <circle cx="16" cy="16" r="6" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
        <circle cx="40" cy="16" r="6" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
        <circle cx="16" cy="40" r="6" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
      </g>
      <circle cx="40" cy="40" r="9" fill="#F5F4F1" stroke="#D8D5CC" stroke-width="1"/>
      <ellipse cx="37.5" cy="37" rx="3" ry="2" fill="#fff" opacity="0.8"/>
      <path d="M34 40h12" stroke="#C9C6BD" stroke-width="0.9"/>
    </svg>`;
  }
  if (type === "capsule") {
    return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="4" y="4" width="48" height="48" rx="10" fill="#fff" stroke="${color}" stroke-width="1.4" opacity="0.9"/>
      <g opacity="0.5">
        <rect x="11" y="13" width="11" height="5.5" rx="2.75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
        <rect x="34" y="13" width="11" height="5.5" rx="2.75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
      </g>
      <rect x="31" y="32" width="17" height="9" rx="4.5" fill="#fff" stroke="#D8D5CC" stroke-width="1"/>
      <rect x="31" y="32" width="8.5" height="9" rx="4.5" fill="${lightColor}" stroke="#D8D5CC" stroke-width="1"/>
    </svg>`;
  }
  return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="4" y="4" width="48" height="48" rx="10" fill="#fff" stroke="${color}" stroke-width="1.4" opacity="0.9"/>
    <g opacity="0.55">
      <rect x="11" y="13" width="11" height="5.5" rx="2.75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
      <rect x="34" y="13" width="11" height="5.5" rx="2.75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
      <rect x="11" y="36" width="11" height="5.5" rx="2.75" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
    </g>
    <rect x="31" y="34.5" width="15" height="7" rx="3.5" fill="#F5F4F1" stroke="#D8D5CC" stroke-width="1"/>
    <line x1="38.5" y1="34.5" x2="38.5" y2="41.5" stroke="#D8D5CC" stroke-width="0.8"/>
  </svg>`;
};

interface ScheduleCardProps {
  med: Medication;
  onDelete: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ med, onDelete }) => {
  const accent = med.color;
  const soft = ColorUtils.lighten(accent, 0.86);
  const dark = ColorUtils.darken(accent, 0.12);
  const startDate = med.startDate ? new Date(med.startDate + "T00:00:00") : new Date();

  const timesSet = new Set<string>();
  med.phases.forEach(p => p.times.forEach(t => timesSet.add(t)));
  const timePriority = ['Утро', 'Обед', 'Вечер', 'Приём'];
  let times = timePriority.filter(t => timesSet.has(t));
  timesSet.forEach(t => { if (!times.includes(t)) times.push(t); });
  if (times.length === 0) times = ["Приём"];

  let cumDays = 0;
  let stepsHtml = "";
  med.steps.forEach((s, i) => {
    const phaseDays = (med.phases[i] && med.phases[i].days) || 1;
    const rangeStart = DateUtils.addDays(startDate, cumDays);
    const rangeEnd = DateUtils.addDays(startDate, cumDays + phaseDays - 1);
    const dateLabel = DateUtils.fmtRange(rangeStart, rangeEnd);
    cumDays += phaseDays;

    const stepStyle = s.maintenance ? `border-color:${accent};background:${soft};` : "";
    stepsHtml += `
      <div class="step" style="${stepStyle}">
        <div class="day-tag">${s.day}</div>
        <div class="date-sub">${dateLabel}</div>
        <div class="dose">${s.dose}<small> ${s.unit}</small></div>
        <div class="detail">${s.detail}</div>
      </div>`;
    if (i < med.steps.length - 1) {
      stepsHtml += `
        <div class="arrow" style="color:${dark}">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M1 6h16M12 1l6 5-6 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>`;
    }
  });

  return (
    <div className="card">
      <button className="delete-card" onClick={onDelete}>✕ Удалить</button>
      <div className="card-head">
        <div className="icon-box" dangerouslySetInnerHTML={{ __html: getMedIcon(med.icon, dark) }} />
        <div className="card-title">
          <h2>{med.name}</h2>
          <div className="sub">{med.sub}</div>
        </div>
        <div style={{ marginLeft: 'auto' }} />
      </div>
      <div className="steps" dangerouslySetInnerHTML={{ __html: stepsHtml }} />
    </div>
  );
};