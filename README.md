## Documentation

### **Overview**

This set of methods is designed to validate certain aspects of data structures, specifically focusing on verifying the presence, uniqueness, and validity of `refKey` references. These references are common in nested data structures, where entities refer to others by a unique identifier.

---

### **Validation Results Structure**

Before diving into the validation methods, let's understand the `validationResults` structure. This object is used to store and return validation results from the validation methods.

```javascript
const validationResults = {
    passed: true,
    errors: [],
    errorCount: 0,
};
```

- `passed`: A boolean indicating whether the validation passed without errors.
- `errors`: An array of error objects, each detailing a specific validation error.
- `errorCount`: A count of the total errors encountered.

---

### **`validateAfdRefKey(obj, validationResults, path='')`**

This method focuses on the validation of the `refKey` property within arrays in an object. It ensures:

1. The `refKey` property is present.
2. The `refKey` is not empty.
3. The `refKey` is unique within its scope.

**Parameters**:
- `obj`: The object to validate.
- `validationResults`: An existing results object where validation findings will be stored.
- `path`: Current traversal path (used mainly for recursion and error reporting).

**Example**:

```javascript
const data = {
    items: [
        { refKey: "A", name: "Item A" },
        { refKey: "B", name: "Item B" },
        { name: "Item without refKey" },
        { refKey: "B", name: "Duplicate Item B" }
    ]
};

validateAfdRefKey(data, validationResults);
```

The above example will report errors for the missing `refKey` and the duplicate `refKey`.

---

### **`getValueFromPath(data, path)`**

This utility method is used to retrieve values from a specified path within an object. It's especially useful when the path traverses both object properties and array indices.

**Parameters**:
- `data`: The root data object.
- `path`: A string specifying the path from which to retrieve values.

**Returns**:
An array of values found at the specified path.

**Example**:

```javascript
const data = {
    group: {
        items: [{ refKey: "A" }, { refKey: "B" }]
    }
};

const values = getValueFromPath(data, "group.items");
console.log(values);  // Outputs: [{ refKey: "A" }, { refKey: "B" }]
```

---

### **`validateAfdReferences(data, fromPath, toPath, validationResults)`**

This method is designed to validate references between two paths in a data structure. It ensures that every reference in the source path exists in the target path's `refKeys`.

**Parameters**:
- `data`: The main data object.
- `fromPath`: The path pointing to the source of the references.
- `toPath`: The path pointing to the target where references should exist.
- `validationResults`: An existing results object where validation findings will be stored.

**Example**:

```javascript
const data = {
    user: [
        { refKey: "U1", name: "John", groupRef: ["G1"] },
        { refKey: "U2", name: "Jane", groupRef: ["G2", "G3"] }
    ],
    group: [
        { refKey: "G1", name: "Admins" },
        { refKey: "G2", name: "Users" }
    ]
};

validateAfdReferences(data, "user", "group", validationResults);
```

The above example will report an error because the user "Jane" has a reference to a non-existent group "G3".

---

These methods together form a robust system for validating and ensuring the integrity of nested data structures with `refKey` references.
The referencing key property must conform with the logic ```{object-name}Ref```. E.g., ```group``` reference in ```user```, will be ```groupRef```.
