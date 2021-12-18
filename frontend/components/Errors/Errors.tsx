const Errors = (errors: Record<string, string>) => {
  let errorList = [];
  for (var key of Object.keys(errors)) {
    errorList.push(errors[key]);
  }

  return (
    <div className="mt-3">
      {errorList.map((error) => (
        <p key={error} className="alert alert-danger">
          {error}
        </p>
      ))}
    </div>
  );
};

export default Errors;
