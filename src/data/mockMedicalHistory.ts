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
      date: '2024-01-10',
      time: '2:15 PM',
      type: 'vaccination',
      title: 'Vaccination Update',
      diagnosis: 'Vaccination administered',
      professional: {
        name: 'Dr. Sarah Martinez',
        initials: 'SM',
        role: 'Veterinarian',
      },
      notes:
        'DHPP, Rabies, and Bordetella boosters administered. Patient tolerated vaccines well with no adverse reactions observed. Heartworm test performed - negative. Weight: 32.5kg. All vaccinations are up to date.',
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
        {
          name: 'Bordetella',
          dosage: '0.5 mL',
          frequency: 'Single dose',
          duration: 'Annual',
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
};
