import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Box,
  Typography,
  InputBase,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalPharmacy as PharmacyIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon,
  Vaccines as VaccinesIcon,
  WaterDrop as WaterDropIcon,
  LocalHospital as HospitalIcon,
  BugReport as BugReportIcon,
  Science as ScienceIcon,
  Favorite as HeartIcon,
  Psychology as PsychologyIcon,
  Biotech as BiotechIcon,
  Air as AirIcon,
  Visibility as EyeIcon,
  Spa as SpaIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/vademecum/')({
  component: Vademecum,
});

interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  category: string;
  species: string[];
  dosage: string;
  administration: string;
  indications: string;
  contraindications: string[];
  sideEffects: string[];
  presentation: string;
  manufacturer: string;
  addedBy?: {
    name: string;
    role?: string;
  };
  organization?: string; // Organization slug
}

interface MedicationFormValues {
  name: string;
  activeIngredient: string;
  category: string;
  species: string[];
  dosage: string;
  administration: string;
  indications: string;
  contraindications: string[];
  sideEffects: string[];
  presentation: string;
  manufacturer: string;
}

// Mock data - In production this would come from an API
// Generating 200 medications for performance testing
const generateMedications = (): Medication[] => {
  const medications: Medication[] = [];
  const manufacturers = [
    'VetPharma',
    'VetCare',
    'VetMed',
    'AnimalHealth',
    'PetVet',
    'VetSolutions',
    'MediVet',
    'BioVet',
  ];
  const speciesOptions = [
    ['Dog'],
    ['Cat'],
    ['Dog', 'Cat'],
    ['Dog', 'Cat', 'Bird'],
    ['Bird'],
    ['Rabbit'],
  ];

  const medicationTemplates = [
    // Antibiotics
    {
      name: 'Amoxicillin',
      category: 'Antibiotic',
      dosage: '10-20 mg/kg every 8-12 hours',
      admin: 'Oral',
      indications:
        'Bacterial infections of the respiratory, urinary tract and skin',
      contra: ['Hypersensitivity to penicillins', 'Severe renal insufficiency'],
      effects: ['Nausea', 'Diarrhea', 'Allergic reactions'],
      presentations: ['Tablets 250mg', 'Suspension 50mg/ml'],
    },
    {
      name: 'Cephalexin',
      category: 'Antibiotic',
      dosage: '15-25 mg/kg every 8-12 hours',
      admin: 'Oral',
      indications:
        'Skin infections, urinary tract infections, respiratory infections',
      contra: ['Hypersensitivity to cephalosporins'],
      effects: ['Vomiting', 'Diarrhea', 'Loss of appetite'],
      presentations: ['Capsules 250mg', 'Suspension 100mg/ml'],
    },
    {
      name: 'Doxycycline',
      category: 'Antibiotic',
      dosage: '5-10 mg/kg every 12 hours',
      admin: 'Oral',
      indications:
        'Tick-borne diseases, respiratory infections, urinary tract infections',
      contra: ['Pregnancy', 'Young animals', 'Hepatic impairment'],
      effects: [
        'Esophageal irritation',
        'Photosensitivity',
        'Gastrointestinal upset',
      ],
      presentations: ['Tablets 100mg', 'Capsules 50mg'],
    },
    {
      name: 'Enrofloxacin',
      category: 'Antibiotic',
      dosage: '5-10 mg/kg every 24 hours',
      admin: 'Oral',
      indications: 'Urinary, respiratory and skin tract infections',
      contra: ['Growing animals', 'Hypersensitivity to quinolones'],
      effects: ['Vomiting', 'Diarrhea', 'Arthropathy in young animals'],
      presentations: ['Tablets 50mg', 'Tablets 150mg'],
    },
    {
      name: 'Metronidazole',
      category: 'Antibiotic',
      dosage: '10-15 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Anaerobic infections, giardiasis, periodontal disease',
      contra: ['Pregnancy', 'Hypersensitivity', 'Severe liver disease'],
      effects: ['Nausea', 'Vomiting', 'Neurotoxicity at high doses'],
      presentations: ['Tablets 250mg', 'Suspension 40mg/ml'],
    },
    {
      name: 'Clindamycin',
      category: 'Antibiotic',
      dosage: '5-10 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Dental infections, skin infections, bone infections',
      contra: ['Hypersensitivity', 'Hepatic disease'],
      effects: ['Vomiting', 'Diarrhea', 'Esophagitis'],
      presentations: ['Capsules 75mg', 'Liquid 25mg/ml'],
    },
    {
      name: 'Trimethoprim-Sulfa',
      category: 'Antibiotic',
      dosage: '15-30 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Urinary tract infections, respiratory infections',
      contra: ['Pregnancy', 'Doberman Pinschers', 'Hypersensitivity'],
      effects: ['Dry eye', 'Vomiting', 'Anemia'],
      presentations: ['Tablets 480mg', 'Suspension 200mg/ml'],
    },
    {
      name: 'Azithromycin',
      category: 'Antibiotic',
      dosage: '5-10 mg/kg every 24 hours',
      admin: 'Oral',
      indications: 'Respiratory infections, skin infections',
      contra: ['Hypersensitivity to macrolides'],
      effects: ['Vomiting', 'Diarrhea', 'Loss of appetite'],
      presentations: ['Tablets 250mg', 'Suspension 100mg/5ml'],
    },

    // Anti-inflammatories
    {
      name: 'Carprofen',
      category: 'Anti-inflammatory',
      dosage: '2-4 mg/kg every 12 hours',
      admin: 'Oral',
      indications:
        'Post-surgical pain and inflammation, arthritis, osteoarthritis',
      contra: [
        'Gastrointestinal ulcers',
        'Renal insufficiency',
        'Hypersensitivity',
      ],
      effects: ['Vomiting', 'Diarrhea', 'Gastric ulcers'],
      presentations: ['Tablets 25mg', 'Tablets 50mg', 'Tablets 100mg'],
    },
    {
      name: 'Meloxicam',
      category: 'Anti-inflammatory',
      dosage: '0.1 mg/kg every 24 hours',
      admin: 'Oral',
      indications: 'Osteoarthritis, post-operative pain',
      contra: ['Gastrointestinal ulcers', 'Renal disease', 'Hypersensitivity'],
      effects: ['Vomiting', 'Diarrhea', 'Renal toxicity'],
      presentations: ['Oral suspension 1.5mg/ml', 'Tablets 7.5mg'],
    },
    {
      name: 'Firocoxib',
      category: 'Anti-inflammatory',
      dosage: '5 mg/kg every 24 hours',
      admin: 'Oral',
      indications: 'Osteoarthritis pain and inflammation',
      contra: ['Gastrointestinal ulcers', 'Renal disease'],
      effects: ['Vomiting', 'Diarrhea', 'Decreased appetite'],
      presentations: ['Tablets 57mg', 'Tablets 227mg'],
    },
    {
      name: 'Robenacoxib',
      category: 'Anti-inflammatory',
      dosage: '1-2 mg/kg every 24 hours',
      admin: 'Oral',
      indications: 'Post-operative pain, chronic pain',
      contra: ['Gastrointestinal ulcers', 'Renal impairment'],
      effects: ['Vomiting', 'Diarrhea', 'Lethargy'],
      presentations: ['Tablets 6mg', 'Tablets 20mg'],
    },

    // Corticosteroids
    {
      name: 'Prednisolone',
      category: 'Corticosteroid',
      dosage: '0.5-2 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Inflammatory diseases, allergies, autoimmune diseases',
      contra: [
        'Systemic infections',
        'Gastric ulcers',
        'Uncontrolled diabetes',
      ],
      effects: ['Polyuria', 'Polydipsia', 'Weight gain', 'Immunosuppression'],
      presentations: ['Tablets 5mg', 'Tablets 20mg'],
    },
    {
      name: 'Dexamethasone',
      category: 'Corticosteroid',
      dosage: '0.1-0.2 mg/kg every 12-24 hours',
      admin: 'Oral, Injectable',
      indications: 'Severe inflammation, shock, allergic reactions',
      contra: ['Systemic infections', 'Diabetes', 'Gastric ulcers'],
      effects: [
        'Polyuria',
        'Polydipsia',
        'Increased appetite',
        'Muscle wasting',
      ],
      presentations: ['Tablets 0.5mg', 'Injection 2mg/ml'],
    },
    {
      name: 'Methylprednisolone',
      category: 'Corticosteroid',
      dosage: '0.5-1 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Inflammatory conditions, immune-mediated diseases',
      contra: ['Systemic infections', 'Gastric ulcers'],
      effects: ['Polyuria', 'Polydipsia', 'Weight gain'],
      presentations: ['Tablets 4mg', 'Tablets 16mg'],
    },

    // Diuretics
    {
      name: 'Furosemide',
      category: 'Diuretic',
      dosage: '1-4 mg/kg every 8-12 hours',
      admin: 'Oral, Intravenous',
      indications: 'Pulmonary edema, congestive heart failure, ascites',
      contra: ['Anuria', 'Hypersensitivity', 'Severe dehydration'],
      effects: ['Dehydration', 'Hypokalemia', 'Metabolic alkalosis'],
      presentations: ['Tablets 40mg', 'Ampoules 50mg/ml'],
    },
    {
      name: 'Spironolactone',
      category: 'Diuretic',
      dosage: '1-2 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Congestive heart failure, ascites',
      contra: ['Anuria', 'Hyperkalemia', 'Addison disease'],
      effects: ['Hyperkalemia', 'Gastrointestinal upset'],
      presentations: ['Tablets 25mg', 'Tablets 100mg'],
    },

    // Analgesics
    {
      name: 'Tramadol',
      category: 'Analgesic',
      dosage: '2-5 mg/kg every 8-12 hours',
      admin: 'Oral',
      indications: 'Moderate to severe pain',
      contra: ['Seizure disorders', 'Concurrent MAOIs'],
      effects: ['Sedation', 'Dizziness', 'Nausea'],
      presentations: ['Tablets 50mg', 'Capsules 50mg'],
    },
    {
      name: 'Gabapentin',
      category: 'Analgesic',
      dosage: '10-20 mg/kg every 8-12 hours',
      admin: 'Oral',
      indications: 'Neuropathic pain, chronic pain',
      contra: ['Hypersensitivity'],
      effects: ['Sedation', 'Ataxia', 'Dizziness'],
      presentations: ['Capsules 100mg', 'Capsules 300mg', 'Liquid 50mg/ml'],
    },
    {
      name: 'Buprenorphine',
      category: 'Analgesic',
      dosage: '0.01-0.02 mg/kg every 6-12 hours',
      admin: 'Sublingual, Injectable',
      indications: 'Moderate to severe pain',
      contra: ['Respiratory depression', 'Hypersensitivity'],
      effects: ['Sedation', 'Constipation', 'Respiratory depression'],
      presentations: ['Injection 0.3mg/ml', 'Sublingual 0.2mg'],
    },

    // Antiparasitics
    {
      name: 'Ivermectin',
      category: 'Antiparasitic',
      dosage: '0.2-0.4 mg/kg every 30 days',
      admin: 'Oral, Topical',
      indications: 'Heartworm prevention, mange, intestinal parasites',
      contra: ['Collie breeds', 'Hypersensitivity'],
      effects: [
        'Neurological signs in sensitive breeds',
        'Vomiting',
        'Diarrhea',
      ],
      presentations: ['Tablets 68mcg', 'Topical solution', 'Injection 1%'],
    },
    {
      name: 'Fenbendazole',
      category: 'Antiparasitic',
      dosage: '50 mg/kg every 24 hours for 3-5 days',
      admin: 'Oral',
      indications: 'Roundworms, hookworms, whipworms, tapeworms',
      contra: ['Pregnancy (first trimester)'],
      effects: ['Vomiting', 'Diarrhea'],
      presentations: ['Granules 222mg/g', 'Paste 100mg/ml'],
    },
    {
      name: 'Praziquantel',
      category: 'Antiparasitic',
      dosage: '5-10 mg/kg single dose',
      admin: 'Oral',
      indications: 'Tapeworms, flukes',
      contra: ['Hypersensitivity'],
      effects: ['Vomiting', 'Diarrhea', 'Lethargy'],
      presentations: ['Tablets 50mg', 'Tablets 100mg'],
    },
    {
      name: 'Milbemycin',
      category: 'Antiparasitic',
      dosage: '0.5-1 mg/kg every 30 days',
      admin: 'Oral',
      indications: 'Heartworm prevention, intestinal parasites',
      contra: ['Hypersensitivity'],
      effects: ['Vomiting', 'Diarrhea'],
      presentations: ['Tablets 2.3mg', 'Tablets 5.75mg'],
    },

    // Antifungals
    {
      name: 'Ketoconazole',
      category: 'Antifungal',
      dosage: '5-10 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Fungal infections, ringworm',
      contra: ['Hepatic disease', 'Pregnancy'],
      effects: ['Hepatotoxicity', 'Vomiting', 'Anorexia'],
      presentations: ['Tablets 200mg'],
    },
    {
      name: 'Itraconazole',
      category: 'Antifungal',
      dosage: '5-10 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Systemic fungal infections, ringworm',
      contra: ['Hepatic disease', 'Pregnancy'],
      effects: ['Hepatotoxicity', 'Vomiting', 'Anorexia'],
      presentations: ['Capsules 100mg', 'Liquid 10mg/ml'],
    },
    {
      name: 'Fluconazole',
      category: 'Antifungal',
      dosage: '5-10 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Systemic fungal infections, urinary fungal infections',
      contra: ['Hepatic disease'],
      effects: ['Hepatotoxicity', 'Gastrointestinal upset'],
      presentations: ['Tablets 50mg', 'Tablets 200mg'],
    },

    // Gastrointestinal
    {
      name: 'Omeprazole',
      category: 'Gastrointestinal',
      dosage: '0.5-1 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Gastric ulcers, acid reflux, esophagitis',
      contra: ['Hypersensitivity'],
      effects: ['Vomiting', 'Diarrhea'],
      presentations: ['Capsules 10mg', 'Capsules 20mg'],
    },
    {
      name: 'Famotidine',
      category: 'Gastrointestinal',
      dosage: '0.5-1 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Gastric ulcers, acid reflux',
      contra: ['Hypersensitivity'],
      effects: ['Headache', 'Dizziness'],
      presentations: ['Tablets 10mg', 'Tablets 20mg'],
    },
    {
      name: 'Metoclopramide',
      category: 'Gastrointestinal',
      dosage: '0.2-0.5 mg/kg every 8 hours',
      admin: 'Oral, Injectable',
      indications: 'Nausea, vomiting, gastric stasis',
      contra: ['Gastrointestinal obstruction', 'Epilepsy'],
      effects: ['Sedation', 'Restlessness', 'Extrapyramidal signs'],
      presentations: ['Tablets 5mg', 'Injection 5mg/ml'],
    },

    // Cardiac
    {
      name: 'Enalapril',
      category: 'Cardiac',
      dosage: '0.25-0.5 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Congestive heart failure, hypertension',
      contra: ['Pregnancy', 'Bilateral renal artery stenosis'],
      effects: ['Hypotension', 'Renal impairment', 'Cough'],
      presentations: ['Tablets 2.5mg', 'Tablets 5mg'],
    },
    {
      name: 'Atenolol',
      category: 'Cardiac',
      dosage: '0.25-1 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Arrhythmias, hypertension, hypertrophic cardiomyopathy',
      contra: ['Heart failure', 'Bradycardia', 'Asthma'],
      effects: ['Bradycardia', 'Hypotension', 'Lethargy'],
      presentations: ['Tablets 25mg', 'Tablets 50mg'],
    },
    {
      name: 'Pimobendan',
      category: 'Cardiac',
      dosage: '0.25-0.3 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Congestive heart failure, dilated cardiomyopathy',
      contra: ['Aortic stenosis', 'Hypertrophic cardiomyopathy'],
      effects: ['Vomiting', 'Diarrhea', 'Loss of appetite'],
      presentations: ['Tablets 1.25mg', 'Tablets 5mg'],
    },

    // Anticonvulsants
    {
      name: 'Phenobarbital',
      category: 'Anticonvulsant',
      dosage: '2-5 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Epilepsy, seizures',
      contra: ['Hepatic disease', 'Hypersensitivity'],
      effects: ['Sedation', 'Polyuria', 'Polydipsia', 'Hepatotoxicity'],
      presentations: ['Tablets 15mg', 'Tablets 30mg', 'Tablets 60mg'],
    },
    {
      name: 'Levetiracetam',
      category: 'Anticonvulsant',
      dosage: '20 mg/kg every 8 hours',
      admin: 'Oral',
      indications: 'Epilepsy, seizures',
      contra: ['Hypersensitivity'],
      effects: ['Sedation', 'Ataxia', 'Vomiting'],
      presentations: ['Tablets 250mg', 'Tablets 500mg', 'Liquid 100mg/ml'],
    },
    {
      name: 'Zonisamide',
      category: 'Anticonvulsant',
      dosage: '5-10 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Epilepsy, seizures',
      contra: ['Hepatic disease', 'Hypersensitivity'],
      effects: ['Sedation', 'Ataxia', 'Vomiting'],
      presentations: ['Capsules 25mg', 'Capsules 50mg', 'Capsules 100mg'],
    },

    // Hormones
    {
      name: 'Levothyroxine',
      category: 'Hormone',
      dosage: '0.02 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Hypothyroidism',
      contra: ['Hyperthyroidism', 'Heart disease'],
      effects: ['Restlessness', 'Tachycardia', 'Weight loss'],
      presentations: ['Tablets 0.1mg', 'Tablets 0.2mg', 'Tablets 0.3mg'],
    },
    {
      name: 'Insulin Glargine',
      category: 'Hormone',
      dosage: '0.25-0.5 IU/kg every 12 hours',
      admin: 'Subcutaneous',
      indications: 'Diabetes mellitus',
      contra: ['Hypoglycemia'],
      effects: ['Hypoglycemia', 'Local reactions'],
      presentations: ['Injection 100 IU/ml'],
    },

    // Respiratory
    {
      name: 'Theophylline',
      category: 'Respiratory',
      dosage: '10 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Bronchitis, asthma, respiratory disease',
      contra: ['Cardiac arrhythmias', 'Seizure disorders'],
      effects: ['Tachycardia', 'Restlessness', 'Vomiting'],
      presentations: ['Tablets 100mg', 'Tablets 200mg'],
    },
    {
      name: 'Terbutaline',
      category: 'Respiratory',
      dosage: '0.01-0.02 mg/kg every 8-12 hours',
      admin: 'Oral, Injectable',
      indications: 'Bronchospasm, asthma',
      contra: ['Cardiac arrhythmias', 'Hyperthyroidism'],
      effects: ['Tachycardia', 'Tremors', 'Restlessness'],
      presentations: ['Tablets 2.5mg', 'Injection 1mg/ml'],
    },

    // Ophthalmic
    {
      name: 'Ciprofloxacin Ophthalmic',
      category: 'Ophthalmic',
      dosage: '1-2 drops every 6-12 hours',
      admin: 'Topical',
      indications: 'Bacterial conjunctivitis, corneal ulcers',
      contra: ['Hypersensitivity to quinolones'],
      effects: ['Local irritation', 'Burning sensation'],
      presentations: ['Eye drops 0.3%', 'Ointment 0.3%'],
    },
    {
      name: 'Tobramycin Ophthalmic',
      category: 'Ophthalmic',
      dosage: '1-2 drops every 6-12 hours',
      admin: 'Topical',
      indications: 'Bacterial eye infections',
      contra: ['Hypersensitivity to aminoglycosides'],
      effects: ['Local irritation'],
      presentations: ['Eye drops 0.3%', 'Ointment 0.3%'],
    },

    // Dermatological
    {
      name: 'Cyclosporine',
      category: 'Immunosuppressant',
      dosage: '5-10 mg/kg every 12-24 hours',
      admin: 'Oral',
      indications: 'Atopic dermatitis, immune-mediated diseases',
      contra: ['Malignancy', 'Active infections'],
      effects: ['Vomiting', 'Diarrhea', 'Gingival hyperplasia'],
      presentations: ['Capsules 25mg', 'Capsules 50mg', 'Liquid 100mg/ml'],
    },
    {
      name: 'Apoquel',
      category: 'Dermatological',
      dosage: '0.4-0.6 mg/kg every 12 hours',
      admin: 'Oral',
      indications: 'Atopic dermatitis, pruritus',
      contra: ['Pregnancy', 'Severe infections'],
      effects: [
        'Vomiting',
        'Diarrhea',
        'Increased susceptibility to infections',
      ],
      presentations: ['Tablets 3.6mg', 'Tablets 5.4mg', 'Tablets 16mg'],
    },
  ];

  let id = 1;
  const strengths = [
    '50mg',
    '100mg',
    '250mg',
    '500mg',
    '25mg',
    '75mg',
    '150mg',
    '200mg',
    '10mg',
    '20mg',
    '5mg',
  ];

  // Generate 200 medications
  for (let i = 0; i < 200; i++) {
    const template = medicationTemplates[i % medicationTemplates.length];
    const strength = strengths[Math.floor(Math.random() * strengths.length)];
    const manufacturer =
      manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const species =
      speciesOptions[Math.floor(Math.random() * speciesOptions.length)];
    const presentation =
      template.presentations[
        Math.floor(Math.random() * template.presentations.length)
      ];

    medications.push({
      id: String(id++),
      name: `${template.name} ${strength}`,
      activeIngredient: template.name,
      category: template.category,
      species: [...species],
      dosage: template.dosage,
      administration: template.admin,
      indications: template.indications,
      contraindications: [...template.contra],
      sideEffects: [...template.effects],
      presentation: presentation,
      manufacturer: manufacturer,
    });
  }

  return medications;
};

