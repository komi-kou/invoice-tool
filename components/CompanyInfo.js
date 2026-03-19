'use client';

export default function CompanyInfo({ data, updateField, handleLogoUpload, handleStampUpload }) {
  return (
    <fieldset className="form-section">
      <legend>🏢 自社情報</legend>
      
      <div className="form-group">
        <label htmlFor="companyName">会社名 / 屋号</label>
        <input
          id="companyName"
          type="text"
          value={data.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder="株式会社つなげる"
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyAddress">住所</label>
        <textarea
          id="companyAddress"
          value={data.companyAddress}
          onChange={(e) => updateField('companyAddress', e.target.value)}
          placeholder="〒000-0000&#10;東京都渋谷区..."
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyTel">電話番号</label>
          <input
            id="companyTel"
            type="text"
            value={data.companyTel}
            onChange={(e) => updateField('companyTel', e.target.value)}
            placeholder="03-XXXX-XXXX"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyEmail">メールアドレス</label>
          <input
            id="companyEmail"
            type="email"
            value={data.companyEmail}
            onChange={(e) => updateField('companyEmail', e.target.value)}
            placeholder="info@example.com"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="registrationNumber">インボイス登録番号</label>
        <input
          id="registrationNumber"
          type="text"
          value={data.registrationNumber}
          onChange={(e) => updateField('registrationNumber', e.target.value)}
          placeholder="T1234567890123"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>ロゴ画像</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogoUpload(e.target.files[0])}
              className="file-input"
            />
            {data.logoUrl && (
              <div className="image-preview-small">
                <img src={data.logoUrl} alt="ロゴ" />
                <button type="button" className="btn-remove-image" onClick={() => updateField('logoUrl', '')}>✕</button>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>印鑑画像</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleStampUpload(e.target.files[0])}
              className="file-input"
            />
            {data.stampUrl && (
              <div className="image-preview-small">
                <img src={data.stampUrl} alt="印鑑" />
                <button type="button" className="btn-remove-image" onClick={() => updateField('stampUrl', '')}>✕</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
