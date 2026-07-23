const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

export const DateUtils = {
  addDays(date: Date | string, n: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  },
  fmtDate(d: Date): string {
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  },
  fmtRange(a: Date, b: Date): string {
    if (a.getTime() === b.getTime()) return this.fmtDate(a);
    if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MONTHS[a.getMonth()]}`;
    return `${this.fmtDate(a)} – ${this.fmtDate(b)}`;
  },
  todayISO(): string {
    return this.isoLocal(new Date());
  },
  isoLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },
  isoOffset(n: number): string {
    return this.isoLocal(this.addDays(new Date(), n));
  }
};