const Notification = ({ successMessage, errorMessage }) => {
  if (successMessage !== null) {
    return <div className="success">{successMessage}</div>;
  }
  if (errorMessage !== null) {
    return <div className="error">{errorMessage}</div>;
  }

  // return <div className="success">{successMessage}</div>;
};

export default Notification;
