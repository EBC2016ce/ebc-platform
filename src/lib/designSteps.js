export const PROJECT_TYPES = ["New home", "Kitchen renovation", "Bathroom renovation", "Laundry renovation"]

export const STEPS_BY_TYPE = {
  "New home": [
    {
      id: "project", title: "Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "landStatus", label: "Land status", type: "select", options: ["I own the land", "Still looking for land", "Land + house package"] },
      ],
    },
    {
      id: "land", title: "Land & Site",
      fields: [
        { key: "lotWidth", label: "Lot width (m)", type: "number" },
        { key: "lotDepth", label: "Lot depth (m)", type: "number" },
        { key: "slope", label: "Slope", type: "select", options: ["Flat", "Mild slope", "Steep slope", "Not sure"] },
      ],
    },
    {
      id: "bedrooms", title: "Bedrooms",
      fields: [
        { key: "bedroomCount", label: "Number of bedrooms", type: "select", options: ["2", "3", "4", "5", "6+"] },
        { key: "masterLocation", label: "Master bedroom location", type: "select", options: ["Ground floor", "Upper floor", "No preference"] },
      ],
    },
    {
      id: "bathrooms", title: "Bathrooms",
      fields: [
        { key: "bathroomCount", label: "Number of bathrooms", type: "select", options: ["1", "2", "3", "4+"] },
        { key: "ensuite", label: "Ensuite to master?", type: "radio", options: ["Yes", "No"] },
      ],
    },
    {
      id: "living", title: "Living Areas",
      fields: [
        { key: "livingZones", label: "Living zones wanted", type: "multiselect", options: ["Open-plan living/dining", "Separate formal lounge", "Media room", "Home office"] },
      ],
    },
    {
      id: "kitchen", title: "Kitchen",
      fields: [
        { key: "kitchenLayout", label: "Layout style", type: "select", options: ["Island", "Galley", "U-shaped", "Butler's pantry + island"] },
      ],
    },
    {
      id: "garage", title: "Garage & Parking",
      fields: [
        { key: "carSpaces", label: "Car spaces", type: "select", options: ["1", "2", "3", "4+"] },
      ],
    },
    {
      id: "outdoor", title: "Outdoor",
      fields: [
        { key: "alfresco", label: "Alfresco / outdoor living area?", type: "radio", options: ["Yes", "No"] },
        { key: "pool", label: "Pool", type: "radio", options: ["Yes", "Maybe later", "No"] },
      ],
    },
    {
      id: "style", title: "Style",
      fields: [
        { key: "archStyle", label: "Architectural style", type: "select", options: ["Modern / contemporary", "Hamptons", "Farmhouse", "Classic / traditional", "Minimalist"] },
      ],
    },
    {
      id: "special", title: "Special Requirements",
      fields: [
        { key: "accessibility", label: "Accessibility needs", type: "textarea" },
        { key: "otherNotes", label: "Anything else we should know?", type: "textarea" },
      ],
    },
    {
      id: "budget", title: "Budget & Timing",
      fields: [
        { key: "budgetRange", label: "Budget range", type: "select", options: ["Under $400k", "$400k-$600k", "$600k-$800k", "$800k-$1M", "$1M+"] },
      ],
    },
  ],

  "Kitchen renovation": [
    {
      id: "project", title: "Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "existingHomeAge", label: "Approximate age of the existing home", type: "select", options: ["Under 10 years", "10-30 years", "30-60 years", "60+ years", "Not sure"] },
        { key: "structuralChanges", label: "Expecting structural changes (removing walls etc.)?", type: "radio", options: ["Yes", "No", "Not sure"] },
      ],
    },
    {
      id: "kitchen", title: "Kitchen Details",
      fields: [
        { key: "kitchenWidth", label: "Kitchen width (m)", type: "number" },
        { key: "kitchenLength", label: "Kitchen length (m)", type: "number" },
        { key: "kitchenLayout", label: "Layout style", type: "select", options: ["Island", "Galley", "U-shaped", "Butler's pantry + island"] },
        { key: "kitchenFeatures", label: "Wanted features", type: "multiselect", options: ["Gas cooktop", "Induction cooktop", "Walk-in pantry", "Integrated fridge", "Butler's pantry"] },
      ],
    },
    {
      id: "materials", title: "Materials & Finishes",
      fields: [
        { key: "benchtop", label: "Benchtop", type: "select", options: ["Stone", "Laminate", "Timber", "Concrete"] },
        { key: "splashback", label: "Splashback", type: "select", options: ["Glass", "Tiles", "Match benchtop stone"] },
        { key: "doorMaterial", label: "Cabinet door material", type: "select", options: ["Laminate", "2-pack polyurethane", "Timber veneer", "Matte two-tone"] },
        { key: "handles", label: "Handles", type: "select", options: ["Brushed brass", "Matte black", "Chrome", "Handle-less (push)"] },
        { key: "extraAccessories", label: "Extra accessories", type: "multiselect", options: ["Soft-close drawers", "Pull-out pantry", "Integrated bin", "LED under-cabinet lighting", "Integrated appliances"] },
      ],
    },
    {
      id: "compliance", title: "Compliance & Finishing",
      fields: [
        { key: "complianceCertificates", label: "Compliance certificates needed", type: "multiselect", options: ["Plumbing compliance certificate", "Electrical compliance certificate", "Not sure - EBC to advise"] },
        { key: "finishingTrades", label: "Finishing trades to arrange", type: "multiselect", options: ["Painting", "Plastering", "Flooring", "None - I'll arrange myself"] },
      ],
    },
    {
      id: "budget", title: "Budget & Timing",
      fields: [
        { key: "budgetRange", label: "Budget range", type: "select", options: ["$10k-$25k", "$25k-$50k", "$50k-$75k", "$75k-$100k", "$100k-$150k", "$150k-$200k"] },
      ],
    },
  ],

  "Bathroom renovation": [
    {
      id: "project", title: "Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "existingHomeAge", label: "Approximate age of the existing home", type: "select", options: ["Under 10 years", "10-30 years", "30-60 years", "60+ years", "Not sure"] },
        { key: "structuralChanges", label: "Expecting structural changes (removing walls etc.)?", type: "radio", options: ["Yes", "No", "Not sure"] },
      ],
    },
    {
      id: "bathroom", title: "Bathroom Details",
      fields: [
        { key: "bathroomWidth", label: "Bathroom width (m)", type: "number" },
        { key: "bathroomLength", label: "Bathroom length (m)", type: "number" },
        { key: "tileSize", label: "Tile size (floor & wall)", type: "select", options: ["600x600mm", "600x1200mm", "800x800mm"] },
      ],
    },
    {
      id: "fixtures", title: "Fixtures",
      fields: [
        { key: "vanity", label: "Vanity", type: "select", options: ["Floating white", "Timber", "Matte black", "Two-tone"] },
        { key: "vanityBenchtop", label: "Vanity benchtop", type: "select", options: ["Stone", "Laminate", "Timber"] },
        { key: "bathtub", label: "Bathtub", type: "select", options: ["Freestanding", "Built-in / drop-in", "Not required"] },
        { key: "showerScreen", label: "Shower screen", type: "select", options: ["Frameless glass", "Semi-frameless", "Framed"] },
        { key: "toilet", label: "Toilet", type: "select", options: ["Wall-mounted", "Concealed cistern", "Floor-mounted"] },
      ],
    },
    {
      id: "finishes", title: "Tiles, Taps & Finishes",
      fields: [
        { key: "floorTiles", label: "Floor tiles", type: "select", options: ["Light neutral", "Grey stone-look", "Dark charcoal", "Timber-look"] },
        { key: "wallTiles", label: "Wall tiles", type: "select", options: ["White subway", "Grey stone-look", "Feature mosaic", "Large format"] },
        { key: "taps", label: "Taps", type: "select", options: ["Chrome", "Matte black", "Brushed brass", "Brushed nickel"] },
        { key: "heater", label: "Heater", type: "select", options: ["Heat lamp (4-light)", "Heat lamp (3-light)", "Panel heater", "Not required"] },
        { key: "floorHeater", label: "In-floor heating?", type: "radio", options: ["Yes", "No"] },
      ],
    },
    {
      id: "compliance", title: "Compliance & Finishing",
      fields: [
        { key: "complianceCertificates", label: "Compliance certificates needed", type: "multiselect", options: ["Plumbing compliance certificate", "Electrical compliance certificate", "Waterproofing certificate", "Not sure - EBC to advise"] },
        { key: "finishingTrades", label: "Finishing trades to arrange", type: "multiselect", options: ["Painting", "Plastering", "Flooring", "None - I'll arrange myself"] },
      ],
    },
    {
      id: "budget", title: "Budget & Timing",
      fields: [
        { key: "budgetRange", label: "Budget range", type: "select", options: ["$10k-$20k", "$20k-$35k", "$35k-$50k", "$50k-$65k", "$65k-$80k"] },
      ],
    },
  ],

  "Laundry renovation": [
    {
      id: "project", title: "Project",
      fields: [
        { key: "timeframe", label: "Timeframe to start", type: "select", options: ["0-3 months", "3-6 months", "6-12 months", "12+ months"] },
        { key: "existingHomeAge", label: "Approximate age of the existing home", type: "select", options: ["Under 10 years", "10-30 years", "30-60 years", "60+ years", "Not sure"] },
        { key: "structuralChanges", label: "Expecting structural changes (removing walls etc.)?", type: "radio", options: ["Yes", "No", "Not sure"] },
      ],
    },
    {
      id: "laundry", title: "Laundry Details",
      fields: [
        { key: "laundryWidth", label: "Laundry width (m)", type: "number" },
        { key: "laundryLength", label: "Laundry length (m)", type: "number" },
        { key: "tileSize", label: "Tile size (floor & wall)", type: "select", options: ["600x600mm", "600x1200mm", "800x800mm"] },
        { key: "layout", label: "Layout", type: "select", options: ["Internal, separate room", "Internal, walk-through", "External / mudroom combo"] },
      ],
    },
    {
      id: "fixtures", title: "Fixtures & Finishes",
      fields: [
        { key: "joinery", label: "Joinery", type: "select", options: ["White", "Grey", "Timber", "Two-tone"] },
        { key: "trough", label: "Trough", type: "select", options: ["Stainless steel", "Ceramic white", "Composite grey"] },
        { key: "taps", label: "Taps", type: "select", options: ["Chrome", "Matte black", "Brushed brass", "Brushed nickel"] },
        { key: "toilet", label: "Toilet", type: "select", options: ["Wall-mounted", "Concealed cistern", "Floor-mounted", "Not required"] },
        { key: "extraAccessories", label: "Extra accessories", type: "multiselect", options: ["Built-in ironing board", "Fold-down bench", "Pet wash station", "Drying rack"] },
      ],
    },
    {
      id: "compliance", title: "Compliance & Finishing",
      fields: [
        { key: "complianceCertificates", label: "Compliance certificates needed", type: "multiselect", options: ["Plumbing compliance certificate", "Electrical compliance certificate", "Waterproofing certificate", "Not sure - EBC to advise"] },
        { key: "finishingTrades", label: "Finishing trades to arrange", type: "multiselect", options: ["Painting", "Plastering", "Flooring", "None - I'll arrange myself"] },
      ],
    },
    {
      id: "budget", title: "Budget & Timing",
      fields: [
        { key: "budgetRange", label: "Budget range", type: "select", options: ["$10k-$20k", "$20k-$35k", "$35k-$50k", "$50k-$65k", "$65k-$80k"] },
      ],
    },
  ],
}
