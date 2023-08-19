//Generated using ChatGPT 4 Code Inspector
function transformAfdMasterAgreementToPolicySuperStructure(source) {
    // Step 1 & 2: Extract policies from masterAgreement and move to root
    let extractedPolicies = [];
    let extractedParties = source.party ? [...source.party] : [];  // Initialize with root parties if they exist
    
    source.masterAgreement.forEach(ma => {
        // Extract policies and add masterAgreementRef
        ma.policy.forEach(p => {
            p.masterAgreementRef = [ma.refKey];
            extractedPolicies.push(p);
        });
        // Generate policyRef for masterAgreement
        ma.policyRef = ma.policy.map(p => p.refKey);
        // Remove the policy from masterAgreement as it's now at root
        delete ma.policy;

        // Check and extract parties
        if (ma.party) {
            extractedParties = extractedParties.concat(ma.party);
            delete ma.party;
        }
    });

    // Add extracted policies and parties to the root
    source.policy = extractedPolicies;
    source.party = extractedParties;

    return source;
}
