'use client';

import { calcLineTotal, calcInvoiceTotals, formatCurrency, formatDate } from '@/utils/calculations';

// 帳票タイプ別の設定
const DOC_TYPE_CONFIG = {
  invoice: {
    label: '御請求書',
    color: '#2b6edc',
    greeting: '下記の通りご請求申し上げます。',
    amountLabel: 'ご請求金額',
  },
  estimate: {
    label: '御見積書',
    color: '#28a745',
    greeting: '下記の通りお見積申し上げます。',
    amountLabel: 'お見積金額',
  },
  delivery: {
    label: '御納品書',
    color: '#17a2b8',
    greeting: '下記の通り納品申し上げます。',
    amountLabel: '納品金額',
  },
  receipt: {
    label: '御領収書',
    color: '#dc3545',
    greeting: '下記の通り領収いたしました。',
    amountLabel: 'ご領収金額',
  },
};

// 会社名を印鑑用に分割する関数
function splitCompanyName(name) {
  if (!name) return [];
  // 「株式会社」「有限会社」等の法人格を分離
  const prefixes = ['株式会社', '有限会社', '合同会社', '合資会社'];
  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      const rest = name.slice(prefix.length);
      return [prefix, rest, '之印'];
    }
    if (name.endsWith(prefix)) {
      const rest = name.slice(0, name.length - prefix.length);
      return [rest, prefix, '之印'];
    }
  }
  // 法人格がない場合は2分割
  const mid = Math.ceil(name.length / 2);
  return [name.slice(0, mid), name.slice(mid), '之印'];
}

export default function InvoicePreview({ data }) {
  const totals = calcInvoiceTotals(
    data.items,
    data.roundingMethod,
    data.discount,
    data.shipping
  );

  const config = DOC_TYPE_CONFIG[data.documentType] || DOC_TYPE_CONFIG.invoice;
  const themeColor = config.color;
  const stampLines = splitCompanyName(data.companyName);

  return (
    <div className="preview-container" id="invoice-preview">
      <div className="preview-paper">

        {/* === 上部: 宛先（左）+ 自社情報（右） === */}
        <div className="preview-top">
          <div className="preview-top-left">
            <div className="preview-client-block">
              {data.clientName ? (
                <span className="preview-client-name-text">
                  {data.clientName} <span className="honorific">{data.clientHonorific}</span>
                </span>
              ) : (
                <span className="placeholder-text">宛先未入力</span>
              )}
            </div>
            <p className="preview-greeting">{config.greeting}</p>
          </div>
          <div className="preview-top-right">
            {data.logoUrl && (
              <div className="preview-logo">
                <img src={data.logoUrl} alt="ロゴ" />
              </div>
            )}
            <div className="preview-company-header">
              <div className="preview-company-info">
                <div className="preview-company-name">{data.companyName || '会社名未入力'}</div>
              </div>
              {/* 印鑑: アップロード画像があれば優先、なければ自動生成角印 */}
              {data.stampUrl ? (
                <div className="preview-stamp">
                  <img src={data.stampUrl} alt="印鑑" />
                </div>
              ) : data.companyName ? (
                <div className="preview-stamp-auto">
                  <div className="stamp-text">
                    {stampLines.map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {data.companyAddress && (
              <div className="preview-company-detail preserve-whitespace">{data.companyAddress}</div>
            )}
            {data.companyTel && <div className="preview-company-detail">TEL: {data.companyTel}</div>}
            {data.companyEmail && <div className="preview-company-detail">{data.companyEmail}</div>}
            {data.registrationNumber && (
              <div className="preview-company-detail registration">
                登録番号: {data.registrationNumber}
              </div>
            )}
          </div>
        </div>

        {/* === タイトル === */}
        <h1 className="preview-title">{config.label}</h1>

        {/* === 金額ボックス + 日付情報 === */}
        <div className="preview-amount-row">
          <div className="preview-amount-box">
            <span className="preview-amount-label">{config.amountLabel}</span>
            <span className="preview-amount-value">{formatCurrency(totals.total)}</span>
          </div>
          <div className="preview-date-info">
            <div className="preview-date-row">
              <span className="label">発行日:</span>
              <span>{formatDate(data.issueDate)}</span>
            </div>
            <div className="preview-date-row">
              <span className="label">登録番号:</span>
              <span>{data.documentNumber || '-'}</span>
            </div>
            {data.documentType !== 'delivery' && (
              <div className="preview-date-row">
                <span className="label">
                  {data.documentType === 'estimate' ? '有効期限:' : '支払期日:'}
                </span>
                <span>{formatDate(data.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* === 件名 === */}
        {data.subject && (
          <div className="preview-subject-line">
            <span className="label">件名:</span> {data.subject}
          </div>
        )}

        {/* === 明細テーブル === */}
        <table className="preview-table">
          <thead>
            <tr style={{ backgroundColor: themeColor }}>
              <th className="col-no">No.</th>
              <th className="col-name">内容・摘要</th>
              <th className="col-qty">数量</th>
              <th className="col-unit">単位</th>
              <th className="col-price">単価</th>
              <th className="col-total">金額</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => {
              const lineTotal = calcLineTotal(item);
              return (
                <tr key={item.id || index}>
                  <td className="col-no">{index + 1}</td>
                  <td className="col-name">{item.name || ''}</td>
                  <td className="col-qty">{item.quantity || ''}</td>
                  <td className="col-unit">{item.unit || ''}</td>
                  <td className="col-price">{formatCurrency(item.unitPrice)}</td>
                  <td className="col-total">{formatCurrency(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* === 下部: 備考・振込先 (左) + 合計 (右) === */}
        <div className="preview-bottom">
          <div className="preview-bottom-left">
            <div className="preview-bottom-section">
              <div className="preview-bottom-title">【備考】</div>
              <div className="preview-bottom-body preserve-whitespace">
                {data.notes || ''}
              </div>
            </div>
            {data.bankInfo && (
              <div className="preview-bottom-section">
                <div className="preview-bottom-body preserve-whitespace">
                  {data.bankInfo}
                </div>
              </div>
            )}
          </div>

          <div className="preview-bottom-right">
            <div className="preview-calc-row">
              <span>小計 (税抜)</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="preview-calc-row discount">
                <span>値引き</span>
                <span>- {formatCurrency(totals.discount)}</span>
              </div>
            )}
            {totals.shipping > 0 && (
              <div className="preview-calc-row">
                <span>送料</span>
                <span>{formatCurrency(totals.shipping)}</span>
              </div>
            )}
            <div className="preview-calc-row">
              <span>消費税 (10%)</span>
              <span>{formatCurrency(totals.tax10Amount)}</span>
            </div>
            <div className="preview-calc-row">
              <span>消費税 (8%)</span>
              <span>{formatCurrency(totals.tax8Amount)}</span>
            </div>
            <div className="preview-calc-row grand-total">
              <span>合計</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="preview-page-number">1/1</div>
      </div>
    </div>
  );
}
