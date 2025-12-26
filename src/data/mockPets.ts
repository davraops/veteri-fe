export interface Pet {
  id: number;
  name: string;
  lastName: string;
  organization: string;
  assignedTo: string;
  ownerId: number; // ID of the owner
  type: string;
  breed: string;
  gender?: string;
  birthDate?: string;
  birthDateUnknown?: boolean;
  color?: string;
  microchip?: string;
  notes?: string;
}

export const mockPets: Pet[] = [
  {
    id: 1,
    name: 'Max',
    lastName: 'Rodriguez',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 1, // Carlos Rodriguez
    type: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    birthDate: '2020-05-15',
    birthDateUnknown: false,
    color: 'Golden',
    microchip: '123456789012345',
    notes:
      'Friendly and energetic dog. Loves playing fetch and going on long walks.',
  },
  {
    id: 2,
    name: 'Luna',
    lastName: 'Martinez',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 2, // Maria Martinez
    type: 'Cat',
    breed: 'Persian',
    gender: 'Female',
    birthDate: '2019-08-20',
    birthDateUnknown: false,
    color: 'White',
    microchip: '234567890123456',
    notes: 'Calm and affectionate. Enjoys quiet time and gentle petting.',
  },
  {
    id: 3,
    name: 'Bella',
    lastName: 'Garcia',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 3, // James Garcia
    type: 'Dog',
    breed: 'Labrador',
    gender: 'Female',
    birthDate: '2021-03-10',
    birthDateUnknown: false,
    color: 'Black',
    microchip: '345678901234567',
    notes: 'Very playful and social. Great with children and other dogs.',
  },
  {
    id: 4,
    name: 'Charlie',
    lastName: 'Lopez',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 4, // Sarah Lopez
    type: 'Dog',
    breed: 'Beagle',
    gender: 'Male',
    birthDate: '2020-11-25',
    birthDateUnknown: false,
    color: 'Tri-color',
    microchip: '456789012345678',
    notes: 'Curious and active. Loves exploring and following scents.',
  },
  {
    id: 5,
    name: 'Milo',
    lastName: 'Sanchez',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 5, // Michael Sanchez
    type: 'Cat',
    breed: 'Siamese',
    gender: 'Male',
    birthDate: '2021-07-05',
    birthDateUnknown: false,
    color: 'Seal Point',
    microchip: '567890123456789',
    notes: 'Vocal and intelligent. Enjoys interactive toys and puzzles.',
  },
  {
    id: 6,
    name: 'Daisy',
    lastName: 'Perez',
    organization: 'johndoe',
    assignedTo: 'johndoe',
    ownerId: 6, // Emily Perez
    type: 'Dog',
    breed: 'Bulldog',
    gender: 'Female',
    birthDate: '2019-12-18',
    birthDateUnknown: false,
    color: 'Brindle',
    microchip: '678901234567890',
    notes: 'Gentle and calm. Prefers shorter walks and indoor activities.',
  },
  {
    id: 7,
    name: 'Rocky',
    lastName: 'Fernandez',
    organization: 'mr-pet',
    assignedTo: 'mr-pet',
    ownerId: 7, // David Fernandez
    type: 'Dog',
    breed: 'German Shepherd',
    gender: 'Male',
    birthDate: '2020-02-14',
    birthDateUnknown: false,
    color: 'Black and Tan',
    microchip: '789012345678901',
    notes: 'Loyal and protective. Excellent guard dog with proper training.',
  },
  {
    id: 8,
    name: 'Coco',
    lastName: 'Gonzalez',
    organization: 'mr-pet',
    assignedTo: 'mr-pet',
    ownerId: 8, // Lisa Gonzalez
    type: 'Dog',
    breed: 'Poodle',
    gender: 'Female',
    birthDate: '2021-01-30',
    birthDateUnknown: false,
    color: 'Apricot',
    microchip: '890123456789012',
    notes: 'Intelligent and trainable. Requires regular grooming.',
  },
  {
    id: 9,
    name: 'Simba',
    lastName: 'Torres',
    organization: 'vete-amigos',
    assignedTo: 'vete-amigos',
    ownerId: 9, // Robert Torres
    type: 'Cat',
    breed: 'Maine Coon',
    gender: 'Male',
    birthDate: '2020-06-22',
    birthDateUnknown: false,
    color: 'Brown Tabby',
    microchip: '901234567890123',
    notes: 'Large and friendly. Enjoys being around people and other pets.',
  },
  {
    id: 10,
    name: 'Oreo',
    lastName: 'Ramirez',
    organization: 'vete-amigos',
    assignedTo: 'vete-amigos',
    ownerId: 10, // Jennifer Ramirez
    type: 'Cat',
    breed: 'British Shorthair',
    gender: 'Male',
    birthDate: '2021-04-08',
    birthDateUnknown: false,
    color: 'Black and White',
    microchip: '012345678901234',
    notes: 'Calm and easygoing. Perfect indoor companion.',
  },
];
