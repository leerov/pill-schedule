import { Medication } from '../types';

const STORAGE_PREFIX = 'med_tracker_';

export const StorageUtils = {
  getCheckedDoses(medId: string): Set<number> {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${medId}`);
    if (!data) return new Set();
    try {
      return new Set(JSON.parse(data));
    } catch {
      return new Set();
    }
  },
  setCheckedDose(medId: string, doseIndex: number, checked: boolean): void {
    const checkedDoses = this.getCheckedDoses(medId);
    if (checked) {
      checkedDoses.add(doseIndex);
    } else {
      checkedDoses.delete(doseIndex);
    }
    localStorage.setItem(`${STORAGE_PREFIX}${medId}`, JSON.stringify(Array.from(checkedDoses)));
  },
  exportToFile(meds: Medication[]): void {
    const dataStr = JSON.stringify(meds, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `med_schemes.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  importFromFile(file: File): Promise<Medication[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          const meds = Array.isArray(parsed) ? parsed : [parsed];
          const newMeds = meds.map(med => ({ ...med, id: crypto.randomUUID() }));
          resolve(newMeds);
        } catch (err) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },
  encodeToURL(meds: Medication[]): string {
    const json = JSON.stringify(meds);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return `?schema=${encoded}`;
  },
  decodeFromURL(): Medication[] | null {
    const params = new URLSearchParams(window.location.search);
    const schema = params.get('schema');
    if (!schema) return null;
    try {
      const json = decodeURIComponent(escape(atob(schema)));
      const parsed = JSON.parse(json);
      const meds = Array.isArray(parsed) ? parsed : [parsed];
      return meds.map(med => ({ ...med, id: crypto.randomUUID() }));
    } catch {
      return null;
    }
  }
};