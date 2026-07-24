import React, { useRef } from 'react';
import { Medication } from '../types';
import { StorageUtils } from '../utils/storage';

interface FileControlsProps {
  meds: Medication[];
  onImport: (meds: Medication[]) => void;
}

export const FileControls: React.FC<FileControlsProps> = ({ meds, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedMeds = await StorageUtils.importFromFile(file);
      onImport(importedMeds);
    } catch (err) {
      alert("Ошибка при чтении файла. Убедитесь, что это корректный JSON схемы.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportAll = () => {
    if (meds.length === 0) {
      alert("Нет схем для сохранения");
      return;
    }
    StorageUtils.exportToFile(meds);
  };

  // const   = () => {
  //   if (meds.length === 0) {
  //     alert("Нет схем для обмена");
  //     return;
  //   }
  //   const url = window.location.origin + window.location.pathname + StorageUtils.encodeToURL(meds);
  //   navigator.clipboard.writeText(url).then(() => {
  //     alert("Ссылка на все схемы скопирована в буфер обмена!");
  //   }).catch(() => {
  //     alert("Не удалось скопировать ссылку");
  //   });
  // };

  return (
    <div className="builder-actions" style={{ marginBottom: '20px', justifyContent: 'center', gap: '10px' }}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* <button className="ghost-btn" onClick={handleShareAll}>
        🔗 Скопировать ссылку
      </button> */}
      <button className="ghost-btn" onClick={handleExportAll}>
        💾 Сохранить схему в файл
      </button>
      <button className="ghost-btn" onClick={() => fileInputRef.current?.click()}>
        📂 Загрузить схему из файла
      </button>
    </div>
  );
};