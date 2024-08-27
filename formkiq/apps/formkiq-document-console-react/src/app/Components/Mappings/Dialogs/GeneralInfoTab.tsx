import { Mapping } from '../../../helpers/types/mappings';

function GeneralInfoTab({
  mapping,
  setMapping,
  mappingNameRef,
}: {
  mapping: Partial<Mapping>;
  setMapping: (mapping: any) => void;
  mappingNameRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <>
      <input
        type="text"
        className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
        placeholder="Add mapping name"
        required
        value={mapping.name}
        onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
        ref={mappingNameRef}
      />
      <textarea
        className="h-24 px-4 py-2 border border-neutral-300 text-sm rounded-md"
        placeholder="Add mapping description"
        value={mapping.description}
        onChange={(e) =>
          setMapping({ ...mapping, description: e.target.value })
        }
      />
    </>
  );
}

export default GeneralInfoTab;
