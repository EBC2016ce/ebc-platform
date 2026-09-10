export const PROJECT_TYPES = ["New home", "Kitchen renovation", "Bathroom renovation", "Laundry renovation", "Extension", "Other"]

const AUSTRALIAN_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"]

export const STEPS_BY_TYPE = {
  "New home": [
    {
      id: "type", title: "New Building",
      fields: [
        { key: "buildType", label: "Knockdown & rebuild or Vacant land?", type: "select", options: ["Knockdown & rebuild", "Vacant land"] },
      ],
    },
    {
      id: "address", title: "Site Address",
      fields: [
        { key: "streetNo", label: "Street No", type: "text" },
        { key: "streetName", label: "Street Name", type: "text" },
        { key: "state", label: "State", type: "select", options: AUSTRALIAN_STATES },
        { key: "postalCode", label: "Postal Code", type: "text" },
      ],
    },
    {
      id: "permit", title: "Planning Permit",
      fields: [
        { key: "hasPlanningPermit", label: "Have you obtained a planning permit?", type: "radio", options: ["Yes", "No", "I do not need a planning permit"] },
      ],
    },
    {
      id: "plans", title: "Final Plans",
      fields: [
        { key: "hasFinalPlans", label: "Have you got your final plans?", type: "radio", options: ["Yes", "No"] },
      ],
    },
    {
      id: "timing", title: "Timing",
      fields: [
        { key: "timeframe", label: "What is your timeframe to start?", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
      ],
    },
  ],

  "Kitchen renovation": [
    {
      id: "address", title: "Site Address",
      fields: [
        { key: "streetNo", label: "Street No", type: "text" },
        { key: "streetName", label: "Street Name", type: "text" },
        { key: "state", label: "State", type: "select", options: AUSTRALIAN_STATES },
        { key: "postalCode", label: "Postal Code", type: "text" },
      ],
    },
    {
      id: "structural", title: "Structural Changes",
      fields: [
        { key: "structuralChanges", label: "Does this involve structural changes (removing/moving walls)?", type: "radio", options: ["Yes", "No", "Not sure"] },
      ],
    },
    {
      id: "plans", title: "Final Plans",
      fields: [
        { key: "hasFinalPlans", label: "Have you got your final plans?", type: "radio", options: ["Yes", "No"] },
      ],
    },
    {
      id: "timing", title: "Timing",
      fields: [
        { key: "timeframe", label: "What is your timeframe to start?", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
      ],
    },
  ],

  "Extension": [
    {
      id: "project", title: "Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "existingHomeAge", label: "Approximate age of the existing home", type: "select", options: ["Under 10 years", "10-30 years", "30-60 years", "60+ years", "Not sure"] },
        { key: "extensionType", label: "What are you extending?", type: "select", options: ["Second storey addition", "Ground floor extension", "Alfresco / outdoor extension", "Garage extension"] },
      ],
    },
    {
      id: "connection", title: "How It Connects",
      fields: [
        { key: "roofConnection", label: "Roof connection style", type: "select", options: ["Matching existing roofline", "Flat roof connection", "Skillion roof", "Not sure - EBC to advise"] },
        { key: "structuralChanges", label: "Expecting structural changes to the existing home (removing walls etc.)?", type: "radio", options: ["Yes", "No", "Not sure"] },
        { key: "matchExisting", label: "Match the existing home's external materials/style?", type: "radio", options: ["Yes, match existing", "No, different style is fine", "Not sure"] },
      ],
    },
    {
      id: "rooms", title: "What's Being Added",
      fields: [
        { key: "extensionWidth", label: "Approximate extension width (m)", type: "number" },
        { key: "extensionLength", label: "Approximate extension length (m)", type: "number" },
        { key: "roomsAdded", label: "Rooms/spaces being added", type: "multiselect", options: ["Bedroom", "Bathroom", "Living area", "Kitchen", "Home office", "Garage"] },
      ],
    },
  ],

  "Other": [
    {
      id: "project", title: "Tell Us About Your Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "description", label: "Describe what you're planning", type: "textarea" },
      ],
    },
  ],
}
