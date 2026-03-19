'use client';

import { useState } from 'react';
import { useInvoice } from '@/hooks/useInvoice';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';

export default function Home() {
  const invoice = useInvoice();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveList, setSaveList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // トースト通知
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // PDF印刷
  const handlePrint = () => {
    window.print();
  };

  // 保存ダイアログ
  const handleSaveOpen = () => {
    setSaveName('');
    setShowSaveModal(true);
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    invoice.saveToLocal(saveName.trim());
    setShowSaveModal(false);
    showToast(`「${saveName.trim()}」を保存しました`);
  };

  // 読込ダイアログ
  const handleLoadOpen = () => {
    setSaveList(invoice.getSaveList());
    setShowLoadModal(true);
  };

  const handleLoad = (name) => {
    invoice.loadFromLocal(name);
    setShowLoadModal(false);
    showToast(`「${name}」を読み込みました`);
  };

  const handleDelete = (name) => {
    if (confirm(`「${name}」を削除してよろしいですか？`)) {
      invoice.deleteSave(name);
      setSaveList(invoice.getSaveList());
      showToast(`「${name}」を削除しました`);
    }
  };

  // リセット
  const handleReset = () => {
    if (confirm('入力内容をすべてリセットしますか？')) {
      invoice.resetData();
      showToast('リセットしました');
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <header className="app-header no-print">
        <div className="header-left">
          <h1 className="header-title">📄 請求書メーカー</h1>
          <span className="header-badge">Pro</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleReset} title="リセット">
            🔄 リセット
          </button>
          <button className="btn btn-secondary" onClick={handleLoadOpen}>
            📂 読込
          </button>
          <button className="btn btn-secondary" onClick={handleSaveOpen}>
            💾 保存
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ PDF / 印刷
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="app-main">
        <div className="editor-side no-print">
          <InvoiceForm
            data={invoice.data}
            updateField={invoice.updateField}
            updateItem={invoice.updateItem}
            addItem={invoice.addItem}
            removeItem={invoice.removeItem}
            moveItemUp={invoice.moveItemUp}
            moveItemDown={invoice.moveItemDown}
            duplicateItem={invoice.duplicateItem}
            handleLogoUpload={invoice.handleLogoUpload}
            handleStampUpload={invoice.handleStampUpload}
          />
        </div>
        <div className="preview-side">
          <InvoicePreview data={invoice.data} />
        </div>
      </main>

      {/* 保存モーダル */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">💾 データを保存</h2>
            <div className="form-group">
              <label htmlFor="save-name">保存名</label>
              <input
                id="save-name"
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="例: 3月分 ○○様"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowSaveModal(false)}>キャンセル</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!saveName.trim()}>保存する</button>
            </div>
          </div>
        </div>
      )}

      {/* 読込モーダル */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">📂 保存データ一覧</h2>
            {saveList.length === 0 ? (
              <p className="modal-empty">保存されたデータはありません</p>
            ) : (
              <div className="save-list">
                {saveList.map((item) => (
                  <div key={item.name} className="save-list-item">
                    <div className="save-list-info">
                      <span className="save-list-name">{item.name}</span>
                      <span className="save-list-date">
                        {new Date(item.savedAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    <div className="save-list-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleLoad(item.name)}>読込</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.name)}>削除</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowLoadModal(false)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* トースト通知 */}
      {toastMessage && (
        <div className="toast">{toastMessage}</div>
      )}
    </>
  );
}