// Start with generated medications, but allow adding new ones
const medicationsList: Medication[] = generateMedications();

// Add 5 custom medications added by veterinarians
const customMedications: Medication[] = [
  {
    id: String(medicationsList.length + 1),
    name: 'Cefovecin Sodium 200mg',
    activeIngredient: 'Cefovecin',
    category: 'Antibiotic',
    species: ['Dog', 'Cat'],
    dosage: '8 mg/kg subcutaneously every 14 days',
    administration: 'Subcutaneous',
    indications:
      'Skin and soft tissue infections, urinary tract infections in dogs and cats',
    contraindications: ['Hypersensitivity to cephalosporins', 'Pregnancy'],
    sideEffects: ['Injection site reactions', 'Vomiting', 'Diarrhea'],
    presentation: 'Injection 200mg/ml',
    manufacturer: 'Zoetis',
    addedBy: {
      name: 'Dr. Sarah Johnson',
      role: 'Veterinarian',
    },
    organization: 'mr-pet',
  },
  {
    id: String(medicationsList.length + 2),
    name: 'Maropitant Citrate 10mg',
    activeIngredient: 'Maropitant',
    category: 'Gastrointestinal',
    species: ['Dog', 'Cat'],
    dosage: '1 mg/kg every 24 hours for up to 5 days',
    administration: 'Oral, Subcutaneous',
    indications:
      'Prevention and treatment of acute vomiting, prevention of motion sickness',
    contraindications: ['Hypersensitivity', 'Gastrointestinal obstruction'],
    sideEffects: ['Drooling', 'Lethargy', 'Pain at injection site'],
    presentation: 'Tablets 16mg, 24mg, Injection 10mg/ml',
    manufacturer: 'Zoetis',
    addedBy: {
      name: 'Dr. Michael Chen',
      role: 'Veterinarian',
    },
    organization: 'johndoe-org',
  },
  {
    id: String(medicationsList.length + 3),
    name: 'Oclacitinib Maleate 3.6mg',
    activeIngredient: 'Oclacitinib',
    category: 'Dermatological',
    species: ['Dog'],
    dosage: '0.4-0.6 mg/kg every 12 hours for up to 14 days, then once daily',
    administration: 'Oral',
    indications:
      'Control of pruritus associated with allergic dermatitis, control of atopic dermatitis',
    contraindications: [
      'Less than 12 months of age',
      'Serious infections',
      'Pregnancy',
    ],
    sideEffects: ['Vomiting', 'Diarrhea', 'Decreased appetite', 'Lethargy'],
    presentation: 'Tablets 3.6mg, 5.4mg, 16mg',
    manufacturer: 'Zoetis',
    addedBy: {
      name: 'Dr. Emily Rodriguez',
      role: 'Dermatology Specialist',
    },
    organization: 'vete-amigos',
  },
  {
    id: String(medicationsList.length + 4),
    name: 'Toceranib Phosphate 10mg',
    activeIngredient: 'Toceranib',
    category: 'Oncology',
    species: ['Dog'],
    dosage: '3.25 mg/kg every 48 hours',
    administration: 'Oral',
    indications:
      'Treatment of mast cell tumors, treatment of certain types of carcinomas',
    contraindications: ['Pregnancy', 'Active bleeding', 'Severe liver disease'],
    sideEffects: [
      'Diarrhea',
      'Vomiting',
      'Decreased appetite',
      'Lameness',
      'Weight loss',
    ],
    presentation: 'Capsules 10mg, 15mg',
    manufacturer: 'Zoetis',
    addedBy: {
      name: 'Dr. James Wilson',
      role: 'Oncology Specialist',
    },
    organization: 'mr-pet',
  },
  {
    id: String(medicationsList.length + 5),
    name: 'Selamectin Topical Solution',
    activeIngredient: 'Selamectin',
    category: 'Antiparasitic',
    species: ['Dog', 'Cat'],
    dosage: '6-12 mg/kg topically every 30 days',
    administration: 'Topical',
    indications:
      'Flea and tick prevention, heartworm prevention, treatment of ear mites, sarcoptic mange',
    contraindications: ['Hypersensitivity', 'Sick or debilitated animals'],
    sideEffects: [
      'Hair loss at application site',
      'Temporary lethargy',
      'Vomiting',
      'Diarrhea',
    ],
    presentation: 'Topical solution 60mg, 120mg, 240mg',
    manufacturer: 'Zoetis',
    addedBy: {
      name: 'Dr. Lisa Anderson',
      role: 'Veterinarian',
    },
    organization: 'vete-amigos',
  },
];

