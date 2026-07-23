import React, { useRef } from 'react';
import { Medication } from '../types';
import { StorageUtils } from '../utils/storage';

interface FileControlsProps {
  onImport: (med: Medication) => void;
}

export const FileControls: React.FC<FileControlsProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const med = await StorageUtils.importFromFile(file);
      onImport(med);
    } catch (err) {
      alert("Ошибка при чтении файла. Убедитесь, что это корректный JSON схемы.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="builder-actions" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="ghost-btn" onClick={() => fileInputRef.current?.click()}>
        📂 Загрузить схему
      </button>
    </div>
  );
};