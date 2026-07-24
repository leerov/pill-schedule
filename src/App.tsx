import React, { useState, useEffect } from 'react';
import { Medication } from './types';
import { DateUtils } from './utils/dateUtils';
import { StorageUtils } from './utils/storage';
import { BuilderForm } from './components/BuilderForm';
import { ScheduleCard } from './components/ScheduleCard';
import { TrackerTable } from './components/TrackerTable';
import { FileControls } from './components/FileControls';
import './index.css';

function App() {
  const [meds, setMeds] = useState<Medication[]>([]);

  useEffect(() => {
    const urlMeds = StorageUtils.decodeFromURL();
    if (urlMeds && urlMeds.length > 0) {
      setMeds(urlMeds);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const saved = localStorage.getItem('med_tracker_meds_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMeds(parsed);
        } catch (e) {
          console.error("Failed to parse saved meds", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (meds.length > 0) {
      localStorage.setItem('med_tracker_meds_list', JSON.stringify(meds));
    } else {
      localStorage.removeItem('med_tracker_meds_list');
    }
  }, [meds]);

  const handleGenerate = (newMed: Medication) => {
    setMeds(prev => [newMed, ...prev]);
  };

  const handleImport = (newMeds: Medication[]) => {
    setMeds(prev => [...newMeds, ...prev]);
  };

  const handleDelete = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
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
