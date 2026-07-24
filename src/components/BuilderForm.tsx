import React, { useState } from 'react';
import { FormPhase, Medication } from '../types';
import { DateUtils } from '../utils/dateUtils';

interface BuilderFormProps {
  onGenerate: (med: Medication) => void;
  editingMed?: Medication | null;
  onUpdate?: (med: Medication) => void;
  onCancelEdit?: () => void;
}

const CONFIG = {
  defaultShape: 'tablet-round',
  defaultColor: '#5B6FE0'
};

export const BuilderForm: React.FC<BuilderFormProps> = ({ onGenerate, editingMed, onUpdate, onCancelEdit }) => {
  const [name, setName] = useState(editingMed?.name || '');
  const [sub, setSub] = useState(editingMed?.sub || '');
  const [shape, setShape] = useState<'tablet-round' | 'tablet-oval' | 'capsule'>(editingMed?.icon || CONFIG.defaultShape);
  const [color, setColor] = useState(editingMed?.color || CONFIG.defaultColor);
  const [startDate, setStartDate] = useState(editingMed?.startDate || DateUtils.todayISO());
  const [taken, setTaken] = useState(editingMed?.takenCount || 0);
  const [phases, setPhases] = useState<FormPhase[]>([{
    day: '', dose: '', unit: 'мг/сут', days: 3, detail: '', maintenance: false, times: []
  }]);

  React.useEffect(() => {
    if (editingMed) {
      setName(editingMed.name);
      setSub(editingMed.sub);
      setShape(editingMed.icon);
      setColor(editingMed.color);
      setStartDate(editingMed.startDate);
      setTaken(editingMed.takenCount);

      const newPhases: FormPhase[] = editingMed.phases.map((p, idx) => {
        const step = editingMed.steps[idx] || { day: '', dose: '', unit: '', detail: '', maintenance: false };
        return {
          day: step.day,
          dose: step.dose,
          unit: step.unit,
          days: p.days,
          detail: step.detail,
          maintenance: p.maintenance || false,
          times: p.times
        };
      });
      setPhases(newPhases.length > 0 ? newPhases : [{ day: '', dose: '', unit: 'мг/сут', days: 3, detail: '', maintenance: false, times: [] }]);
    }
  }, [editingMed]);

  const addPhase = () => {
    setPhases([...phases, { day: '', dose: '', unit: 'мг/сут', days: 3, detail: '', maintenance: false, times: [] }]);
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const updatePhase = (index: number, field: keyof FormPhase, value: any) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const toggleTime = (index: number, time: string) => {
    const newPhases = [...phases];
    const times = newPhases[index].times;
    if (times.includes(time)) {
      newPhases[index].times = times.filter(t => t !== time);
    } else {
      newPhases[index].times = [...times, time];
    }
    setPhases(newPhases);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Укажите название препарата");
      return;
    }
    if (phases.length === 0) {
      alert("Добавьте хотя бы один этап дозирования");
      return;
    }

    const steps = phases.map(p => ({
      day: p.day || '—',
      dose: p.dose || '—',
      unit: p.unit || '',
      detail: p.detail || '',
      maintenance: p.maintenance
    }));

    const medPhases = phases.map(p => ({
      label: `${p.dose || '—'} ${p.unit} · ${p.maintenance ? "далее" : p.days + " дня"}`,
      days: p.maintenance ? Math.max(p.days, 7) : p.days,
      times: p.times.length ? p.times : ['Приём'],
      maintenance: p.maintenance
    }));

    const medData = {
      id: editingMed ? editingMed.id : crypto.randomUUID(),
      name: name.trim(),
      sub: sub.trim() || 'схема приёма',
      icon: shape as 'tablet-round' | 'tablet-oval' | 'capsule',
      color,
      startDate,
      takenCount: taken,
      steps,
      phases: medPhases
    };

    if (editingMed && onUpdate) {
      onUpdate(medData);
    } else {
      onGenerate(medData);
      setName('');
      setSub('');
      setShape(CONFIG.defaultShape);
      setColor(CONFIG.defaultColor);
      setStartDate(DateUtils.todayISO());
      setTaken(0);
      setPhases([{ day: '', dose: '', unit: 'мг/сут', days: 3, detail: '', maintenance: false, times: [] }]);
    }
  };

  return (
    <div className="builder">
      <h3>Новый препарат</h3>
      <div className="row">
        <div className="field" style={{flex: '2 1 220px'}}>
          <label>Название (МНН)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="напр. Оланзапин" />
        </div>
        <div className="field" style={{flex: '2 1 220px'}}>
          <label>Торговое название</label>
          <input type="text" value={sub} onChange={e => setSub(e.target.value)} placeholder="напр. торговое название «Заласта»" />
        </div>
        <div className="field" style={{flex: '0 0 150px'}}>
          <label>Форма</label>
          <select value={shape} onChange={e => setShape(e.target.value)}>
            <option value="tablet-round">Таблетка круглая</option>
            <option value="tablet-oval">Таблетка овальная</option>
            <option value="capsule">Капсула</option>
          </select>
        </div>
        <div className="field" style={{flex: '0 0 70px'}}>
          <label>Цвет</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="field" style={{flex: '0 0 160px'}}>
          <label>Дата начала приёма</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="field" style={{flex: '0 0 130px'}}>
          <label>Уже принято доз</label>
          <input type="number" min="0" value={taken} onChange={e => setTaken(parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <h3 style={{marginTop: '18px'}}>Этапы дозирования</h3>
      {phases.map((p, idx) => (
        <div key={idx} className="phase-box">
          <span className="phase-num">Этап {idx + 1}</span>
          <button className="remove-phase" onClick={() => removePhase(idx)}>Удалить</button>
          <div className="row" style={{marginBottom: '8px'}}>
            <div className="field" style={{flex: '1 1 140px'}}>
              <label>Дни (подпись)</label>
              <input type="text" value={p.day} onChange={e => updatePhase(idx, 'day', e.target.value)} placeholder="напр. 1–3 день" />
            </div>
            <div className="field" style={{flex: '0 0 100px'}}>
              <label>Доза</label>
              <input type="text" value={p.dose} onChange={e => updatePhase(idx, 'dose', e.target.value)} placeholder="напр. 5" />
            </div>
            <div className="field" style={{flex: '0 0 120px'}}>
              <label>Единица</label>
              <input type="text" value={p.unit} onChange={e => updatePhase(idx, 'unit', e.target.value)} placeholder="мг/сут" />
            </div>
            <div className="field" style={{flex: '0 0 90px'}}>
              <label>Дней в этапе</label>
              <input type="number" min="1" value={p.days} onChange={e => updatePhase(idx, 'days', parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="field" style={{marginBottom: '8px'}}>
            <label>Описание приёма</label>
            <input type="text" value={p.detail} onChange={e => updatePhase(idx, 'detail', e.target.value)} placeholder="напр. 300 утром + 300 в обед" />
          </div>
          <div className="field">
            <label>Время приёма (для чек-листа)</label>
            <div className="times-check">
              {['Утро', 'Обед', 'Вечер'].map(time => (
                <label key={time}>
                  <input
                    type="checkbox"
                    checked={p.times.includes(time)}
                    onChange={() => toggleTime(idx, time)}
                  /> {time}
                </label>
              ))}
            </div>
          </div>
          <label className="maint-check">
            <input
              type="checkbox"
              checked={p.maintenance}
              onChange={e => updatePhase(idx, 'maintenance', e.target.checked)}
            /> Это поддерживающая доза (далее без ограничения по дням)
          </label>
        </div>
      ))}

      <div className="builder-actions">
        <button className="ghost-btn" onClick={addPhase}>+ Добавить этап</button>
      </div>

      <div className="builder-actions" style={{marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px'}}>
        <button className="solid-btn" onClick={handleSubmit}>
          {editingMed ? 'Обновить препарат' : 'Сформировать карточку'}
        </button>
        {editingMed && onCancelEdit && (
          <button className="ghost-btn" onClick={onCancelEdit}>Отмена</button>
        )}
        {!editingMed && (
          <button className="ghost-btn" onClick={() => {
            setName(''); setSub(''); setShape(CONFIG.defaultShape); setColor(CONFIG.defaultColor);
            setStartDate(DateUtils.todayISO()); setTaken(0);
            setPhases([{ day: '', dose: '', unit: 'мг/сут', days: 3, detail: '', maintenance: false, times: [] }]);
          }}>Очистить форму</button>
        )}
      </div>
    </div>
  );
};