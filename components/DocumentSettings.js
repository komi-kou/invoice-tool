'use client';

const DOC_TYPES = [
  { value: 'invoice', label: '請求書' },
  { value: 'estimate', label: '見積書' },
  { value: 'delivery', label: '納品書' },
  { value: 'receipt', label: '領収書' },
];

const HONORIFICS = [
  { value: '御中', label: '御中' },
  { value: '様', label: '様' },
  { value: '殿', label: '殿' },
];

export default function DocumentSettings({ data, updateField }) {
  return (
    <fieldset className="form-section">
      <legend>📄 書類設定</legend>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="documentType">帳票タイプ</label>
          <select
            id="documentType"
            value={data.documentType}
            onChange={(e) => updateField('documentType', e.target.value)}
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="documentNumber">書類番号</label>
          <input
            id="documentNumber"
            type="text"
            value={data.documentNumber}
            onChange={(e) => updateField('documentNumber', e.target.value)}
            placeholder="INV-001"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subject">件名</label>
        <input
          id="subject"
          type="text"
          value={data.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          placeholder="○月分 広告運用コンサルティング費用"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="issueDate">発行日</label>
          <input
            id="issueDate"
            type="date"
            value={data.issueDate}
            onChange={(e) => updateField('issueDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">支払期日</label>
          <input
            id="dueDate"
            type="date"
            value={data.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group flex-grow">
          <label htmlFor="clientName">宛先</label>
          <input
            id="clientName"
            type="text"
            value={data.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="クライアント名"
          />
        </div>
        <div className="form-group" style={{ maxWidth: '100px' }}>
          <label htmlFor="clientHonorific">敬称</label>
          <select
            id="clientHonorific"
            value={data.clientHonorific}
            onChange={(e) => updateField('clientHonorific', e.target.value)}
          >
            {HONORIFICS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