const mockMedications: Medication[] = [
  ...medicationsList,
  ...customMedications,
];

const categories = [
  'All',
  'Antibiotic',
  'Anti-inflammatory',
  'Corticosteroid',
  'Diuretic',
  'Analgesic',
  'Antiparasitic',
  'Antifungal',
  'Gastrointestinal',
  'Cardiac',
  'Anticonvulsant',
  'Hormone',
  'Respiratory',
  'Ophthalmic',
  'Dermatological',
  'Immunosuppressant',
  'Oncology',
];

const ITEMS_PER_PAGE = 24; // 3 columns x 8 rows (adjustable based on screen size)

function Vademecum() {
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Current user info (in a real app, this would come from auth context)
  const currentUser = {
    name: 'Dr. John Doe',
    role: 'Veterinarian',
    organization: 'johndoe-org', // Current user's organization
  };

  // Helper function to get organization info
  const getOrganizationInfo = (orgSlug: string | undefined) => {
    if (!orgSlug) return null;
    return mockOrganizations.find((org) => org.slug === orgSlug);
  };

  // Helper function to get icon for medication category
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      Antibiotic: <MedicationIcon />,
      'Anti-inflammatory': <HealingIcon />,
      Corticosteroid: <ShieldIcon />,
      Diuretic: <WaterDropIcon />,
      Analgesic: <HospitalIcon />,
      Antiparasitic: <BugReportIcon />,
      Antifungal: <ScienceIcon />,
      Gastrointestinal: <HospitalIcon />,
      Cardiac: <HeartIcon />,
      Anticonvulsant: <PsychologyIcon />,
      Hormone: <BiotechIcon />,
      Respiratory: <AirIcon />,
      Ophthalmic: <EyeIcon />,
      Dermatological: <SpaIcon />,
      Immunosuppressant: <ShieldIcon />,
      Oncology: <VaccinesIcon />,
    };
    return iconMap[category] || <PharmacyIcon />;
  };

  // Memoize filtered medications for better performance
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        med.activeIngredient
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        med.indications.toLowerCase().includes(searchValue.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || med.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [medications, searchValue, categoryFilter]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMedications.length / ITEMS_PER_PAGE)
  );

  // Calculate valid current page (ensure it's within bounds)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Handlers that reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMedications = filteredMedications.slice(startIndex, endIndex);

  // Form for adding new medication
  const medicationForm = useForm<MedicationFormValues>({
    defaultValues: {
      name: '',
      activeIngredient: '',
      category: '',
      species: [],
      dosage: '',
      administration: '',
      indications: '',
      contraindications: [],
      sideEffects: [],
      presentation: '',
      manufacturer: '',
    },
    onSubmit: async ({ value }) => {
      const newMedication: Medication = {
        id: String(medications.length + 1),
        ...value,
        addedBy: {
          name: currentUser.name,
          role: currentUser.role,
        },
        organization: currentUser.organization,
      };
      setMedications([...medications, newMedication]);
      setOpenAddDialog(false);
      medicationForm.reset();
    },
  });

  const availableSpecies = [
    'Dog',
    'Cat',
    'Bird',
    'Rabbit',
    'Ferret',
    'Hamster',
    'Guinea Pig',
    'Horse',
    'Cow',
    'Pig',
  ];
  const availableCategories = [
    'Antibiotic',
    'Anti-inflammatory',
    'Corticosteroid',
    'Diuretic',
    'Analgesic',
    'Antiparasitic',
    'Antifungal',
    'Gastrointestinal',
    'Cardiac',
    'Anticonvulsant',
    'Hormone',
    'Respiratory',
    'Ophthalmic',
    'Dermatological',
    'Immunosuppressant',
    'Oncology',
  ];
  const administrationRoutes = [
    'Oral',
    'Intravenous',
    'Intramuscular',
    'Subcutaneous',
    'Topical',
    'Inhalation',
    'Sublingual',
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Vademecum" onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          padding: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              marginBottom: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: '#24292f', marginBottom: 1 }}
              >
                Veterinary Vademecum
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#57606a', fontSize: '16px' }}
              >
                Quick reference for medications, dosages and indications for
                veterinary use
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Add Medication
            </Button>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginBottom: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* Category Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 200 },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Category"
                sx={{
                  backgroundColor: '#ffffff',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  borderColor: '#2563eb',
                },
                '&:focus-within': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <Box
                sx={{
                  padding: '0 12px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#57606a',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search by name, active ingredient or indication..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{
                  color: '#24292f',
                  padding: '12px 12px 12px 48px',
                  width: '100%',
                  fontSize: '14px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#57606a',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Results Count */}
          <Typography
            variant="body2"
            sx={{ color: '#57606a', marginBottom: 2 }}
          >
            {filteredMedications.length} medication
            {filteredMedications.length !== 1 ? 's' : ''} found
          </Typography>

          {/* Medications Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2,
              marginBottom: 3,
            }}
          >
            {paginatedMedications.map((medication) => (
              <Card
                key={medication.id}
                sx={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => setSelectedMedication(medication)}
              >
                <CardContent sx={{ padding: 2.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 1.5,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                          fontSize: '18px',
                        }}
                      >
                        {medication.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#57606a', fontSize: '13px' }}
                      >
                        {medication.activeIngredient}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        color: '#2563eb',
                        fontSize: '28px',
                        marginLeft: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {getCategoryIcon(medication.category)}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      marginBottom: 1.5,
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Chip
                      label={medication.category}
                      size="small"
                      sx={{
                        backgroundColor: '#e7f3ff',
                        color: '#2563eb',
                        fontWeight: 500,
                        fontSize: '11px',
                        height: '24px',
                      }}
                    />
                    {medication.addedBy && (
                      <Chip
                        label={`Added by ${medication.addedBy.name}`}
                        size="small"
                        sx={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontWeight: 500,
                          fontSize: '10px',
                          height: '24px',
                          border: '1px solid #fbbf24',
                        }}
                      />
                    )}
                    {medication.organization &&
                      (() => {
                        const org = getOrganizationInfo(
                          medication.organization
                        );
                        if (!org) return null;
                        return (
                          <Chip
                            label={org.name}
                            size="small"
                            sx={{
                              backgroundColor: `${org.color}15`,
                              color: org.color,
                              fontWeight: 500,
                              fontSize: '10px',
                              height: '24px',
                              border: `1px solid ${org.color}`,
                            }}
                          />
                        );
                      })()}
                  </Box>

                  <Divider sx={{ marginY: 1.5 }} />

                  <Box sx={{ marginBottom: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#57606a',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Species
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        marginTop: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      {medication.species.map((spec) => (
                        <Chip
                          key={spec}
                          label={spec}
                          size="small"
                          sx={{
                            backgroundColor: '#f6f8fa',
                            color: '#24292f',
                            fontSize: '11px',
                            height: '22px',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ marginBottom: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#57606a',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Dosage
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#24292f',
                        fontSize: '13px',
                        marginTop: 0.5,
                      }}
                    >
                      {medication.dosage}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#57606a',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Administration Route
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#24292f',
                        fontSize: '13px',
                        marginTop: 0.5,
                      }}
                    >
                      {medication.administration}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                marginTop: 3,
                flexWrap: 'wrap',
              }}
            >
              <Pagination
                count={totalPages}
                page={validCurrentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" sx={{ color: '#57606a' }}>
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredMedications.length)} of{' '}
                {filteredMedications.length}
              </Typography>
            </Box>
          )}

          {filteredMedications.length === 0 && (
            <Paper
              sx={{
                padding: 4,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
              }}
            >
              <Typography variant="body1" sx={{ color: '#57606a' }}>
                No medications found with the selected filters
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Medication Detail Modal */}
      {selectedMedication && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: 2,
          }}
          onClick={() => setSelectedMedication(null)}
        >
          <Paper
            sx={{
              maxWidth: 700,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: 3,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 0.5,
                  }}
                >
                  {selectedMedication.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#57606a', fontSize: '15px' }}
                >
                  {selectedMedication.activeIngredient}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Chip
                  label={selectedMedication.category}
                  sx={{
                    backgroundColor: '#e7f3ff',
                    color: '#2563eb',
                    fontWeight: 500,
                  }}
                />
                {selectedMedication.addedBy && (
                  <>
                    <Chip
                      label={`Added by ${selectedMedication.addedBy.name}`}
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 500,
                        border: '1px solid #fbbf24',
                      }}
                    />
                    {selectedMedication.addedBy.role && (
                      <Chip
                        label={selectedMedication.addedBy.role}
                        size="small"
                        sx={{
                          backgroundColor: '#e0e7ff',
                          color: '#4338ca',
                          fontWeight: 500,
                          fontSize: '11px',
                          border: '1px solid #6366f1',
                        }}
                      />
                    )}
                  </>
                )}
                {selectedMedication.organization &&
                  (() => {
                    const org = getOrganizationInfo(
                      selectedMedication.organization
                    );
                    if (!org) return null;
                    return (
                      <Chip
                        label={org.name}
                        sx={{
                          backgroundColor: `${org.color}15`,
                          color: org.color,
                          fontWeight: 500,
                          border: `1px solid ${org.color}`,
                        }}
                      />
                    );
                  })()}
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#24292f',
                    fontWeight: 600,
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                  General Information
                </Typography>
                <Box sx={{ marginLeft: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#57606a', marginBottom: 1 }}
                  >
                    <strong>Species:</strong>{' '}
                    {selectedMedication.species.join(', ')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#57606a', marginBottom: 1 }}
                  >
                    <strong>Presentation:</strong>{' '}
                    {selectedMedication.presentation}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#57606a', marginBottom: 1 }}
                  >
                    <strong>Manufacturer:</strong>{' '}
                    {selectedMedication.manufacturer}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#24292f',
                    fontWeight: 600,
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                  Dosage and Administration
                </Typography>
                <Box sx={{ marginLeft: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#57606a', marginBottom: 1 }}
                  >
                    <strong>Dosage:</strong> {selectedMedication.dosage}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#57606a' }}>
                    <strong>Route:</strong> {selectedMedication.administration}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#24292f',
                    fontWeight: 600,
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                  Indications
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#57606a', marginLeft: 4 }}
                >
                  {selectedMedication.indications}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#24292f',
                    fontWeight: 600,
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <WarningIcon sx={{ fontSize: '18px', color: '#d97706' }} />
                  Contraindications
                </Typography>
                <Box sx={{ marginLeft: 4 }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {selectedMedication.contraindications.map((contra, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" sx={{ color: '#57606a' }}>
                          {contra}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#24292f',
                    fontWeight: 600,
                    marginBottom: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <WarningIcon sx={{ fontSize: '18px', color: '#d97706' }} />
                  Side Effects
                </Typography>
                <Box sx={{ marginLeft: 4 }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {selectedMedication.sideEffects.map((effect, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" sx={{ color: '#57606a' }}>
                          {effect}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Add Medication Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          medicationForm.reset();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
          },
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            medicationForm.handleSubmit();
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #d0d7de',
              paddingBottom: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#24292f' }}>
              Add New Medication
            </Typography>
            <IconButton
              onClick={() => {
                setOpenAddDialog(false);
                medicationForm.reset();
              }}
              sx={{ color: '#57606a' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ paddingTop: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name */}
              <medicationForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Medication name is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    fullWidth
                    label="Medication Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    placeholder="e.g., Amoxicillin 250mg"
                  />
                )}
              </medicationForm.Field>

              {/* Active Ingredient */}
              <medicationForm.Field
                name="activeIngredient"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Active ingredient is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    fullWidth
                    label="Active Ingredient"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    placeholder="e.g., Amoxicillin"
                  />
                )}
              </medicationForm.Field>

              {/* Category and Manufacturer */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <medicationForm.Field
                  name="category"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Category is required' : undefined,
                  }}
                >
                  {(field) => (
                    <FormControl
                      fullWidth
                      error={!!field.state.meta.errors.length}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        label="Category"
                      >
                        {availableCategories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                      {field.state.meta.errors[0] && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}
                        >
                          {field.state.meta.errors[0]}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </medicationForm.Field>

                <medicationForm.Field
                  name="manufacturer"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Manufacturer is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Manufacturer"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors[0]}
                      placeholder="e.g., VetPharma"
                    />
                  )}
                </medicationForm.Field>
              </Box>

              {/* Species */}
              <medicationForm.Field
                name="species"
                validators={{
                  onChange: ({ value }) =>
                    value.length === 0
                      ? 'At least one species is required'
                      : undefined,
                }}
              >
                {(field) => (
                  <Autocomplete
                    multiple
                    options={availableSpecies}
                    value={field.state.value}
                    onChange={(_, newValue) => field.handleChange(newValue)}
                    onBlur={field.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Species"
                        error={!!field.state.meta.errors.length}
                        helperText={field.state.meta.errors[0]}
                        placeholder="Select species"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          size="small"
                        />
                      ))
                    }
                  />
                )}
              </medicationForm.Field>

              {/* Dosage and Administration */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <medicationForm.Field
                  name="dosage"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Dosage is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Dosage"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors[0]}
                      placeholder="e.g., 10-20 mg/kg every 8-12 hours"
                    />
                  )}
                </medicationForm.Field>

                <medicationForm.Field
                  name="administration"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Administration route is required' : undefined,
                  }}
                >
                  {(field) => (
                    <FormControl
                      fullWidth
                      error={!!field.state.meta.errors.length}
                    >
                      <InputLabel>Administration Route</InputLabel>
                      <Select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        label="Administration Route"
                      >
                        {administrationRoutes.map((route) => (
                          <MenuItem key={route} value={route}>
                            {route}
                          </MenuItem>
                        ))}
                      </Select>
                      {field.state.meta.errors[0] && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}
                        >
                          {field.state.meta.errors[0]}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </medicationForm.Field>
              </Box>

              {/* Presentation */}
              <medicationForm.Field
                name="presentation"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Presentation is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    fullWidth
                    label="Presentation"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    placeholder="e.g., Tablets 250mg, Suspension 50mg/ml"
                  />
                )}
              </medicationForm.Field>

              {/* Indications */}
              <medicationForm.Field
                name="indications"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Indications are required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    fullWidth
                    label="Indications"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    multiline
                    rows={3}
                    placeholder="e.g., Bacterial infections of the respiratory, urinary tract and skin"
                  />
                )}
              </medicationForm.Field>

              {/* Contraindications */}
              <medicationForm.Field name="contraindications">
                {(field) => (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#24292f',
                        marginBottom: 1,
                      }}
                    >
                      Contraindications
                    </Typography>
                    {field.state.value.map((contra, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', gap: 1, marginBottom: 1 }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          value={contra}
                          onChange={(e) => {
                            const newContras = [...field.state.value];
                            newContras[index] = e.target.value;
                            field.handleChange(newContras);
                          }}
                          placeholder="Enter contraindication"
                        />
                        <IconButton
                          onClick={() => {
                            const newContras = field.state.value.filter(
                              (_, i) => i !== index
                            );
                            field.handleChange(newContras);
                          }}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        field.handleChange([...field.state.value, '']);
                      }}
                      sx={{ marginTop: 1 }}
                    >
                      Add Contraindication
                    </Button>
                  </Box>
                )}
              </medicationForm.Field>

              {/* Side Effects */}
              <medicationForm.Field name="sideEffects">
                {(field) => (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#24292f',
                        marginBottom: 1,
                      }}
                    >
                      Side Effects
                    </Typography>
                    {field.state.value.map((effect, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', gap: 1, marginBottom: 1 }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          value={effect}
                          onChange={(e) => {
                            const newEffects = [...field.state.value];
                            newEffects[index] = e.target.value;
                            field.handleChange(newEffects);
                          }}
                          placeholder="Enter side effect"
                        />
                        <IconButton
                          onClick={() => {
                            const newEffects = field.state.value.filter(
                              (_, i) => i !== index
                            );
                            field.handleChange(newEffects);
                          }}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        field.handleChange([...field.state.value, '']);
                      }}
                      sx={{ marginTop: 1 }}
                    >
                      Add Side Effect
                    </Button>
                  </Box>
                )}
              </medicationForm.Field>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: '1px solid #d0d7de',
              padding: 2,
              gap: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenAddDialog(false);
                medicationForm.reset();
              }}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={medicationForm.state.isSubmitting}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
                textTransform: 'none',
              }}
            >
              Add Medication
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
