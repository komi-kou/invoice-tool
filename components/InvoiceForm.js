'use client';

import CompanyInfo from './CompanyInfo';
import DocumentSettings from './DocumentSettings';
import LineItems from './LineItems';
import Summary from './Summary';

export default function InvoiceForm({ data, updateField, updateItem, addItem, removeItem, moveItemUp, moveItemDown, duplicateItem, handleLogoUpload, handleStampUpload }) {
  return (
    <div className="editor-pane">
      <CompanyInfo
        data={data}
        updateField={updateField}
        handleLogoUpload={handleLogoUpload}
        handleStampUpload={handleStampUpload}
      />
      <DocumentSettings data={data} updateField={updateField} />
      <LineItems
        data={data}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        moveItemUp={moveItemUp}
        moveItemDown={moveItemDown}
        duplicateItem={duplicateItem}
      />
      <Summary data={data} updateField={updateField} />
    </div>
  );
}
