import React, { useState, useEffect } from 'react';
import { Medication } from './types';
import { DateUtils } from './utils/dateUtils';
import { StorageUtils } from './utils/storage';
import { BuilderForm } from './components/BuilderForm';
import { ScheduleCard } from './components/ScheduleCard';
import { TrackerTable } from './components/TrackerTable';
import { FileControls } from './components/FileControls';
import './index.css';

const DEFAULT_MEDS: Medication[] = [
  {
    id: 'default-1',
    name: "Оланзапин",
    sub: "торговое название «Заласта»",
    icon: "tablet-round",
    color: "#5B6FE0",
    startDate: DateUtils.isoOffset(-3),
    takenCount: 3,
    steps: [
      { day: "1–3 день", dose: "2.5", unit: "мг/сут", detail: "1 приём в сутки" },
      { day: "4–6 день", dose: "5", unit: "мг/сут", detail: "1 приём в сутки" },
      { day: "7–9 день", dose: "7.5", unit: "мг/сут", detail: "1 приём в сутки" },
      { day: "с 10 дня", dose: "10", unit: "мг/сут", detail: "поддерживающая доза", maintenance: true }
    ],
    phases: [
      { label: "2.5 мг/сут · 3 дня", days: 3, times: ["Приём"] },
      { label: "5 мг/сут · 3 дня", days: 3, times: ["Приём"] },
      { label: "7.5 мг/сут · 3 дня", days: 3, times: ["Приём"] },
      { label: "10 мг/сут · далее", days: 7, times: ["Приём"], maintenance: true }
    ]
  },
  {
    id: 'default-2',
    name: "Вальпроевая кислота",
    sub: "торговое название «Депакин Хроно»",
    icon: "tablet-oval",
    color: "#3E9A78",
    startDate: DateUtils.isoOffset(-2),
    takenCount: 3,
    steps: [
      { day: "1–3 день", dose: "300", unit: "мг/сут", detail: "300 мг утром" },
      { day: "4–6 день", dose: "600", unit: "мг/сут", detail: "300 утро + 300 обед" },
      { day: "7–9 день", dose: "900", unit: "мг/сут", detail: "300×3: утро / обед / вечер" },
      { day: "с 10 дня", dose: "1200", unit: "мг/сут", detail: "поддерживающая доза", maintenance: true }
    ],
    phases: [
      { label: "300 мг/сут · 3 дня", days: 3, times: ["Утро"] },
      { label: "600 мг/сут · 3 дня", days: 3, times: ["Утро", "Обед"] },
      { label: "900 мг/сут · 3 дня", days: 3, times: ["Утро", "Обед", "Вечер"] },
      { label: "1200 мг/сут · далее", days: 7, times: ["Утро", "Обед", "Вечер"], maintenance: true }
    ]
  }
];

function App() {
  const [meds, setMeds] = useState<Medication[]>([]);

  useEffect(() => {
    const urlMeds = StorageUtils.decodeFromURL();
    if (urlMeds && urlMeds.length > 0) {
      setMeds(urlMeds);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setMeds(DEFAULT_MEDS);
    }
  }, []);

  const handleGenerate = (newMed: Medication) => {
    setMeds(prev => [newMed, ...prev]);
  };

  const handleImport = (newMeds: Medication[]) => {
    setMeds(prev => [...newMeds, ...prev]);
  };

  const handleDelete = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
    localStorage.removeItem(`med_tracker_${id}`);
  };

  const handleShare = (med: Medication) => {
    const url = window.location.origin + window.location.pathname + StorageUtils.encodeToURL([med]);
    navigator.clipboard.writeText(url).then(() => {
      alert("Ссылка на схему скопирована в буфер обмена!");
    });
  };

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">Конструктор памяток</div>
        <p className="lead">Заполните параметры препарата и этапы повышения дозы — карточка с иконкой, схемой со стрелками и единым чек-листом приёма сформируется автоматически.</p>
      </header>

      <BuilderForm onGenerate={handleGenerate} />

      <FileControls meds={meds} onImport={handleImport} />

      <div id="cards">
        {meds.map(med => (
          <React.Fragment key={med.id}>
            <ScheduleCard
              med={med}
              onDelete={() => handleDelete(med.id)}
              onShare={() => handleShare(med)}
              onExport={() => StorageUtils.exportToFile([med])}
            />
            <TrackerTable
              med={med}
              onUpdate={() => setMeds(prev => [...prev])}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="print-btn">
        <button className="solid-btn" onClick={() => window.print()}>Распечатать памятку</button>
      </div>
      <div className="footer-note">Сформировано автоматически по назначению врача</div>
    </div>
  );
}

export default App;
