import React, { useEffect, useState } from 'react';
import { DocumentsService } from '../../../helpers/services/documentsService';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';

interface LocaleOption {
  locale: string;
}

interface LocaleLinkBuilderProps {
  siteId: string;
  // current values from your schema/classification context:
  itemType: 'SCHEMA' | 'CLASSIFICATION' | 'INTERFACE';
  attributeKey?: string;
  classificationId?: string;
  interfaceKey?: string;
}

const LocaleLinkBuilder: React.FC<LocaleLinkBuilderProps> = ({
  siteId,
  itemType,
  attributeKey,
  classificationId,
  interfaceKey,
}) => {
  const [locales, setLocales] = useState<LocaleOption[]>([]);
  const [selectedLocale, setSelectedLocale] = useState<string>('');

  // Fetch locales on mount.
  useEffect(() => {
    DocumentsService.getLocales(siteId)
      .then((response) => {
        if (response && response.locales) {
          setLocales(response.locales);
        }
      })
      .catch((err) => console.error('Error fetching locales', err));
  }, [siteId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocale(e.target.value);
  };

  const handleGoClick = () => {
    if (!selectedLocale) return;
    const params = new URLSearchParams();
    params.set('itemType', itemType);
    if (attributeKey) {
      params.set('attributeKey', attributeKey);
    }
    if (classificationId) {
      params.set('classificationId', classificationId);
    }
    if (interfaceKey) {
      params.set('interfaceKey', interfaceKey);
    }
    const url = `/locales/${selectedLocale}?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="my-4">
      <label className="block text-sm font-bold mb-1">
        View/Edit Values for Locale:
      </label>
      <div className="flex gap-2">
        <select
          className="w-64 p-2 border border-neutral-300 rounded"
          value={selectedLocale}
          onChange={handleSelectChange}
        >
          <option value="">-- Choose Locale --</option>
          {locales.map((loc) => (
            <option key={loc.locale} value={loc.locale}>
              {loc.locale}
            </option>
          ))}
        </select>

        <ButtonPrimaryGradient
          type="button"
          className="py-2"
          onClick={handleGoClick}
        >
          Go
        </ButtonPrimaryGradient>
      </div>
    </div>
  );
};

export default LocaleLinkBuilder;
