'use client';

import { useState, useCallback } from 'react';

/**
 * 新しい明細行を生成
 */
function createNewItem() {
  return {
    id: Date.now() + Math.random(),
    name: '',
    unitPrice: '',
    quantity: '1',
    unit: '',
    taxRate: '10',
  };
}

/**
 * 今日の日付をYYYY-MM-DD形式で返す
 */
function getToday() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/**
 * 1ヶ月後の日付をYYYY-MM-DD形式で返す
 */
function getNextMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * デフォルトの請求書データ
 */
function getDefaultData() {
  return {
    // 自社情報
    companyName: '株式会社つなげる',
    companyAddress: '大分県大分市片島810-1',
    companyTel: '09087617976',
    companyEmail: '',
    registrationNumber: '',
    logoUrl: '',
    stampUrl: '',

    // 書類設定
    documentType: 'invoice',
    documentNumber: '',
    subject: '',
    issueDate: getToday(),
    dueDate: getNextMonth(),
    clientName: '',
    clientHonorific: '御中',

    // 明細
    items: [createNewItem()],

    // 計算設定
    roundingMethod: 'floor',
    discount: '',
    shipping: '',

    // その他
    notes: '',
    bankInfo: '',
  };
}

/**
 * 請求書データ管理カスタムフック
 */
export function useInvoice() {
  const [data, setData] = useState(getDefaultData);

  // フィールド更新
  const updateField = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 明細行を更新
  const updateItem = useCallback((id, field, value) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // 明細行を追加
  const addItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, createNewItem()],
    }));
  }, []);

  // 明細行を削除
  const removeItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.length > 1
        ? prev.items.filter((item) => item.id !== id)
        : prev.items,
    }));
  }, []);

  // 明細行を上に移動
  const moveItemUp = useCallback((index) => {
    if (index <= 0) return;
    setData((prev) => {
      const newItems = [...prev.items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return { ...prev, items: newItems };
    });
  }, []);

  // 明細行を下に移動
  const moveItemDown = useCallback((index) => {
    setData((prev) => {
      if (index >= prev.items.length - 1) return prev;
      const newItems = [...prev.items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return { ...prev, items: newItems };
    });
  }, []);

  // 明細行を複製
  const duplicateItem = useCallback((index) => {
    setData((prev) => {
      const newItem = { ...prev.items[index], id: Date.now() + Math.random() };
      const newItems = [...prev.items];
      newItems.splice(index + 1, 0, newItem);
      return { ...prev, items: newItems };
    });
  }, []);

  // ローカルストレージに保存
  const saveToLocal = useCallback((name) => {
    const saves = JSON.parse(localStorage.getItem('invoice_saves') || '{}');
    saves[name] = {
      data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('invoice_saves', JSON.stringify(saves));
  }, [data]);

  // ローカルストレージから読み込み
  const loadFromLocal = useCallback((name) => {
    const saves = JSON.parse(localStorage.getItem('invoice_saves') || '{}');
    if (saves[name]) {
      setData(saves[name].data);
      return true;
    }
    return false;
  }, []);

  // 保存一覧を取得
  const getSaveList = useCallback(() => {
    const saves = JSON.parse(localStorage.getItem('invoice_saves') || '{}');
    return Object.entries(saves).map(([name, val]) => ({
      name,
      savedAt: val.savedAt,
    }));
  }, []);

  // 保存データを削除
  const deleteSave = useCallback((name) => {
    const saves = JSON.parse(localStorage.getItem('invoice_saves') || '{}');
    delete saves[name];
    localStorage.setItem('invoice_saves', JSON.stringify(saves));
  }, []);

  // データをリセット
  const resetData = useCallback(() => {
    setData(getDefaultData());
  }, []);

  // ロゴ画像をDataURL化
  const handleLogoUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setData((prev) => ({ ...prev, logoUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  // 印鑑画像をDataURL化
  const handleStampUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setData((prev) => ({ ...prev, stampUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  return {
    data,
    setData,
    updateField,
    updateItem,
    addItem,
    removeItem,
    moveItemUp,
    moveItemDown,
    duplicateItem,
    saveToLocal,
    loadFromLocal,
    getSaveList,
    deleteSave,
    resetData,
    handleLogoUpload,
    handleStampUpload,
  };
}
