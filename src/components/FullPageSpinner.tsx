import './FullPageSpinner.css';

const FullPageSpinner = () => (
    <div className="full-page-spinner">
        <div className="full-page-spinner__spinner" aria-hidden="true"/>
        <span className="full-page-spinner__label">Even geduld...</span>
    </div>
);

export default FullPageSpinner;
