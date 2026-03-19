/**
 * 請求書計算ユーティリティ
 * インボイス制度対応：10%/8%/非課税の区分別計算
 */

/**
 * 端数処理
 * @param {number} value - 処理対象の数値
 * @param {string} method - 'floor'(切り捨て) | 'ceil'(切り上げ) | 'round'(四捨五入)
 * @returns {number}
 */
export function applyRounding(value, method = 'floor') {
  switch (method) {
    case 'ceil':
      return Math.ceil(value);
    case 'round':
      return Math.round(value);
    case 'floor':
    default:
      return Math.floor(value);
  }
}

/**
 * 明細行の小計を計算
 * @param {Object} item - { unitPrice, quantity }
 * @returns {number}
 */
export function calcLineTotal(item) {
  const price = Number(item.unitPrice) || 0;
  const qty = Number(item.quantity) || 0;
  return price * qty;
}

/**
 * 全明細から集計情報を算出
 * @param {Array} items - 明細行配列
 * @param {string} roundingMethod - 端数処理方法
 * @param {number} discount - 値引き額
 * @param {number} shipping - 送料
 * @returns {Object} { subtotal, tax10Amount, tax8Amount, tax10Base, tax8Base, taxTotal, total, totalBeforeTax }
 */
export function calcInvoiceTotals(items, roundingMethod = 'floor', discount = 0, shipping = 0) {
  let tax10Base = 0;
  let tax8Base = 0;
  let taxFreeBase = 0;

  items.forEach((item) => {
    const lineTotal = calcLineTotal(item);
    switch (item.taxRate) {
      case '10':
        tax10Base += lineTotal;
        break;
      case '8':
        tax8Base += lineTotal;
        break;
      case '0':
      default:
        taxFreeBase += lineTotal;
        break;
    }
  });

  const subtotal = tax10Base + tax8Base + taxFreeBase;
  const tax10Amount = applyRounding(tax10Base * 0.1, roundingMethod);
  const tax8Amount = applyRounding(tax8Base * 0.08, roundingMethod);
  const taxTotal = tax10Amount + tax8Amount;
  const discountNum = Number(discount) || 0;
  const shippingNum = Number(shipping) || 0;
  const totalBeforeTax = subtotal - discountNum + shippingNum;
  const total = totalBeforeTax + taxTotal;

  return {
    subtotal,
    tax10Base,
    tax8Base,
    taxFreeBase,
    tax10Amount,
    tax8Amount,
    taxTotal,
    totalBeforeTax,
    discount: discountNum,
    shipping: shippingNum,
    total,
  };
}

/**
 * 数値を日本円フォーマットで表示
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  const num = Number(value) || 0;
  return '¥' + num.toLocaleString('ja-JP');
}

/**
 * 日付文字列を日本語表記に変換
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}
