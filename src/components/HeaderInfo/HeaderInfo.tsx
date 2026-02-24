const HeaderInfo = ({ label, value }) => (
  <div className="tw-flex tw-gap-x-3 tw-mb-4">
    <p className="tw-text-gray-500">{label}:</p>
    <p className="tw-text-slate-800">{value}</p>
  </div>
);

export default HeaderInfo;