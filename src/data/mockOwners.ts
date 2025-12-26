export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phones: string[]; // Array of phone numbers (up to 3)
  nationalId: string;
  nationality: string;
  address?: string;
  city?: string;
  organization: string;
  pets: number[]; // Array of pet IDs
}

export const mockOwners: Owner[] = [
  {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phones: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
    nationalId: '1234567890',
    nationality: 'American',
    address: '123 Main Street',
    city: 'New York, NY 10001',
    organization: 'johndoe',
    pets: [1], // Max
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Martinez',
    email: 'maria.martinez@email.com',
    phones: ['+1 (555) 234-5678'],
    nationalId: '2345678901',
    nationality: 'Mexican',
    address: '456 Oak Avenue',
    city: 'Los Angeles, CA 90001',
    organization: 'johndoe',
    pets: [2], // Luna
  },
  {
    id: 3,
    firstName: 'James',
    lastName: 'Garcia',
    email: 'james.garcia@email.com',
    phones: ['+1 (555) 345-6789', '+1 (555) 345-6790', '+1 (555) 345-6791'],
    nationalId: '3456789012',
    nationality: 'American',
    address: '789 Pine Road',
    city: 'Chicago, IL 60601',
    organization: 'johndoe',
    pets: [3], // Bella
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Lopez',
    email: 'sarah.lopez@email.com',
    phones: ['+1 (555) 456-7890', '+1 (555) 456-7891'],
    nationalId: '4567890123',
    nationality: 'American',
    address: '321 Elm Street',
    city: 'Houston, TX 77001',
    organization: 'johndoe',
    pets: [4], // Charlie
  },
  {
    id: 5,
    firstName: 'Michael',
    lastName: 'Sanchez',
    email: 'michael.sanchez@email.com',
    phones: ['+1 (555) 567-8901'],
    nationalId: '5678901234',
    nationality: 'Colombian',
    address: '654 Maple Drive',
    city: 'Phoenix, AZ 85001',
    organization: 'johndoe',
    pets: [5], // Milo
  },
  {
    id: 6,
    firstName: 'Emily',
    lastName: 'Perez',
    email: 'emily.perez@email.com',
    phones: ['+1 (555) 678-9012', '+1 (555) 678-9013'],
    nationalId: '6789012345',
    nationality: 'American',
    address: '987 Cedar Lane',
    city: 'Philadelphia, PA 19101',
    organization: 'johndoe',
    pets: [6], // Daisy
  },
  {
    id: 7,
    firstName: 'David',
    lastName: 'Fernandez',
    email: 'david.fernandez@email.com',
    phones: ['+1 (555) 789-0123', '+1 (555) 789-0124', '+1 (555) 789-0125'],
    nationalId: '7890123456',
    nationality: 'Spanish',
    address: '147 Birch Boulevard',
    city: 'San Antonio, TX 78201',
    organization: 'mr-pet',
    pets: [7], // Rocky
  },
  {
    id: 8,
    firstName: 'Lisa',
    lastName: 'Gonzalez',
    email: 'lisa.gonzalez@email.com',
    phones: ['+1 (555) 890-1234'],
    nationalId: '8901234567',
    nationality: 'American',
    address: '258 Spruce Court',
    city: 'San Diego, CA 92101',
    organization: 'mr-pet',
    pets: [8], // Coco
  },
  {
    id: 9,
    firstName: 'Robert',
    lastName: 'Torres',
    email: 'robert.torres@email.com',
    phones: ['+1 (555) 901-2345', '+1 (555) 901-2346'],
    nationalId: '9012345678',
    nationality: 'Puerto Rican',
    address: '369 Willow Way',
    city: 'Dallas, TX 75201',
    organization: 'vete-amigos',
    pets: [9], // Simba
  },
  {
    id: 10,
    firstName: 'Jennifer',
    lastName: 'Ramirez',
    email: 'jennifer.ramirez@email.com',
    phones: ['+1 (555) 012-3456', '+1 (555) 012-3457', '+1 (555) 012-3458'],
    nationalId: '0123456789',
    nationality: 'American',
    address: '741 Ash Street',
    city: 'San Jose, CA 95101',
    organization: 'vete-amigos',
    pets: [10], // Oreo
  },
];
