export interface Procedure {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  preparation: string[];
  steps: string[];
  notes: string;
  addedBy?: {
    name: string;
    role?: string;
  };
  organization?: string;
}

// Mock data for procedures
export const generateProcedures = (): Procedure[] => {
  const procedures: Procedure[] = [
    {
      id: '1',
      name: 'Physical Examination',
      category: 'Examination',
      description:
        'Complete physical examination of the patient including vital signs, body condition, and system evaluation.',
      duration: '15-30 minutes',
      preparation: ['Stethoscope', 'Thermometer', 'Otoscope', 'Ophthalmoscope'],
      steps: [
        'Obtain patient history from owner',
        'Observe patient behavior and posture',
        'Check vital signs (temperature, heart rate, respiratory rate)',
        'Perform head-to-tail examination',
        'Auscultate heart and lungs',
        'Palpate abdomen',
        'Check skin and coat condition',
        'Examine eyes, ears, nose, and mouth',
        'Assess musculoskeletal system',
        'Document findings',
      ],
      notes:
        'Always approach calmly and allow patient to acclimate. Use appropriate restraint techniques.',
    },
    {
      id: '2',
      name: 'Blood Test',
      category: 'Diagnostic',
      description:
        'Collection of blood sample for laboratory analysis including CBC, chemistry panel, and specific tests.',
      duration: '10-15 minutes',
      preparation: [
        'Syringe',
        'Needles (various sizes)',
        'Blood collection tubes',
        'Antiseptic',
        'Gauze',
      ],
      steps: [
        'Identify appropriate venipuncture site',
        'Apply tourniquet if needed',
        'Clean site with antiseptic',
        'Insert needle into vein',
        'Collect required volume of blood',
        'Remove needle and apply pressure',
        'Transfer blood to appropriate tubes',
        'Label samples correctly',
        'Store samples appropriately',
      ],
      notes:
        'Use appropriate needle size for patient. Handle samples carefully to avoid hemolysis.',
    },
    {
      id: '3',
      name: 'Vaccination',
      category: 'Preventive',
      description:
        'Administration of vaccines according to vaccination protocol and patient needs.',
      duration: '5-10 minutes',
      preparation: [
        'Vaccine vials',
        'Syringes and needles',
        'Alcohol swabs',
        'Vaccination record',
      ],
      steps: [
        'Verify patient identity',
        'Check vaccination history',
        'Select appropriate vaccines',
        'Prepare vaccine according to manufacturer instructions',
        'Choose injection site (subcutaneous or intramuscular)',
        'Clean injection site',
        'Administer vaccine',
        'Record vaccination in patient file',
        'Provide post-vaccination instructions',
      ],
      notes:
        'Always check for contraindications. Monitor for adverse reactions. Keep vaccines refrigerated.',
    },
    {
      id: '4',
      name: 'Dental Cleaning',
      category: 'Dental',
      description:
        'Professional dental cleaning including scaling, polishing, and oral examination.',
      duration: '30-60 minutes',
      preparation: [
        'Dental scaler',
        'Ultrasonic scaler',
        'Polishing paste',
        'Dental probe',
        'Anesthesia equipment',
      ],
      steps: [
        'Perform pre-anesthetic examination',
        'Induce anesthesia',
        'Perform oral examination',
        'Remove tartar and plaque',
        'Polish teeth',
        'Apply fluoride treatment if indicated',
        'Document findings and grade',
        'Provide post-procedure care instructions',
      ],
      notes:
        'Requires general anesthesia. Monitor patient closely during procedure.',
    },
    {
      id: '5',
      name: 'X-Ray',
      category: 'Diagnostic',
      description: 'Radiographic imaging for diagnostic purposes.',
      duration: '15-30 minutes',
      preparation: [
        'X-ray machine',
        'Radiographic film or digital sensor',
        'Positioning aids',
        'Lead aprons',
      ],
      steps: [
        'Review indication for radiograph',
        'Position patient appropriately',
        'Set appropriate exposure settings',
        'Ensure proper collimation',
        'Take radiograph',
        'Review image quality',
        'Interpret findings',
        'Document in patient record',
      ],
      notes:
        'Follow radiation safety protocols. Use appropriate positioning for diagnostic quality images.',
    },
    {
      id: '6',
      name: 'Ear Cleaning',
      category: 'Treatment',
      description: 'Cleaning and examination of the external ear canal.',
      duration: '10-15 minutes',
      preparation: [
        'Ear cleaning solution',
        'Cotton balls',
        'Otoscope',
        'Tweezers',
      ],
      steps: [
        'Examine external ear',
        'Use otoscope to visualize ear canal',
        'Apply ear cleaning solution',
        'Massage ear base',
        'Wipe away debris',
        'Re-examine ear canal',
        'Apply medication if needed',
        'Provide home care instructions',
      ],
      notes:
        'Be gentle to avoid trauma. Stop if patient shows signs of pain or discomfort.',
    },
    {
      id: '7',
      name: 'Nail Trimming',
      category: 'Grooming',
      description: 'Trimming of nails to appropriate length.',
      duration: '5-10 minutes',
      preparation: ['Nail clippers', 'Styptic powder', 'File'],
      steps: [
        'Restrain patient appropriately',
        'Identify quick location',
        'Trim nails carefully',
        'Apply styptic if bleeding occurs',
        'File rough edges',
        'Reward patient',
      ],
      notes:
        'Avoid cutting the quick. Use appropriate restraint to prevent injury.',
    },
    {
      id: '8',
      name: 'Urinalysis',
      category: 'Diagnostic',
      description: 'Collection and analysis of urine sample.',
      duration: '10-15 minutes',
      preparation: [
        'Urine collection container',
        'Dipsticks',
        'Microscope',
        'Centrifuge',
      ],
      steps: [
        'Collect urine sample (cystocentesis, catheterization, or free catch)',
        'Perform physical examination of urine',
        'Use dipstick for chemical analysis',
        'Prepare sediment for microscopic examination',
        'Examine under microscope',
        'Document findings',
        'Interpret results',
      ],
      notes:
        'Handle samples promptly. Use appropriate collection method based on indication.',
    },
    {
      id: '9',
      name: 'Ultrasound Examination',
      category: 'Diagnostic',
      description:
        'Non-invasive imaging using ultrasound technology to visualize internal organs and structures.',
      duration: '20-45 minutes',
      preparation: [
        'Ultrasound machine',
        'Ultrasound gel',
        'Clippers',
        'Alcohol',
        'Coupling agent',
      ],
      steps: [
        'Prepare patient area and clip hair if needed',
        'Apply ultrasound gel to transducer',
        'Position patient appropriately',
        'Systematically scan target area',
        'Document images and measurements',
        'Interpret findings',
        'Clean patient and equipment',
      ],
      notes:
        'Ensure good contact between transducer and skin. Use appropriate frequency for target depth.',
    },
    {
      id: '10',
      name: 'Suture Removal',
      category: 'Treatment',
      description:
        'Removal of surgical or traumatic wound sutures after appropriate healing period.',
      duration: '5-10 minutes',
      preparation: ['Suture scissors', 'Forceps', 'Antiseptic', 'Gauze'],
      steps: [
        'Examine wound for healing progress',
        'Clean area with antiseptic',
        'Lift suture knot with forceps',
        'Cut suture below knot',
        'Remove suture material',
        'Inspect wound closure',
        'Apply topical treatment if needed',
      ],
      notes:
        'Ensure adequate healing before removal. Check for signs of infection or dehiscence.',
    },
    {
      id: '11',
      name: 'Wound Dressing',
      category: 'Treatment',
      description:
        'Application of appropriate dressing to protect and promote healing of wounds.',
      duration: '10-15 minutes',
      preparation: [
        'Sterile gauze',
        'Bandage material',
        'Antiseptic',
        'Tape',
        'Scissors',
      ],
      steps: [
        'Assess wound condition',
        'Clean wound with appropriate solution',
        'Apply topical medication if indicated',
        'Place primary dressing',
        'Apply secondary bandage layer',
        'Secure with tape',
        'Provide care instructions',
      ],
      notes:
        'Change dressings regularly. Monitor for signs of infection or excessive discharge.',
    },
    {
      id: '12',
      name: 'Cystocentesis',
      category: 'Diagnostic',
      description:
        'Sterile collection of urine directly from the bladder using a needle.',
      duration: '5-10 minutes',
      preparation: [
        'Syringe',
        'Needle (22-25 gauge)',
        'Antiseptic',
        'Ultrasound (optional)',
      ],
      steps: [
        'Position patient in dorsal or lateral recumbency',
        'Locate bladder (palpation or ultrasound)',
        'Prepare site with antiseptic',
        'Insert needle into bladder',
        'Aspirate urine sample',
        'Remove needle and apply pressure',
        'Transfer to appropriate container',
      ],
      notes:
        'Preferred method for bacterial culture. Avoid if bladder is empty or patient is uncooperative.',
    },
    {
      id: '13',
      name: 'Euthanasia',
      category: 'Emergency',
      description:
        'Humane ending of life for terminally ill or suffering animals.',
      duration: '15-30 minutes',
      preparation: [
        'Euthanasia solution',
        'Syringe and needle',
        'Sedative',
        'Quiet room',
      ],
      steps: [
        'Confirm decision with owner',
        'Obtain informed consent',
        'Administer sedative if needed',
        'Place IV catheter if possible',
        'Administer euthanasia solution',
        'Confirm cessation of vital signs',
        'Provide support to owner',
      ],
      notes:
        'Ensure proper documentation and consent. Provide compassionate support to owners.',
    },
    {
      id: '14',
      name: 'Microchip Implantation',
      category: 'Preventive',
      description: 'Subcutaneous implantation of identification microchip.',
      duration: '5 minutes',
      preparation: ['Microchip', 'Implanter', 'Scanner', 'Antiseptic'],
      steps: [
        'Scan patient to check for existing microchip',
        'Prepare implantation site',
        'Load microchip into implanter',
        'Insert needle subcutaneously',
        'Deploy microchip',
        'Scan to verify placement',
        'Record microchip number',
      ],
      notes:
        'Standard location is between shoulder blades. Register microchip in database.',
    },
    {
      id: '15',
      name: 'Anal Gland Expression',
      category: 'Treatment',
      description:
        'Manual expression of anal sacs to relieve impaction or infection.',
      duration: '5-10 minutes',
      preparation: ['Gloves', 'Lubricant', 'Gauze', 'Antiseptic'],
      steps: [
        'Position patient appropriately',
        'Locate anal glands',
        'Apply gentle pressure externally',
        'Express contents',
        'Clean area',
        'Apply medication if indicated',
        'Document findings',
      ],
      notes: 'Can be done externally or internally. Be gentle to avoid trauma.',
    },
    {
      id: '16',
      name: 'Fecal Examination',
      category: 'Diagnostic',
      description:
        'Microscopic examination of fecal sample for parasites and abnormalities.',
      duration: '10-15 minutes',
      preparation: [
        'Fecal sample',
        'Microscope',
        'Fecal flotation solution',
        'Slides',
      ],
      steps: [
        'Collect fresh fecal sample',
        'Prepare fecal flotation',
        'Allow to stand for appropriate time',
        'Transfer coverslip to slide',
        'Examine under microscope',
        'Identify parasites if present',
        'Document findings',
      ],
      notes:
        'Use fresh sample for best results. Multiple samples may be needed for accurate diagnosis.',
    },
    {
      id: '17',
      name: 'Skin Scraping',
      category: 'Diagnostic',
      description:
        'Collection of skin sample for microscopic examination of parasites.',
      duration: '5-10 minutes',
      preparation: [
        'Scalpel blade',
        'Microscope slides',
        'Mineral oil',
        'Microscope',
      ],
      steps: [
        'Select appropriate lesion site',
        'Apply mineral oil to site',
        'Scrape skin surface with blade',
        'Transfer sample to slide',
        'Add more mineral oil',
        'Examine under microscope',
        'Document findings',
      ],
      notes:
        'Scrape until capillary bleeding occurs for deep parasites. Multiple sites may be needed.',
    },
    {
      id: '18',
      name: 'Bandage Application',
      category: 'Treatment',
      description:
        'Application of supportive bandage for wound protection or limb support.',
      duration: '10-20 minutes',
      preparation: [
        'Primary layer',
        'Secondary layer',
        'Tertiary layer',
        'Tape',
        'Scissors',
      ],
      steps: [
        'Assess injury and determine bandage type',
        'Apply primary contact layer',
        'Apply secondary padding layer',
        'Apply tertiary outer layer',
        'Secure with tape',
        'Check circulation and comfort',
        'Provide care instructions',
      ],
      notes:
        'Ensure proper tension. Monitor for swelling or discomfort. Change regularly.',
    },
    {
      id: '19',
      name: 'Intravenous Catheter Placement',
      category: 'Treatment',
      description:
        'Placement of IV catheter for fluid therapy or medication administration.',
      duration: '5-10 minutes',
      preparation: [
        'IV catheter',
        'Tape',
        'Antiseptic',
        'Extension set',
        'Heparinized saline',
      ],
      steps: [
        'Select appropriate vein',
        'Apply tourniquet',
        'Prepare site with antiseptic',
        'Insert catheter into vein',
        'Advance catheter and remove stylet',
        'Secure with tape',
        'Flush with heparinized saline',
      ],
      notes:
        'Use appropriate catheter size. Secure properly to prevent dislodgement.',
    },
    {
      id: '20',
      name: 'Fluid Therapy Administration',
      category: 'Treatment',
      description:
        'Administration of intravenous or subcutaneous fluids for hydration and support.',
      duration: 'Ongoing',
      preparation: [
        'IV fluids',
        'Administration set',
        'IV catheter',
        'Pump (optional)',
      ],
      steps: [
        'Calculate fluid requirements',
        'Select appropriate fluid type',
        'Set up administration set',
        'Connect to IV catheter',
        'Set flow rate',
        'Monitor patient response',
        'Adjust as needed',
      ],
      notes:
        'Calculate fluid rate based on patient needs. Monitor for overhydration or complications.',
    },
    {
      id: '21',
      name: 'Nebulization',
      category: 'Treatment',
      description:
        'Administration of medication via aerosolized mist for respiratory conditions.',
      duration: '10-15 minutes',
      preparation: ['Nebulizer', 'Medication', 'Mask or chamber', 'Saline'],
      steps: [
        'Prepare medication solution',
        'Fill nebulizer chamber',
        'Attach mask or place in chamber',
        'Turn on nebulizer',
        'Allow patient to inhale mist',
        'Monitor patient during treatment',
        'Clean equipment after use',
      ],
      notes:
        'Use appropriate medication and concentration. Ensure proper fit of mask.',
    },
    {
      id: '22',
      name: 'Oxygen Therapy',
      category: 'Emergency',
      description:
        'Administration of supplemental oxygen for patients with respiratory distress.',
      duration: 'As needed',
      preparation: [
        'Oxygen source',
        'Flowmeter',
        'Mask or nasal cannula',
        'Oxygen cage',
      ],
      steps: [
        'Assess patient oxygen needs',
        'Select delivery method',
        'Set appropriate flow rate',
        'Apply delivery device',
        'Monitor patient response',
        'Adjust as needed',
        'Wean gradually when appropriate',
      ],
      notes:
        'Monitor oxygen saturation if possible. Avoid prolonged high concentrations in some species.',
    },
    {
      id: '23',
      name: 'Temperature Monitoring',
      category: 'Examination',
      description: 'Measurement and monitoring of body temperature.',
      duration: '2-3 minutes',
      preparation: ['Thermometer (digital or rectal)', 'Lubricant'],
      steps: [
        'Prepare thermometer',
        'Apply lubricant if using rectal thermometer',
        'Insert thermometer',
        'Wait for reading',
        'Record temperature',
        'Clean thermometer',
        'Interpret result',
      ],
      notes:
        'Normal range varies by species. Consider environmental factors affecting temperature.',
    },
    {
      id: '24',
      name: 'Weight Measurement',
      category: 'Examination',
      description: 'Accurate measurement of patient body weight.',
      duration: '2-3 minutes',
      preparation: ['Scale (appropriate size)', 'Towel or mat'],
      steps: [
        'Calibrate scale if needed',
        'Place patient on scale',
        'Ensure all four feet on scale',
        'Wait for stable reading',
        'Record weight',
        'Compare to previous weights',
        'Document in record',
      ],
      notes:
        'Use appropriate scale for patient size. Ensure patient is calm and still.',
    },
    {
      id: '25',
      name: 'Blood Pressure Measurement',
      category: 'Diagnostic',
      description:
        'Measurement of arterial blood pressure using appropriate method.',
      duration: '5-10 minutes',
      preparation: [
        'Blood pressure monitor',
        'Appropriate cuff',
        'Ultrasound gel',
      ],
      steps: [
        'Select appropriate cuff size',
        'Position cuff on limb or tail',
        'Apply gel if using Doppler',
        'Inflate cuff',
        'Record systolic and diastolic pressures',
        'Repeat for accuracy',
        'Document findings',
      ],
      notes:
        'Cuff size is critical for accuracy. Allow patient to acclimate before measurement.',
    },
    {
      id: '26',
      name: 'ECG Recording',
      category: 'Diagnostic',
      description:
        'Recording of electrocardiogram to assess cardiac rhythm and conduction.',
      duration: '10-15 minutes',
      preparation: ['ECG machine', 'Electrodes', 'Alcohol', 'Clippers'],
      steps: [
        'Position patient in right lateral recumbency',
        'Clip hair at electrode sites',
        'Clean sites with alcohol',
        'Attach electrodes',
        'Record standard leads',
        'Analyze rhythm',
        'Document findings',
      ],
      notes: 'Minimize movement artifacts. Ensure good electrode contact.',
    },
    {
      id: '27',
      name: 'Gastric Lavage',
      category: 'Emergency',
      description:
        'Washing out of stomach contents, typically for toxin ingestion.',
      duration: '20-30 minutes',
      preparation: [
        'Large bore tube',
        'Warm water or saline',
        'Syringe',
        'Anesthesia',
      ],
      steps: [
        'Induce anesthesia if needed',
        'Measure tube length',
        'Lubricate tube',
        'Pass tube into stomach',
        'Aspirate contents',
        'Lavage with warm fluid',
        'Remove tube and monitor',
      ],
      notes:
        'Time-sensitive procedure. Use appropriate tube size. Monitor for complications.',
    },
    {
      id: '28',
      name: 'Enema Administration',
      category: 'Treatment',
      description:
        'Introduction of fluid into rectum to relieve constipation or prepare for procedure.',
      duration: '10-15 minutes',
      preparation: [
        'Enema solution',
        'Lubricant',
        'Appropriate tube or syringe',
      ],
      steps: [
        'Prepare enema solution',
        'Lubricate tube or tip',
        'Position patient',
        'Gently insert tube',
        'Administer solution slowly',
        'Allow time for retention',
        'Monitor for evacuation',
      ],
      notes: 'Use appropriate solution and volume. Be gentle to avoid trauma.',
    },
    // Custom procedures
    {
      id: '29',
      name: 'Feline Dental Extraction Protocol',
      category: 'Dental',
      description:
        'Specialized protocol for extracting teeth in cats, including pre-operative assessment and post-operative care.',
      duration: '45-90 minutes',
      preparation: [
        'Dental X-ray equipment',
        'Extraction forceps',
        'Elevators',
        'Bone curettes',
        'Suture material',
        'Anesthesia equipment',
      ],
      steps: [
        'Perform pre-operative dental X-rays',
        'Assess periodontal health',
        'Induce general anesthesia',
        'Perform regional nerve block',
        'Elevate gingiva around tooth',
        'Use elevators to loosen tooth',
        'Extract tooth with forceps',
        'Curette socket',
        'Suture gingiva if needed',
        'Take post-operative X-ray',
        'Provide pain management',
        'Schedule follow-up',
      ],
      notes:
        'Cats require special consideration for pain management. Always take pre and post-operative X-rays.',
      addedBy: {
        name: 'Dr. Patricia Williams',
        role: 'Veterinary Dentist',
      },
      organization: 'mr-pet',
    },
    {
      id: '30',
      name: 'Emergency CPR Protocol',
      category: 'Emergency',
      description:
        'Cardiopulmonary resuscitation protocol for veterinary emergencies following RECOVER guidelines.',
      duration: 'Ongoing until ROSC or termination',
      preparation: [
        'Defibrillator',
        'Endotracheal tube',
        'Ambu bag',
        'IV access supplies',
        'Emergency medications',
        'ECG monitor',
      ],
      steps: [
        'Assess responsiveness and breathing',
        'Call for help and start timer',
        'Establish airway (intubate if possible)',
        'Begin chest compressions (100-120/min)',
        'Provide ventilation (10 breaths/min)',
        'Establish IV access',
        'Administer epinephrine every 3-5 minutes',
        'Check for ROSC every 2 minutes',
        'Continue until ROSC or 20 minutes',
        'Document all interventions',
      ],
      notes:
        'Follow RECOVER guidelines. Quality of compressions is critical. Rotate compressors every 2 minutes.',
      addedBy: {
        name: 'Dr. Carlos Mendez',
        role: 'Emergency Veterinarian',
      },
      organization: 'vete-amigos',
    },
    {
      id: '31',
      name: 'Avian Wing Bandaging',
      category: 'Treatment',
      description:
        'Specialized bandaging technique for wing injuries in birds, ensuring proper alignment and minimal stress.',
      duration: '15-20 minutes',
      preparation: [
        'Lightweight bandage material',
        'Vet wrap',
        'Tape',
        'Scissors',
        'Perches for recovery',
      ],
      steps: [
        'Assess wing injury and alignment',
        'Position wing in natural folded position',
        'Apply primary layer (soft padding)',
        'Wrap body to secure wing',
        'Ensure opposite wing is free',
        'Check for proper circulation',
        'Secure with tape',
        'Provide appropriate perching',
        'Monitor for stress signs',
        'Schedule recheck in 3-5 days',
      ],
      notes:
        'Birds are easily stressed. Minimize handling time. Ensure bird can balance and eat. Monitor closely for complications.',
      addedBy: {
        name: 'Dr. Amanda Foster',
        role: 'Avian Specialist',
      },
      organization: 'mr-pet',
    },
    {
      id: '32',
      name: 'Laparoscopic Spay',
      category: 'Surgery',
      description:
        'Minimally invasive ovariohysterectomy using laparoscopic techniques for reduced pain and faster recovery.',
      duration: '30-45 minutes',
      preparation: [
        'Laparoscopic equipment',
        'Trocars',
        'Camera system',
        'Electrocautery',
        'Laparoscopic instruments',
        'CO2 insufflator',
      ],
      steps: [
        'Perform pre-operative examination',
        'Induce general anesthesia',
        'Position patient in dorsal recumbency',
        'Create initial port for camera',
        'Insufflate abdomen with CO2',
        'Insert additional ports for instruments',
        'Locate and identify ovaries',
        'Ligate ovarian vessels',
        'Remove ovaries',
        'Remove uterus if indicated',
        'Deflate abdomen',
        'Close port sites',
        'Monitor recovery',
      ],
      notes:
        'Requires specialized training. Smaller incisions mean less pain and faster recovery. More expensive equipment needed.',
      addedBy: {
        name: 'Dr. Jennifer Kim',
        role: 'Board Certified Surgeon',
      },
      organization: 'johndoe',
    },
    {
      id: '33',
      name: 'Exotic Animal Anesthesia Protocol',
      category: 'Surgery',
      description:
        'Specialized anesthesia protocol for exotic animals including rabbits, ferrets, and small mammals.',
      duration: 'Varies by procedure',
      preparation: [
        'Species-appropriate anesthetic agents',
        'Endotracheal tubes (various sizes)',
        'Ventilator',
        'Warming equipment',
        'Monitoring equipment',
        'Emergency medications',
      ],
      steps: [
        'Calculate appropriate drug dosages for species',
        'Pre-oxygenate patient',
        'Administer pre-medication',
        'Induce anesthesia',
        'Intubate if possible (size permitting)',
        'Maintain on appropriate anesthetic',
        'Monitor vital signs continuously',
        'Maintain body temperature',
        'Provide supportive care',
        'Monitor recovery closely',
      ],
      notes:
        'Exotic animals have unique anesthetic requirements. Dosages vary significantly by species. Always have reversal agents available.',
      addedBy: {
        name: 'Dr. Thomas Rodriguez',
        role: 'Exotic Animal Specialist',
      },
      organization: 'vete-amigos',
    },
  ];

  return procedures;
};

export const mockProcedures = generateProcedures();
