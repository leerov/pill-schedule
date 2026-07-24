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
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [globalStartDate, setGlobalStartDate] = useState(DateUtils.todayISO());
  const [showBuilder, setShowBuilder] = useState(false);

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

  const handleUpdate = (updatedMed: Medication) => {
    setMeds(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
    setEditingMedId(null);
  };

  const handleImport = (newMeds: Medication[]) => {
    setMeds(prev => [...newMeds, ...prev]);
  };

  const handleDelete = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleEdit = (id: string) => {
    setEditingMedId(id);
    setShowBuilder(true);
  };

  const applyGlobalStartDate = () => {
    setMeds(prev => prev.map(med => ({ ...med, startDate: globalStartDate })));
  };

  const editingMed = meds.find(m => m.id === editingMedId) || null;

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">Конструктор памяток</div>
        <p className="lead">Заполните параметры препарата и этапы повышения дозы — карточка с иконкой, схемой со стрелками и единым чек-листом приёма сформируется автоматически.</p>
      </header>

      <button
        className="solid-btn"
        onClick={() => setShowBuilder(true)}
        style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', padding: '12px 18px' }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span> Добавить препарат
      </button>

      {showBuilder && (
        <div className="modal-overlay" onClick={() => { setShowBuilder(false); setEditingMedId(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setShowBuilder(false); setEditingMedId(null); }}>✕</button>
            <BuilderForm
              onGenerate={(med) => {
                handleGenerate(med);
                setShowBuilder(false);
              }}
              editingMed={editingMed}
              onUpdate={(med) => {
                handleUpdate(med);
                setShowBuilder(false);
              }}
              onCancelEdit={() => {
                setEditingMedId(null);
                setShowBuilder(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="builder-actions" style={{ marginBottom: '20px', justifyContent: 'flex-start', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>Общая дата начала:</label>
        <input
          type="date"
          value={globalStartDate}
          onChange={e => setGlobalStartDate(e.target.value)}
          style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
        />
        <button className="ghost-btn" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={applyGlobalStartDate}>
          Применить ко всем
        </button>
      </div>

      <FileControls meds={meds} onImport={handleImport} />

      <div id="cards">
        {meds.map(med => (
          <React.Fragment key={med.id}>
            <ScheduleCard
              med={med}
              onDelete={() => handleDelete(med.id)}
              onEdit={() => handleEdit(med.id)}
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
