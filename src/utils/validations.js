const validateEditData = (req) => {
  const editableFields = [
    "age",
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    editableFields.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = { validateEditData };
