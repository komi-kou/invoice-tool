'use client';

import { calcInvoiceTotals, formatCurrency } from '@/utils/calculations';

const ROUNDING_METHODS = [
  { value: 'floor', label: '切り捨て' },
  { value: 'ceil', label: '切り上げ' },
  { value: 'round', label: '四捨五入' },
];

export default function Summary({ data, updateField }) {
  const totals = calcInvoiceTotals(
    data.items,
    data.roundingMethod,
    data.discount,
    data.shipping
  );

  return (
    <fieldset className="form-section">
      <legend>💰 小計・税額・合計</legend>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="roundingMethod">端数処理</label>
          <select
            id="roundingMethod"
            value={data.roundingMethod}
            onChange={(e) => updateField('roundingMethod', e.target.value)}
          >
            {ROUNDING_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="discount">値引き</label>
          <input
            id="discount"
            type="number"
            value={data.discount}
            onChange={(e) => updateField('discount', e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipping">送料</label>
          <input
            id="shipping"
            type="number"
            value={data.shipping}
            onChange={(e) => updateField('shipping', e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="totals-display">
        <div className="total-row">
          <span>小計</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="total-row discount-row">
            <span>値引き</span>
            <span>- {formatCurrency(totals.discount)}</span>
          </div>
        )}
        {totals.shipping > 0 && (
          <div className="total-row">
            <span>送料</span>
            <span>{formatCurrency(totals.shipping)}</span>
          </div>
        )}
        {totals.tax10Base > 0 && (
          <div className="total-row tax-row">
            <span>消費税（10%対象: {formatCurrency(totals.tax10Base)}）</span>
            <span>{formatCurrency(totals.tax10Amount)}</span>
          </div>
        )}
        {totals.tax8Base > 0 && (
          <div className="total-row tax-row">
            <span>消費税（8%対象: {formatCurrency(totals.tax8Base)}）</span>
            <span>{formatCurrency(totals.tax8Amount)}</span>
          </div>
        )}
        <div className="total-row grand-total">
          <span>合計</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label htmlFor="notes">備考</label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="備考・特記事項"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bankInfo">振込先情報</label>
        <textarea
          id="bankInfo"
          value={data.bankInfo}
          onChange={(e) => updateField('bankInfo', e.target.value)}
          placeholder="○○銀行 ○○支店&#10;普通 1234567&#10;カ）ツナゲル"
          rows={3}
        />
      </div>
    </fieldset>
  );
}
