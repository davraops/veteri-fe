export interface OrganizationMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'owner' | 'veterinarian' | 'veterinary_assistant' | 'admin' | 'staff';
  avatar?: string;
}

export interface Organization {
  id: string; // Unique identifier (slug-based)
  organizationId: number; // Numeric unique identifier
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  color: string;
  members: OrganizationMember[];
  createdAt: string;
  isPersonal: boolean; // Personal organizations are single-user and cannot add members
}

export const mockOrganizations: Organization[] = [
  {
    id: 'johndoe-org',
    organizationId: 1,
    name: "John Doe's",
    slug: 'johndoe-org',
    description:
      'A modern veterinary practice focused on providing exceptional care for pets.',
    address: '123 Main Street',
    city: 'New York, NY 10001',
    phone: '+1 (555) 111-2222',
    email: 'contact@johndoe-org.com',
    website: 'https://johndoe-org.com',
    color: '#2563eb',
    createdAt: '2020-01-15',
    isPersonal: true, // Personal organization - single user only
    members: [
      {
        userId: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@johndoe-org.com',
        role: 'owner',
      },
    ],
  },
  {
    id: 'mr-pet',
    organizationId: 2,
    name: 'Mr. Pet Clinic',
    slug: 'mr-pet',
    description:
      'Full-service veterinary clinic offering comprehensive care for all pets.',
    address: '456 Oak Avenue',
    city: 'Los Angeles, CA 90001',
    phone: '+1 (555) 222-3333',
    email: 'info@mr-pet.com',
    website: 'https://mr-pet.com',
    color: '#10b981',
    createdAt: '2018-03-20',
    isPersonal: false, // Shared organization - can have multiple members
    members: [
      {
        userId: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mr-pet.com',
        role: 'veterinarian',
      },
      {
        userId: 'david-fernandez',
        firstName: 'David',
        lastName: 'Fernandez',
        email: 'david.fernandez@mr-pet.com',
        role: 'owner',
      },
      {
        userId: 'lisa-gonzalez',
        firstName: 'Lisa',
        lastName: 'Gonzalez',
        email: 'lisa.gonzalez@mr-pet.com',
        role: 'veterinarian',
      },
      {
        userId: 'patricia-martinez',
        firstName: 'Patricia',
        lastName: 'Martinez',
        email: 'patricia.martinez@mr-pet.com',
        role: 'veterinarian',
      },
      {
        userId: 'carlos-rodriguez',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        email: 'carlos.rodriguez@mr-pet.com',
        role: 'veterinarian',
      },
      {
        userId: 'sandra-lopez',
        firstName: 'Sandra',
        lastName: 'Lopez',
        email: 'sandra.lopez@mr-pet.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'michael-brown',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@mr-pet.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'amanda-wilson',
        firstName: 'Amanda',
        lastName: 'Wilson',
        email: 'amanda.wilson@mr-pet.com',
        role: 'admin',
      },
      {
        userId: 'james-taylor',
        firstName: 'James',
        lastName: 'Taylor',
        email: 'james.taylor@mr-pet.com',
        role: 'staff',
      },
      {
        userId: 'laura-anderson',
        firstName: 'Laura',
        lastName: 'Anderson',
        email: 'laura.anderson@mr-pet.com',
        role: 'staff',
      },
    ],
  },
  {
    id: 'vete-amigos',
    organizationId: 3,
    name: 'Vete Amigos',
    slug: 'vete-amigos',
    description:
      'Community-focused veterinary practice dedicated to affordable pet care.',
    address: '789 Pine Road',
    city: 'Chicago, IL 60601',
    phone: '+1 (555) 333-4444',
    email: 'hello@vete-amigos.com',
    website: 'https://vete-amigos.com',
    color: '#f97316',
    createdAt: '2019-06-10',
    isPersonal: false, // Shared organization - can have multiple members
    members: [
      {
        userId: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@vete-amigos.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'robert-torres',
        firstName: 'Robert',
        lastName: 'Torres',
        email: 'robert.torres@vete-amigos.com',
        role: 'owner',
      },
      {
        userId: 'jennifer-ramirez',
        firstName: 'Jennifer',
        lastName: 'Ramirez',
        email: 'jennifer.ramirez@vete-amigos.com',
        role: 'veterinarian',
      },
      {
        userId: 'maria-garcia',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@vete-amigos.com',
        role: 'veterinarian',
      },
      {
        userId: 'jose-hernandez',
        firstName: 'Jose',
        lastName: 'Hernandez',
        email: 'jose.hernandez@vete-amigos.com',
        role: 'veterinarian',
      },
      {
        userId: 'ana-martinez',
        firstName: 'Ana',
        lastName: 'Martinez',
        email: 'ana.martinez@vete-amigos.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'luis-rodriguez',
        firstName: 'Luis',
        lastName: 'Rodriguez',
        email: 'luis.rodriguez@vete-amigos.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'carmen-silva',
        firstName: 'Carmen',
        lastName: 'Silva',
        email: 'carmen.silva@vete-amigos.com',
        role: 'veterinary_assistant',
      },
      {
        userId: 'ricardo-morales',
        firstName: 'Ricardo',
        lastName: 'Morales',
        email: 'ricardo.morales@vete-amigos.com',
        role: 'admin',
      },
      {
        userId: 'elena-vargas',
        firstName: 'Elena',
        lastName: 'Vargas',
        email: 'elena.vargas@vete-amigos.com',
        role: 'staff',
      },
      {
        userId: 'fernando-castro',
        firstName: 'Fernando',
        lastName: 'Castro',
        email: 'fernando.castro@vete-amigos.com',
        role: 'staff',
      },
      {
        userId: 'monica-ramirez',
        firstName: 'Monica',
        lastName: 'Ramirez',
        email: 'monica.ramirez@vete-amigos.com',
        role: 'staff',
      },
    ],
  },
];
