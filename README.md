# Documentation

## SIVI All Finance Standard

SIVI AFS is the foundation for a digital ecosystem where customers can receive good service within the various distribution forms. It ensures good access to data and enables data exchange. Moreover, it facilitates digital collaboration with room for individual differences. This is an ambitious goal and will require attention and effort from the industry in the coming years. Simultaneously, it's a necessary agenda because an open digital ecosystem within our industry is a prerequisite for further development and innovation.

The aim of the SIVI All Finance Standard is to support digital business within financial services broadly. In this context, SIVI identifies three perspectives:

- **Data exchange**
- **Data registration**
- **Development of services**

All data-related agreements are documented in the All Finance Data Catalog (AFD). All agreements related to functions and processes are documented within the All Finance API framework (AFA).

https://www.sivi.org/standaarden/sivi-all-finance-standaard/

### Overview of this project
This set of methods is designed to validate certain aspects of data structures, specifically focusing on verifying the presence, uniqueness, and validity of `refKey` references. These references are common in nested data structures, where entities refer to others by a unique identifier.

[SIVI AFD2.0 Unique Identifiers & Referals](https://www.manula.com/manuals/sivi/sivi-all-finance-standard/1/en/topic/unique-identifiers)

---

### Validation Results Structure

Before diving into the validation methods, let's understand the `validationResults` structure. This object is used to store and return validation results from the validation methods.

```javascript
const validationResults = {
    errors: []
};
```

- `errors`: An array of error objects, each detailing a specific validation error.

---

### `validateAfdRefKey(obj, validationResults, path='')`

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

### `getValueFromPath(data, path)`

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

### `validateAfdReferences(data, fromPath, toPath, validationResults)`

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

---

## `transformAfdMasterAgreementToPolicySuperStructure` Function

The `transformAfdMasterAgreementToPolicySuperStructure` function transforms a source object that contains master agreements into a super structure where policies are moved to the root of the source object.

### Parameters

- **source** (Object): The source object containing master agreements and other properties.

### Steps:

1. **Extract Policies from masterAgreement**: For each master agreement within the source, the associated policies are extracted.
2. **Move Policies to Root**: The extracted policies are then moved to the root of the source object.
3. **Add masterAgreementRef**: A reference to the master agreement (using its `refKey`) is added to each policy.
4. **Generate policyRef for masterAgreement**: For each master agreement, a `policyRef` property is generated, containing references to its associated policies.
5. **Remove Policy from masterAgreement**: After moving policies to the root, the `policy` property is removed from each master agreement.
6. **Extract and Move Parties**: If a master agreement has associated parties, these are extracted and moved to the root. If parties already exist at the root, the extracted parties are concatenated to them.

### Returns:

- **Object**: The transformed source object with policies and parties (if any) at the root level.
---

## `revertPolicySuperStructureToAfdMasterAgreement` Function

The `revertPolicySuperStructureToAfdMasterAgreement` function reverts the changes made by transforming a source object into a policy superstructure. It moves the policies and parties from the root level back to their respective master agreements.

### Parameters

- **source** (Object): The source object containing policies and master agreements at the root level.

### Steps:

1. **Initial Checks**: The function first checks if the `policy` and `masterAgreement` properties exist in the source. If not, it logs an error and returns the source object without modifications.
2. **Create Master Agreement Map**: A map is created for quick lookup of master agreements using their `refKey`.
3. **Re-associate Policies**: Each policy at the root level is moved back to its associated master agreement based on the `masterAgreementRef`. The reference (`masterAgreementRef`) is then removed from the policy.
4. **Clean Up**: The `policy` property at the root is deleted after all policies have been moved. Additionally, the `policyRef` property in each master agreement is removed.
5. **Re-associate Parties**: If there are parties at the root level, they are associated with all master agreements (assuming they belong to all). The `party` property at the root is then deleted.

### Returns:

- **Object**: The reverted source object with policies and parties (if any) re-associated with their respective master agreements.

### Example Usage:

```javascript
const source = {
    policy: [...],
    masterAgreement: [...],
    party: [...]
};

const revertedSource = revertPolicySuperStructureToAfdMasterAgreement(source);
```

## `transform-afdMasterAgreement-to-policySuperStructure-jLio-script` JLio Script

The `transform-afdMasterAgreement-to-policySuperStructure-jLio-script` transforms a source json object that contains master agreements into a super structure where policies are moved to the root of the source object.

### Parameters

- **source** (Object): The source object containing master agreements and other properties.

### Steps:

1. **Set masterAgreementRef in every policy within it**: For each policy master agreement within the source, a new field masterAgreementRef is set to [] in the associated policies .
2. **Copy refKey of masterAgreement to masterAgreementRef of policies**: The value of the corresponding masterAgreemnt is copid in the masterAgreementRef of the policies.
3. **Copy policies refKey to policyRef of masterAgreement**: For each master agreement, a `policyRef` property is generated, containing references to its associated policies.
4. **Move Policies from masterAgreement**: The policies are moved from masterAgreement to the root.
5. **Move Parties from masterAgreement**: The parties are moved from masterAgreement to the root.

### Returns:

- **Object**: The transformed source object with policies and parties (if any) at the root level.
---
