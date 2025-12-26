export interface MedicalHistoryEntry {
  id: string;
  petId: number;
  date: string; // ISO date string
  time?: string; // Optional time
  type:
    | 'consultation'
    | 'treatment'
    | 'vaccination'
    | 'surgery'
    | 'diagnostic'
    | 'note'
    | 'medication';
  title: string;
  diagnosis?: string;
  professional: {
    name: string;
    initials: string;
    role: string; // 'Veterinarian', 'Veterinary Technician', etc.
  };
  notes: string; // Professional notes
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  procedures?: string[];
  attachments?: Array<{
    type: 'image' | 'document' | 'lab-result';
    name: string;
    url: string;
  }>;
  followUp?: {
    date: string;
    notes: string;
  };
}

export const mockMedicalHistory: Record<number, MedicalHistoryEntry[]> = {
  1: [
    // Max - Golden Retriever
    {
      id: 'mh-1-1',
      petId: 1,
      date: '2024-01-15',
      time: '10:30 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No abnormalities detected',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination performed. Patient is in excellent health. Weight: 32.5kg (ideal for breed). Heart rate: 88 bpm, regular. Respiratory rate: 24 bpm, normal. Temperature: 38.5°C. All systems examined and found to be normal. Owner reports active lifestyle and good appetite.',
      procedures: [
        'Physical Examination',
        'Heart Auscultation',
        'Dental Check',
      ],
      followUp: {
        date: '2025-01-15',
        notes: 'Schedule next annual check-up',
      },
    },
    {
      id: 'mh-1-2',
      petId: 1,
      date: '2024-09-10',
      time: '2:15 PM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-001. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-10. Weight: 32.5kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-1-2b',
      petId: 1,
      date: '2024-10-15',
      time: '10:30 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-001. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-15. Weight: 32.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-1-2c',
      petId: 1,
      date: '2024-11-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-002. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-20. Weight: 32.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-1-3',
      petId: 1,
      date: '2023-12-20',
      time: '11:00 AM',
      type: 'treatment',
      title: 'Hip Osteoarthritis Treatment',
      diagnosis: 'Bilateral hip dysplasia with moderate osteoarthritis',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs confirm bilateral hip dysplasia with moderate OA changes. Patient showing signs of stiffness after exercise. Prescribed anti-inflammatory medication and joint supplements. Weight management plan initiated with target reduction of 3kg. Physical therapy exercises demonstrated to owner. Patient responded well to initial treatment.',
      medications: [
        {
          name: 'Carprofen',
          dosage: '2.2 mg/kg',
          frequency: 'BID with food',
          duration: '14 days, then re-evaluate',
        },
        {
          name: 'Glucosamine/Chondroitin',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing',
        },
      ],
      procedures: [
        'Radiographs - Bilateral Hips',
        'Physical Therapy Assessment',
      ],
      followUp: {
        date: '2024-01-20',
        notes: 'Recheck for treatment response and adjust medication if needed',
      },
    },
    {
      id: 'mh-1-4',
      petId: 1,
      date: '2023-11-05',
      time: '3:30 PM',
      type: 'diagnostic',
      title: 'Blood Work - Annual Panel',
      diagnosis: 'Normal blood values',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete blood count and comprehensive metabolic panel performed. All values within normal ranges. No abnormalities detected. Results indicate excellent overall health status.',
      attachments: [
        {
          type: 'lab-result',
          name: 'CBC Results - 2023-11-05.pdf',
          url: '/lab-results/cbc-2023-11-05.pdf',
        },
        {
          type: 'lab-result',
          name: 'CMP Results - 2023-11-05.pdf',
          url: '/lab-results/cmp-2023-11-05.pdf',
        },
      ],
    },
    {
      id: 'mh-1-5',
      petId: 1,
      date: '2023-09-18',
      time: '9:45 AM',
      type: 'surgery',
      title: 'Dental Cleaning and Extraction',
      diagnosis: 'Periodontal disease - Grade 2',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Routine dental cleaning performed under general anesthesia. One premolar (P3) extracted due to advanced periodontal disease. Remaining teeth cleaned and polished. Patient recovered well from anesthesia. Post-operative pain management prescribed. Owner advised on home dental care routine.',
      medications: [
        {
          name: 'Meloxicam',
          dosage: '0.1 mg/kg',
          frequency: 'Once daily',
          duration: '5 days',
        },
      ],
      procedures: [
        'Dental Cleaning',
        'Tooth Extraction - P3',
        'Dental Polishing',
      ],
      followUp: {
        date: '2023-09-25',
        notes: 'Post-operative check to ensure proper healing',
      },
    },
  ],
  3: [
    // Bella - Labrador
    {
      id: 'mh-3-1',
      petId: 3,
      date: '2024-11-15',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-003. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-15. Weight: 28.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-3-1b',
      petId: 3,
      date: '2024-12-01',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-003. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-01. Weight: 28.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  4: [
    // Charlie - Beagle
    {
      id: 'mh-4-1',
      petId: 4,
      date: '2024-01-08',
      time: '10:00 AM',
      type: 'treatment',
      title: 'Ear Infection Treatment',
      diagnosis: 'Bilateral external otitis',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Otoscopic exam revealed erythema, cerumen, and mild malodor bilaterally. Cytology shows mixed bacteria and yeast. Prescribed Otomax drops 5 drops BID in each ear for 10 days. Ear cleaning with Epi-Otic prior to medication. Recheck in 2 weeks.',
      medications: [
        {
          name: 'Otomax Drops',
          dosage: '5 drops',
          frequency: 'BID (twice daily)',
          duration: '10 days',
        },
        {
          name: 'Epi-Otic Cleaner',
          dosage: 'As needed',
          frequency: 'Before medication',
          duration: '10 days',
        },
      ],
      procedures: ['Otoscopic Examination', 'Ear Cytology'],
      followUp: {
        date: '2024-01-22',
        notes: 'Recheck ear condition and cytology if needed',
      },
    },
  ],
  2: [
    // Luna - Persian Cat
    {
      id: 'mh-2-1',
      petId: 2,
      date: '2024-01-20',
      time: '11:00 AM',
      type: 'consultation',
      title: 'Routine Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is calm and cooperative. Weight: 4.2kg (ideal). Heart rate: 140 bpm, regular. Respiratory rate: 30 bpm, normal. Temperature: 38.2°C. Eyes, ears, and teeth examined - all normal. Owner reports good appetite and normal behavior.',
      procedures: ['Physical Examination', 'Ophthalmic Exam', 'Dental Check'],
      followUp: {
        date: '2025-01-20',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-2-2',
      petId: 2,
      date: '2023-12-15',
      time: '3:30 PM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations up to date',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines administered. Patient tolerated vaccines well. Weight: 4.2kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-2-3',
      petId: 2,
      date: '2023-10-05',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Grooming and Mat Removal',
      diagnosis: 'Severe matting of fur',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Patient presented with severe matting in multiple areas, particularly around neck and hindquarters. Sedation required for safe removal. All mats removed without skin injury. Owner advised on regular grooming schedule (every 4-6 weeks) to prevent recurrence.',
      procedures: ['Sedation', 'Mat Removal', 'Full Grooming'],
      followUp: {
        date: '2023-11-05',
        notes: 'Recheck skin condition and grooming progress',
      },
    },
  ],
  3: [
    // Bella - Labrador (expand existing)
    {
      id: 'mh-3-1',
      petId: 3,
      date: '2024-01-12',
      time: '2:00 PM',
      type: 'consultation',
      title: 'Annual Vaccination Check',
      diagnosis: 'Healthy - Vaccinations current',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'DHPP, Rabies, and Bordetella boosters administered. Physical exam unremarkable. Heartworm test negative. Weight: 28.5kg (ideal). Dental cleaning recommended within 6 months. Next visit: 1 year.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-3-2',
      petId: 3,
      date: '2023-11-20',
      time: '10:30 AM',
      type: 'treatment',
      title: 'Skin Allergy Treatment',
      diagnosis: 'Atopic dermatitis',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Patient presenting with pruritus and erythema on abdomen and paws. Skin cytology shows no secondary infection. Prescribed antihistamine and topical treatment. Owner advised on environmental allergen management.',
      medications: [
        {
          name: 'Cetirizine',
          dosage: '10 mg',
          frequency: 'Once daily',
          duration: '14 days, then as needed',
        },
        {
          name: 'Hydrocortisone Cream',
          dosage: 'Apply thin layer',
          frequency: 'BID',
          duration: '7 days',
        },
      ],
      followUp: {
        date: '2023-12-20',
        notes: 'Recheck skin condition and response to treatment',
      },
    },
    {
      id: 'mh-3-3',
      petId: 3,
      date: '2023-08-15',
      time: '9:00 AM',
      type: 'surgery',
      title: 'Spay Procedure',
      diagnosis: 'Elective spay',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Routine ovariohysterectomy performed. Patient recovered well from anesthesia. Incision site clean with no complications. Post-operative pain management provided.',
      medications: [
        {
          name: 'Meloxicam',
          dosage: '0.1 mg/kg',
          frequency: 'Once daily',
          duration: '5 days',
        },
      ],
      procedures: ['Ovariohysterectomy', 'Pre-anesthetic Blood Work'],
      followUp: {
        date: '2023-08-22',
        notes: 'Post-operative check and suture removal',
      },
    },
  ],
  4: [
    // Charlie - Beagle (expand existing)
    {
      id: 'mh-4-1',
      petId: 4,
      date: '2024-01-08',
      time: '10:00 AM',
      type: 'treatment',
      title: 'Ear Infection Treatment',
      diagnosis: 'Bilateral external otitis',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Otoscopic exam revealed erythema, cerumen, and mild malodor bilaterally. Cytology shows mixed bacteria and yeast. Prescribed Otomax drops 5 drops BID in each ear for 10 days. Ear cleaning with Epi-Otic prior to medication. Recheck in 2 weeks.',
      medications: [
        {
          name: 'Otomax Drops',
          dosage: '5 drops',
          frequency: 'BID (twice daily)',
          duration: '10 days',
        },
        {
          name: 'Epi-Otic Cleaner',
          dosage: 'As needed',
          frequency: 'Before medication',
          duration: '10 days',
        },
      ],
      procedures: ['Otoscopic Examination', 'Ear Cytology'],
      followUp: {
        date: '2024-01-22',
        notes: 'Recheck ear condition and cytology if needed',
      },
    },
    {
      id: 'mh-4-2',
      petId: 4,
      date: '2023-12-10',
      time: '2:30 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is active and alert. Weight: 12.5kg (ideal). All systems normal. Heart rate: 100 bpm, regular. Dental health good.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2024-12-10',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-4-3',
      petId: 4,
      date: '2024-08-20',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-002. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-08-20. Weight: 12.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-4-4',
      petId: 4,
      date: '2024-09-05',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-001. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-09-05. Weight: 12.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-4-5',
      petId: 4,
      date: '2024-09-15',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Lyme Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Lyme vaccine administered. Batch: LYM-2024-001. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-15. Weight: 12.5kg.',
      medications: [
        {
          name: 'Lyme Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-4-6',
      petId: 4,
      date: '2024-10-01',
      time: '3:00 PM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-002. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-01. Weight: 12.5kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  5: [
    // Milo - Siamese Cat
    {
      id: 'mh-5-1',
      petId: 5,
      date: '2024-01-18',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Behavioral Consultation',
      diagnosis: 'Anxiety-related behaviors',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Owner reports increased vocalization and destructive behaviors. Physical exam normal. Discussed environmental enrichment and behavior modification strategies. Prescribed calming supplement.',
      medications: [
        {
          name: 'L-Theanine Supplement',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing',
        },
      ],
      followUp: {
        date: '2024-02-18',
        notes: 'Recheck behavior and response to treatment',
      },
    },
    {
      id: 'mh-5-2',
      petId: 5,
      date: '2023-12-05',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations current',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines administered. Patient was vocal but cooperative. Weight: 5.1kg. All vaccinations up to date.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
  ],
  6: [
    // Daisy - Bulldog
    {
      id: 'mh-6-1',
      petId: 6,
      date: '2024-01-14',
      time: '2:00 PM',
      type: 'consultation',
      title: 'Respiratory Check',
      diagnosis: 'Brachycephalic airway syndrome - mild',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Patient shows mild respiratory signs typical of brachycephalic breeds. No immediate intervention needed. Owner advised on weight management and avoiding heat stress. Weight: 22.5kg (slightly overweight - target: 20kg).',
      followUp: {
        date: '2024-04-14',
        notes: 'Recheck weight and respiratory function',
      },
    },
    {
      id: 'mh-6-2',
      petId: 6,
      date: '2023-12-20',
      time: '11:30 AM',
      type: 'treatment',
      title: 'Skin Fold Dermatitis Treatment',
      diagnosis: 'Intertrigo in facial folds',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Erythema and mild discharge in facial skin folds. Prescribed topical antimicrobial and cleaning routine. Owner instructed on daily cleaning of skin folds.',
      medications: [
        {
          name: 'Miconazole/Chlorhexidine Wipes',
          dosage: 'As directed',
          frequency: 'BID',
          duration: '14 days',
        },
      ],
      followUp: {
        date: '2024-01-03',
        notes: 'Recheck skin fold condition',
      },
    },
    {
      id: 'mh-6-3',
      petId: 6,
      date: '2024-10-25',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-004. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-10-25. Weight: 23kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-6-4',
      petId: 6,
      date: '2024-11-10',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-004. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-10. Weight: 23kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  7: [
    // Rocky - German Shepherd
    {
      id: 'mh-7-1',
      petId: 7,
      date: '2024-01-16',
      time: '10:00 AM',
      type: 'treatment',
      title: 'Hip Dysplasia Management',
      diagnosis: 'Bilateral hip dysplasia - moderate',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs confirm moderate bilateral hip dysplasia. Patient showing signs of stiffness after exercise. Prescribed joint supplements and anti-inflammatory medication. Weight management plan initiated. Physical therapy exercises demonstrated.',
      medications: [
        {
          name: 'Carprofen',
          dosage: '2.2 mg/kg',
          frequency: 'BID with food',
          duration: '14 days, then as needed',
        },
        {
          name: 'Glucosamine/Chondroitin/MSM',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing',
        },
      ],
      procedures: ['Radiographs - Bilateral Hips', 'Physical Assessment'],
      followUp: {
        date: '2024-02-16',
        notes: 'Recheck mobility and adjust treatment if needed',
      },
    },
    {
      id: 'mh-7-2',
      petId: 7,
      date: '2023-12-01',
      time: '2:00 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is alert and responsive. Weight: 38kg (ideal). Heart rate: 72 bpm, regular. All systems normal.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2024-12-01',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-7-3',
      petId: 7,
      date: '2024-09-20',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-010. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-20. Weight: 35kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-7-4',
      petId: 7,
      date: '2024-10-10',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-010. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-10-10. Weight: 35kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-7-5',
      petId: 7,
      date: '2024-11-15',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-005. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-15. Weight: 35kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  8: [
    // Coco - Poodle
    {
      id: 'mh-8-1',
      petId: 8,
      date: '2024-01-22',
      time: '3:30 PM',
      type: 'consultation',
      title: 'Grooming-Related Skin Check',
      diagnosis: 'Healthy - No skin issues',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Routine check following owner concerns about skin after grooming. Skin is healthy with no signs of irritation or infection. Weight: 6.8kg (ideal). Owner advised on proper grooming techniques.',
      procedures: ['Skin Examination'],
    },
    {
      id: 'mh-8-2',
      petId: 8,
      date: '2024-11-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Patricia Martinez',
        initials: 'PM',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-011. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-20. Weight: 6.8kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-8-2b',
      petId: 8,
      date: '2024-12-05',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Patricia Martinez',
        initials: 'PM',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-011. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-05. Weight: 6.8kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-8-3',
      petId: 8,
      date: '2023-10-25',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Dental Cleaning',
      diagnosis: 'Mild periodontal disease',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Routine dental cleaning performed under anesthesia. Mild tartar buildup removed. All teeth intact. Owner advised on home dental care.',
      procedures: ['Dental Cleaning', 'Dental Polishing'],
      followUp: {
        date: '2024-10-25',
        notes: 'Annual dental cleaning',
      },
    },
  ],
  9: [
    // Simba - Maine Coon
    {
      id: 'mh-9-1',
      petId: 9,
      date: '2024-01-19',
      time: '11:00 AM',
      type: 'consultation',
      title: 'Routine Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Large breed cat in excellent condition. Weight: 8.5kg (ideal for breed). Heart rate: 120 bpm, regular. All systems normal. Owner reports active and playful behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-01-19',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-9-2',
      petId: 9,
      date: '2023-12-12',
      time: '2:30 PM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations current',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines administered. Patient was cooperative. Weight: 8.5kg.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-9-3',
      petId: 9,
      date: '2023-09-20',
      time: '10:00 AM',
      type: 'diagnostic',
      title: 'Cardiac Screening',
      diagnosis: 'Normal cardiac function',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Echocardiogram performed due to breed predisposition to HCM. Results show normal cardiac structure and function. No abnormalities detected. Recommended annual screening.',
      procedures: ['Echocardiogram', 'ECG'],
      followUp: {
        date: '2024-09-20',
        notes: 'Annual cardiac screening',
      },
    },
  ],
  10: [
    // Oreo - British Shorthair
    {
      id: 'mh-10-1',
      petId: 10,
      date: '2024-01-17',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Weight Management Consultation',
      diagnosis: 'Overweight - Body condition score 7/9',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Patient is overweight. Current weight: 6.2kg, target weight: 5.0kg. Discussed weight management plan including portion control and increased activity. Prescribed weight management diet.',
      medications: [
        {
          name: 'Weight Management Diet',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing until target weight',
        },
      ],
      followUp: {
        date: '2024-02-17',
        notes: 'Weight check and progress evaluation',
      },
    },
    {
      id: 'mh-10-2',
      petId: 10,
      date: '2023-12-08',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was calm. Weight: 6.3kg. All vaccinations up to date.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-10-3',
      petId: 10,
      date: '2023-10-15',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Urinary Tract Health Check',
      diagnosis: 'Healthy urinary system',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Routine check for urinary health. Urinalysis normal. No signs of crystals or infection. Owner advised on maintaining adequate hydration.',
      procedures: ['Urinalysis', 'Physical Examination'],
      followUp: {
        date: '2024-10-15',
        notes: 'Annual urinary health check',
      },
    },
  ],
  11: [
    // Buddy - Border Collie
    {
      id: 'mh-11-1',
      petId: 11,
      date: '2024-01-21',
      time: '10:00 AM',
      type: 'consultation',
      title: 'Behavioral and Physical Check',
      diagnosis: 'Healthy - High energy normal for breed',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is highly active and alert, which is normal for this working breed. Weight: 20.5kg (ideal). Heart rate: 90 bpm, regular. Owner reports excellent herding instincts. Discussed mental stimulation needs.',
      procedures: ['Physical Examination', 'Behavioral Assessment'],
      followUp: {
        date: '2025-01-21',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-11-2',
      petId: 11,
      date: '2024-08-30',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-005. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-08-30. Weight: 20.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-11-2b',
      petId: 11,
      date: '2024-09-25',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-005. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-25. Weight: 20.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-11-2c',
      petId: 11,
      date: '2024-10-05',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-003. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-05. Weight: 20.5kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-11-3',
      petId: 11,
      date: '2023-09-15',
      time: '11:30 AM',
      type: 'treatment',
      title: 'Minor Cut Treatment',
      diagnosis: 'Superficial laceration on front paw',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Small laceration on right front paw pad, likely from rough terrain during herding activity. Wound cleaned and sutured. Antibiotic ointment applied. Owner advised to limit activity for 5 days.',
      medications: [
        {
          name: 'Cephalexin',
          dosage: '22 mg/kg',
          frequency: 'BID',
          duration: '7 days',
        },
        {
          name: 'Topical Antibiotic Ointment',
          dosage: 'Apply thin layer',
          frequency: 'BID',
          duration: '7 days',
        },
      ],
      procedures: ['Wound Cleaning', 'Suture Placement'],
      followUp: {
        date: '2023-09-22',
        notes: 'Suture removal and wound check',
      },
    },
  ],
  12: [
    // Whiskers - Maine Coon
    {
      id: 'mh-12-1',
      petId: 12,
      date: '2024-01-23',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Large breed cat in excellent condition. Weight: 9.2kg (ideal for breed). Heart rate: 110 bpm, regular. All systems normal. Owner reports friendly and social behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-01-23',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-12-2',
      petId: 12,
      date: '2023-12-20',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was calm and friendly. Weight: 9.2kg. All vaccinations up to date.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-12-3',
      petId: 12,
      date: '2023-10-10',
      time: '2:30 PM',
      type: 'diagnostic',
      title: 'Hip X-ray Screening',
      diagnosis: 'Normal hip structure',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs of hips performed due to large breed size. Results show normal hip structure with no signs of dysplasia. Joints appear healthy.',
      procedures: ['Radiographs - Bilateral Hips'],
      followUp: {
        date: '2024-10-10',
        notes: 'Annual hip screening',
      },
    },
  ],
  13: [
    // Rex - Rottweiler
    {
      id: 'mh-13-1',
      petId: 13,
      date: '2024-01-24',
      time: '9:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is calm and well-behaved. Weight: 48kg (ideal). Heart rate: 80 bpm, regular. All systems normal. Owner reports good training progress and socialization.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-01-24',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-13-2',
      petId: 13,
      date: '2024-06-20',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-006. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-06-20. Weight: 48kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-13-2b',
      petId: 13,
      date: '2024-07-15',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-006. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-07-15. Weight: 48kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-13-3',
      petId: 13,
      date: '2023-08-20',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Elbow Dysplasia Management',
      diagnosis: 'Bilateral elbow dysplasia - mild',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs show mild bilateral elbow dysplasia. Patient shows occasional stiffness. Prescribed joint supplements and anti-inflammatory medication. Weight management important.',
      medications: [
        {
          name: 'Carprofen',
          dosage: '2.2 mg/kg',
          frequency: 'BID with food',
          duration: '14 days, then as needed',
        },
        {
          name: 'Glucosamine/Chondroitin',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing',
        },
      ],
      procedures: ['Radiographs - Bilateral Elbows'],
      followUp: {
        date: '2023-11-20',
        notes: 'Recheck mobility and adjust treatment',
      },
    },
  ],
  14: [
    // Princess - Yorkshire Terrier
    {
      id: 'mh-14-1',
      petId: 14,
      date: '2024-01-25',
      time: '11:30 AM',
      type: 'consultation',
      title: 'Puppy Health Check',
      diagnosis: 'Healthy - Growing normally',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Young dog growing well. Weight: 2.8kg (appropriate for age). Heart rate: 120 bpm, regular. All systems normal. Owner reports playful and confident behavior.',
      procedures: ['Physical Examination', 'Growth Assessment'],
      followUp: {
        date: '2024-04-25',
        notes: 'Next puppy check-up',
      },
    },
    {
      id: 'mh-14-2',
      petId: 14,
      date: '2024-11-25',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-007. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-25. Weight: 4.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-14-2b',
      petId: 14,
      date: '2024-12-10',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-007. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-10. Weight: 4.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-14-3',
      petId: 14,
      date: '2023-11-15',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Dental Care Consultation',
      diagnosis: 'Healthy teeth - preventive care',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Dental examination shows healthy teeth for age. Discussed importance of dental care in small breeds. Owner advised on dental chews and brushing routine.',
      procedures: ['Dental Examination'],
      followUp: {
        date: '2024-11-15',
        notes: 'Annual dental check',
      },
    },
  ],
  15: [
    // Shadow - British Shorthair
    {
      id: 'mh-15-1',
      petId: 15,
      date: '2024-01-26',
      time: '2:00 PM',
      type: 'consultation',
      title: 'Routine Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is calm and independent as typical for breed. Weight: 5.8kg (ideal). Heart rate: 130 bpm, regular. All systems normal.',
      procedures: ['Physical Examination'],
      followUp: {
        date: '2025-01-26',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-15-2',
      petId: 15,
      date: '2023-12-22',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was calm. Weight: 5.8kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
  ],
  16: [
    // Toby - Cocker Spaniel
    {
      id: 'mh-16-1',
      petId: 16,
      date: '2024-01-27',
      time: '10:30 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is friendly and gentle. Weight: 13.5kg (ideal). Heart rate: 95 bpm, regular. All systems normal. Owner reports excellent family dog behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-01-27',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-16-2',
      petId: 16,
      date: '2024-09-30',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-008. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-09-30. Weight: 13.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-16-2b',
      petId: 16,
      date: '2024-10-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-008. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-20. Weight: 13.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-16-2c',
      petId: 16,
      date: '2024-11-05',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-004. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-05. Weight: 13.5kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-16-3',
      petId: 16,
      date: '2023-09-25',
      time: '11:00 AM',
      type: 'treatment',
      title: 'Ear Infection Treatment',
      diagnosis: 'Bilateral otitis externa',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Common in breed due to long ears. Otoscopic exam shows erythema and discharge bilaterally. Cytology confirms bacterial infection. Prescribed ear drops and cleaning solution.',
      medications: [
        {
          name: 'Otomax Drops',
          dosage: '5 drops',
          frequency: 'BID',
          duration: '10 days',
        },
        {
          name: 'Epi-Otic Cleaner',
          dosage: 'As needed',
          frequency: 'Before medication',
          duration: '10 days',
        },
      ],
      procedures: ['Otoscopic Examination', 'Ear Cytology'],
      followUp: {
        date: '2023-10-09',
        notes: 'Recheck ear condition',
      },
    },
  ],
  17: [
    // Nala - Ragdoll
    {
      id: 'mh-17-1',
      petId: 17,
      date: '2024-01-28',
      time: '2:30 PM',
      type: 'consultation',
      title: 'Routine Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is docile and affectionate as typical for breed. Weight: 4.5kg (ideal). Heart rate: 125 bpm, regular. All systems normal. Owner reports characteristic limp behavior when picked up.',
      procedures: ['Physical Examination'],
      followUp: {
        date: '2025-01-28',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-17-2',
      petId: 17,
      date: '2023-12-25',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was very calm and relaxed. Weight: 4.5kg. All vaccinations up to date.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-17-3',
      petId: 17,
      date: '2023-10-20',
      time: '3:00 PM',
      type: 'diagnostic',
      title: 'Cardiac Screening',
      diagnosis: 'Normal cardiac function',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Echocardiogram performed due to breed predisposition to HCM. Results show normal cardiac structure and function. No abnormalities detected.',
      procedures: ['Echocardiogram', 'ECG'],
      followUp: {
        date: '2024-10-20',
        notes: 'Annual cardiac screening',
      },
    },
  ],
  18: [
    // Zeus - Great Dane
    {
      id: 'mh-18-1',
      petId: 18,
      date: '2024-01-29',
      time: '9:30 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Gentle giant in excellent condition. Weight: 68kg (ideal). Heart rate: 70 bpm, regular. All systems normal. Owner reports friendly and calm behavior despite large size.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-01-29',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-18-2',
      petId: 18,
      date: '2024-07-25',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-009. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-07-25. Weight: 68kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-18-2b',
      petId: 18,
      date: '2024-08-10',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-009. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-08-10. Weight: 68kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-18-3',
      petId: 18,
      date: '2023-10-30',
      time: '2:00 PM',
      type: 'diagnostic',
      title: 'Hip and Elbow Screening',
      diagnosis: 'Normal joint structure',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs of hips and elbows performed due to large breed size and predisposition to joint issues. Results show normal joint structure with no signs of dysplasia. Joints appear healthy.',
      procedures: [
        'Radiographs - Bilateral Hips',
        'Radiographs - Bilateral Elbows',
      ],
      followUp: {
        date: '2024-10-30',
        notes: 'Annual joint screening',
      },
    },
  ],
  19: [
    // Lucky - Australian Shepherd
    {
      id: 'mh-19-1',
      petId: 19,
      date: '2024-01-30',
      time: '10:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - High energy normal',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is highly energetic and intelligent, typical for working breed. Weight: 25kg (ideal). Heart rate: 85 bpm, regular. All systems normal. Owner reports excellent herding and agility skills.',
      procedures: ['Physical Examination', 'Behavioral Assessment'],
      followUp: {
        date: '2025-01-30',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-19-2',
      petId: 19,
      date: '2024-09-15',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-012. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-09-15. Weight: 25kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-19-2b',
      petId: 19,
      date: '2024-10-30',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-012. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-30. Weight: 25kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-19-2c',
      petId: 19,
      date: '2024-11-10',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-006. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-10. Weight: 25kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-19-3',
      petId: 19,
      date: '2023-09-10',
      time: '11:30 AM',
      type: 'treatment',
      title: 'Eye Injury Treatment',
      diagnosis: 'Superficial corneal abrasion',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Patient presented with eye irritation. Fluorescein stain reveals superficial corneal abrasion on left eye, likely from foreign object during outdoor activity. Prescribed antibiotic eye drops and pain medication.',
      medications: [
        {
          name: 'Ofloxacin Eye Drops',
          dosage: '1-2 drops',
          frequency: 'TID',
          duration: '7 days',
        },
        {
          name: 'Meloxicam',
          dosage: '0.1 mg/kg',
          frequency: 'Once daily',
          duration: '5 days',
        },
      ],
      procedures: ['Ophthalmic Examination', 'Fluorescein Staining'],
      followUp: {
        date: '2023-09-17',
        notes: 'Recheck eye healing',
      },
    },
  ],
  20: [
    // Misty - Russian Blue
    {
      id: 'mh-20-1',
      petId: 20,
      date: '2024-01-31',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Behavioral Consultation',
      diagnosis: 'Shy but healthy',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is shy but healthy, which is typical for breed. Weight: 4.8kg (ideal). Heart rate: 140 bpm, regular. All systems normal. Discussed environmental enrichment for shy cats.',
      procedures: ['Physical Examination', 'Behavioral Assessment'],
      followUp: {
        date: '2025-01-31',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-20-2',
      petId: 20,
      date: '2023-12-28',
      time: '11:30 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was shy but cooperative. Weight: 4.8kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-20-3',
      petId: 20,
      date: '2023-10-15',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Anxiety Management',
      diagnosis: 'Mild anxiety in new environments',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Owner reports patient becomes anxious in new environments. Discussed environmental modifications and calming strategies. Prescribed calming supplement.',
      medications: [
        {
          name: 'L-Theanine Supplement',
          dosage: 'As directed',
          frequency: 'Daily',
          duration: 'Ongoing',
        },
      ],
      followUp: {
        date: '2024-01-15',
        notes: 'Recheck behavior and response to treatment',
      },
    },
  ],
  21: [
    // Tiger - Bengal
    {
      id: 'mh-21-1',
      petId: 21,
      date: '2024-02-01',
      time: '10:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - Active and playful',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is active and curious, typical for breed. Weight: 6.5kg (ideal). Heart rate: 140 bpm, regular. All systems normal. Owner reports excellent climbing and exploring behavior.',
      procedures: ['Physical Examination', 'Behavioral Assessment'],
      followUp: {
        date: '2025-02-01',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-21-2',
      petId: 21,
      date: '2023-12-28',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was active but cooperative. Weight: 6.5kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-21-3',
      petId: 21,
      date: '2023-09-15',
      time: '11:00 AM',
      type: 'treatment',
      title: 'Minor Injury Treatment',
      diagnosis: 'Superficial abrasion on paw pad',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Patient presented with minor abrasion on left front paw pad, likely from climbing activity. Wound cleaned and bandaged. Antibiotic ointment applied.',
      medications: [
        {
          name: 'Topical Antibiotic Ointment',
          dosage: 'Apply thin layer',
          frequency: 'BID',
          duration: '5 days',
        },
      ],
      procedures: ['Wound Cleaning', 'Bandage Application'],
      followUp: {
        date: '2023-09-20',
        notes: 'Recheck wound healing',
      },
    },
  ],
  22: [
    // Sadie - Boxer
    {
      id: 'mh-22-1',
      petId: 22,
      date: '2024-02-02',
      time: '11:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is playful and energetic. Weight: 28kg (ideal). Heart rate: 95 bpm, regular. All systems normal. Owner reports excellent family dog behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-02-02',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-22-2',
      petId: 22,
      date: '2024-07-30',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Carlos Rodriguez',
        initials: 'CR',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-013. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-07-30. Weight: 28kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-22-2b',
      petId: 22,
      date: '2024-08-25',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Carlos Rodriguez',
        initials: 'CR',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-013. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-08-25. Weight: 28kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-22-3',
      petId: 22,
      date: '2023-08-25',
      time: '10:30 AM',
      type: 'surgery',
      title: 'Spay Procedure',
      diagnosis: 'Elective spay',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Routine ovariohysterectomy performed. Patient recovered well from anesthesia. Incision site clean. Post-operative pain management provided.',
      medications: [
        {
          name: 'Meloxicam',
          dosage: '0.1 mg/kg',
          frequency: 'Once daily',
          duration: '5 days',
        },
      ],
      procedures: ['Ovariohysterectomy', 'Pre-anesthetic Blood Work'],
      followUp: {
        date: '2023-09-01',
        notes: 'Post-operative check and suture removal',
      },
    },
  ],
  23: [
    // Oliver - Scottish Fold
    {
      id: 'mh-23-1',
      petId: 23,
      date: '2024-02-03',
      time: '2:00 PM',
      type: 'consultation',
      title: 'Routine Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is calm and sweet, typical for breed. Weight: 4.2kg (ideal). Heart rate: 135 bpm, regular. All systems normal. Characteristic folded ears noted.',
      procedures: ['Physical Examination'],
      followUp: {
        date: '2025-02-03',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-23-2',
      petId: 23,
      date: '2024-01-05',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was very calm. Weight: 4.2kg. All vaccinations up to date.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-23-3',
      petId: 23,
      date: '2023-10-20',
      time: '3:30 PM',
      type: 'diagnostic',
      title: 'Joint Health Screening',
      diagnosis: 'Normal joint structure',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs of joints performed due to breed predisposition to joint issues. Results show normal joint structure with no signs of abnormalities. Joints appear healthy.',
      procedures: ['Radiographs - All Major Joints'],
      followUp: {
        date: '2024-10-20',
        notes: 'Annual joint screening',
      },
    },
  ],
  24: [
    // Bailey - Cavalier King Charles Spaniel
    {
      id: 'mh-24-1',
      petId: 24,
      date: '2024-02-04',
      time: '10:30 AM',
      type: 'consultation',
      title: 'Puppy Health Check',
      diagnosis: 'Healthy - Growing well',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Young dog growing well. Weight: 6.5kg (appropriate for age). Heart rate: 110 bpm, regular. All systems normal. Owner reports gentle and affectionate behavior.',
      procedures: ['Physical Examination', 'Growth Assessment'],
      followUp: {
        date: '2024-05-04',
        notes: 'Next puppy check-up',
      },
    },
    {
      id: 'mh-24-2',
      petId: 24,
      date: '2024-11-30',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Patricia Martinez',
        initials: 'PM',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-014. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-30. Weight: 6.2kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-24-2b',
      petId: 24,
      date: '2024-12-15',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Patricia Martinez',
        initials: 'PM',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-014. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-15. Weight: 6.2kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-24-3',
      petId: 24,
      date: '2023-12-15',
      time: '11:30 AM',
      type: 'diagnostic',
      title: 'Cardiac Screening',
      diagnosis: 'Normal cardiac function',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Echocardiogram performed due to breed predisposition to mitral valve disease. Results show normal cardiac structure and function. No abnormalities detected. Recommended annual screening.',
      procedures: ['Echocardiogram', 'ECG'],
      followUp: {
        date: '2024-12-15',
        notes: 'Annual cardiac screening',
      },
    },
  ],
  25: [
    // Jasper - Norwegian Forest Cat
    {
      id: 'mh-25-1',
      petId: 25,
      date: '2024-02-05',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No abnormalities',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Large breed cat in excellent condition. Weight: 8.8kg (ideal for breed). Heart rate: 115 bpm, regular. All systems normal. Owner reports enjoys outdoor adventures.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-02-05',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-25-2',
      petId: 25,
      date: '2024-01-10',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was calm. Weight: 8.8kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-25-3',
      petId: 25,
      date: '2023-11-20',
      time: '2:30 PM',
      type: 'treatment',
      title: 'Coat and Skin Check',
      diagnosis: 'Healthy coat - No skin issues',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Routine check of long coat and skin. Coat is healthy with no matting. Skin is clear with no signs of parasites or irritation. Owner advised on regular grooming.',
      procedures: ['Skin Examination', 'Coat Assessment'],
      followUp: {
        date: '2024-11-20',
        notes: 'Annual coat and skin check',
      },
    },
  ],
  26: [
    // Lola - French Bulldog
    {
      id: 'mh-26-1',
      petId: 26,
      date: '2024-02-06',
      time: '11:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is playful and adaptable. Weight: 11.5kg (ideal). Heart rate: 100 bpm, regular. All systems normal. Owner reports excellent apartment dog behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-02-06',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-26-2',
      petId: 26,
      date: '2024-10-20',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-015. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-10-20. Weight: 11.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-26-2b',
      petId: 26,
      date: '2024-11-05',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-015. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-05. Weight: 11.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-26-2c',
      petId: 26,
      date: '2024-12-01',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Lisa Gonzalez',
        initials: 'LG',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-007. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-01. Weight: 11.5kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-26-3',
      petId: 26,
      date: '2023-10-25',
      time: '10:30 AM',
      type: 'treatment',
      title: 'Brachycephalic Airway Check',
      diagnosis: 'Mild brachycephalic airway syndrome',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Routine check for brachycephalic breed. Patient shows mild respiratory signs typical for breed. No immediate intervention needed. Owner advised on weight management and avoiding heat stress.',
      followUp: {
        date: '2024-04-25',
        notes: 'Recheck respiratory function',
      },
    },
  ],
  27: [
    // Simba - Abyssinian
    {
      id: 'mh-27-1',
      petId: 27,
      date: '2024-02-07',
      time: '3:30 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - Active and curious',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is active and curious, typical for breed. Weight: 5.2kg (ideal). Heart rate: 145 bpm, regular. All systems normal. Owner reports loves to explore and play.',
      procedures: ['Physical Examination'],
      followUp: {
        date: '2025-02-07',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-27-2',
      petId: 27,
      date: '2024-01-15',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was active but cooperative. Weight: 5.2kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-27-3',
      petId: 27,
      date: '2023-09-30',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Dental Cleaning',
      diagnosis: 'Mild tartar buildup',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Routine dental cleaning performed under anesthesia. Mild tartar removed. All teeth intact. Owner advised on home dental care.',
      procedures: ['Dental Cleaning', 'Dental Polishing'],
      followUp: {
        date: '2024-09-30',
        notes: 'Annual dental cleaning',
      },
    },
  ],
  28: [
    // Cooper - Siberian Husky
    {
      id: 'mh-28-1',
      petId: 28,
      date: '2024-02-08',
      time: '10:00 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - High energy normal',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is energetic and independent, typical for breed. Weight: 24kg (ideal). Heart rate: 88 bpm, regular. All systems normal. Owner reports requires lots of exercise.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-02-08',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-28-2',
      petId: 28,
      date: '2024-08-15',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-016. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-08-15. Weight: 24kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-28-2b',
      petId: 28,
      date: '2024-09-30',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-016. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-30. Weight: 24kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-28-3',
      petId: 28,
      date: '2023-11-10',
      time: '11:00 AM',
      type: 'treatment',
      title: 'Coat Care Consultation',
      diagnosis: 'Healthy double coat',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Routine check of double coat. Coat is healthy with no matting or skin issues. Owner advised on proper grooming techniques for double-coated breed, especially during shedding season.',
      procedures: ['Coat Assessment', 'Skin Examination'],
      followUp: {
        date: '2024-11-10',
        notes: 'Annual coat check',
      },
    },
  ],
  29: [
    // Luna - Sphynx
    {
      id: 'mh-29-1',
      petId: 29,
      date: '2024-02-09',
      time: '3:00 PM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Michael Chen',
        initials: 'MC',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Hairless breed in excellent condition. Weight: 4.0kg (ideal). Heart rate: 150 bpm, regular. Skin is healthy with no issues. Owner reports regular bathing routine maintained.',
      procedures: ['Physical Examination', 'Skin Examination'],
      followUp: {
        date: '2025-02-09',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-29-2',
      petId: 29,
      date: '2024-01-20',
      time: '10:30 AM',
      type: 'vaccination',
      title: 'Annual Vaccination',
      diagnosis: 'Vaccinations administered',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'FVRCP and Rabies vaccines given. Patient was calm. Weight: 4.0kg. All vaccinations current.',
      medications: [
        {
          name: 'FVRCP',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-29-3',
      petId: 29,
      date: '2023-10-12',
      time: '2:00 PM',
      type: 'treatment',
      title: 'Skin Care Consultation',
      diagnosis: 'Healthy skin - No issues',
      professional: {
        name: 'Dr. John Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Routine skin check for hairless breed. Skin is healthy with no signs of irritation, infection, or excessive oiliness. Owner maintaining good bathing routine. Discussed importance of warmth and sun protection.',
      procedures: ['Skin Examination'],
      followUp: {
        date: '2024-10-12',
        notes: 'Annual skin check',
      },
    },
  ],
  30: [
    // Duke - Doberman Pinscher
    {
      id: 'mh-30-1',
      petId: 30,
      date: '2024-02-10',
      time: '9:30 AM',
      type: 'consultation',
      title: 'Annual Health Check',
      diagnosis: 'Healthy - No concerns',
      professional: {
        name: 'Dr. Emily Rodriguez',
        initials: 'ER',
        role: 'Veterinarian',
      },
      notes:
        'Complete physical examination. Patient is alert and well-behaved. Weight: 42kg (ideal). Heart rate: 75 bpm, regular. All systems normal. Owner reports excellent guard dog behavior.',
      procedures: ['Physical Examination', 'Heart Auscultation'],
      followUp: {
        date: '2025-02-10',
        notes: 'Annual check-up',
      },
    },
    {
      id: 'mh-30-2',
      petId: 30,
      date: '2024-06-25',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jennifer Ramirez',
        initials: 'JR',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-017. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-06-25. Weight: 42kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-30-2b',
      petId: 30,
      date: '2024-07-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jennifer Ramirez',
        initials: 'JR',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-017. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-07-20. Weight: 42kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-30-2c',
      petId: 30,
      date: '2024-08-05',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jennifer Ramirez',
        initials: 'JR',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-008. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-08-05. Weight: 42kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-30-3',
      petId: 30,
      date: '2023-12-05',
      time: '2:00 PM',
      type: 'diagnostic',
      title: 'Cardiac Screening',
      diagnosis: 'Normal cardiac function',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'Echocardiogram performed due to breed predisposition to DCM (dilated cardiomyopathy). Results show normal cardiac structure and function. No abnormalities detected. Recommended annual screening.',
      procedures: ['Echocardiogram', 'ECG'],
      followUp: {
        date: '2024-12-05',
        notes: 'Annual cardiac screening',
      },
    },
    {
      id: 'mh-30-4',
      petId: 30,
      date: '2023-09-20',
      time: '10:00 AM',
      type: 'treatment',
      title: 'Hip Dysplasia Screening',
      diagnosis: 'Normal hip structure',
      professional: {
        name: 'Dr. Jane Doe',
        initials: 'JD',
        role: 'Veterinarian',
      },
      notes:
        'Radiographs of hips performed due to breed size. Results show normal hip structure with no signs of dysplasia. Joints appear healthy.',
      procedures: ['Radiographs - Bilateral Hips'],
      followUp: {
        date: '2024-09-20',
        notes: 'Annual hip screening',
      },
    },
  ],
  31: [
    // Chloe - Shih Tzu
    {
      id: 'mh-31-1',
      petId: 31,
      date: '2024-11-05',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Maria Garcia',
        initials: 'MG',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-018. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-11-05. Weight: 6.5kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-31-2',
      petId: 31,
      date: '2024-12-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Maria Garcia',
        initials: 'MG',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-018. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-20. Weight: 6.5kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  32: [
    // Max - Bernese Mountain Dog
    {
      id: 'mh-32-1',
      petId: 32,
      date: '2024-09-25',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jose Hernandez',
        initials: 'JH',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-019. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-09-25. Weight: 50kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-32-2',
      petId: 32,
      date: '2024-10-10',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jose Hernandez',
        initials: 'JH',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-019. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-10-10. Weight: 50kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-32-3',
      petId: 32,
      date: '2024-11-20',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Jose Hernandez',
        initials: 'JH',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-009. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-11-20. Weight: 50kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  33: [
    // Riley - Golden Retriever
    {
      id: 'mh-33-1',
      petId: 33,
      date: '2024-08-30',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Robert Torres',
        initials: 'RT',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-020. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-08-30. Weight: 30kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-33-2',
      petId: 33,
      date: '2024-09-18',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Robert Torres',
        initials: 'RT',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-020. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-18. Weight: 30kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  34: [
    // Jack - Jack Russell Terrier
    {
      id: 'mh-34-1',
      petId: 34,
      date: '2024-07-10',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Ana Martinez',
        initials: 'AM',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-021. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-07-10. Weight: 8kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-34-2',
      petId: 34,
      date: '2024-08-20',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Ana Martinez',
        initials: 'AM',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-021. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-08-20. Weight: 8kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
    {
      id: 'mh-34-3',
      petId: 34,
      date: '2024-09-05',
      time: '11:00 AM',
      type: 'vaccination',
      title: 'Bordetella Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Ana Martinez',
        initials: 'AM',
        role: 'Veterinarian',
      },
      notes:
        'Bordetella vaccine administered. Batch: BOR-2024-010. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-09-05. Weight: 8kg.',
      medications: [
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  35: [
    // Bear - Saint Bernard
    {
      id: 'mh-35-1',
      petId: 35,
      date: '2024-06-15',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Carmen Silva',
        initials: 'CS',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-022. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-06-15. Weight: 70kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-35-2',
      petId: 35,
      date: '2024-07-05',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Carmen Silva',
        initials: 'CS',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-022. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-07-05. Weight: 70kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
  36: [
    // Milo - Chihuahua
    {
      id: 'mh-36-1',
      petId: 36,
      date: '2024-12-10',
      time: '10:00 AM',
      type: 'vaccination',
      title: 'Rabies Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Luis Rodriguez',
        initials: 'LR',
        role: 'Veterinarian',
      },
      notes:
        'Rabies vaccine administered. Batch: RAB-2024-023. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2026-12-10. Weight: 3kg.',
      medications: [
        {
          name: 'Rabies Vaccine',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: '3 years',
        },
      ],
    },
    {
      id: 'mh-36-2',
      petId: 36,
      date: '2024-12-25',
      time: '2:00 PM',
      type: 'vaccination',
      title: 'DHPP Vaccination',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Luis Rodriguez',
        initials: 'LR',
        role: 'Veterinarian',
      },
      notes:
        'DHPP booster administered. Batch: DHPP-2024-023. Patient tolerated vaccine well with no adverse reactions observed. Next due: 2025-12-25. Weight: 3kg.',
      medications: [
        {
          name: 'DHPP Booster',
          dosage: '1 mL',
          frequency: 'Single dose',
          duration: 'Annual',
        },
      ],
    },
  ],
};
