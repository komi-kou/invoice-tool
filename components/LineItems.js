'use client';

import { calcLineTotal, formatCurrency } from '@/utils/calculations';

const TAX_RATES = [
  { value: '10', label: '10%' },
  { value: '8', label: '8%（軽減）' },
  { value: '0', label: '非課税' },
];

export default function LineItems({ data, updateItem, addItem, removeItem, moveItemUp, moveItemDown, duplicateItem }) {
  return (
    <fieldset className="form-section">
      <legend>📝 明細</legend>

      <div className="line-items-container">
        {data.items.map((item, index) => (
          <div key={item.id} className="line-item">
            <div className="line-item-header">
              <span className="line-item-number">#{index + 1}</span>
              <div className="line-item-actions">
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  title="上に移動"
                >↑</button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => moveItemDown(index)}
                  disabled={index === data.items.length - 1}
                  title="下に移動"
                >↓</button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => duplicateItem(index)}
                  title="複製"
                >⧉</button>
                <button
                  type="button"
                  className="btn-icon btn-danger"
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length <= 1}
                  title="削除"
                >✕</button>
              </div>
            </div>

            <div className="form-group">
              <label>項目名</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="コンサルティング費用"
              />
            </div>

            <div className="line-item-details">
              <div className="form-group">
                <label>単価</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="form-group" style={{ maxWidth: '80px' }}>
                <label>数量</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  placeholder="1"
                  min="0"
                />
              </div>
              <div className="form-group" style={{ maxWidth: '80px' }}>
                <label>単位</label>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                  placeholder="式"
                />
              </div>
              <div className="form-group" style={{ maxWidth: '120px' }}>
                <label>税区分</label>
                <select
                  value={item.taxRate}
                  onChange={(e) => updateItem(item.id, 'taxRate', e.target.value)}
                >
                  {TAX_RATES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group line-item-total">
                <label>小計</label>
                <span className="total-value">{formatCurrency(calcLineTotal(item))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-add-item"
        onClick={addItem}
      >
        ＋ 明細を追加
      </button>
    </fieldset>
  );
}
