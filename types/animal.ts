export interface Animal {
  id: string;
  userId?: string; // Firebase Auth user ID - owner of this animal
  name: string;
  species: AnimalSpecies;
  breed?: string;
  dateOfBirth: string;
  deathDate?: string;
  sex: string;
  color?: string;
  markings?: string;
  profilePicture?: string;
  weight: WeightRecord[];
  height: HeightRecord[];
  events: EventEntry[]; // Comprehensive logging system
  medicalNotes?: string;
  specialNeeds?: string;
  microchipId?: string;
  registrationNumber?: string;
  parentIds?: string[]; // For tracking lineage
  ownerInfo: OwnerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
  unit: 'lbs' | 'kg';
  notes?: string;
}

export interface HeightRecord {
  date: string;
  height: number;
  unit: 'inches' | 'cm' | 'hands'; // hands for horses
  measurementType: 'shoulder' | 'withers' | 'total';
  notes?: string;
}

export interface EventEntry {
  id: string;
  date: string;
  type: EventType;
  title: string;
  description?: string;
  notes?: string;
  veterinarian?: string; // For medical events
  cost?: number; // Optional cost tracking
  attachments?: string[]; // Photo/document URLs
  createdAt: string;
  updatedAt: string;
}

export type EventType = 
  | 'medical' // Vaccinations, treatments, checkups, illnesses
  | 'surgical' // Neutering, spaying, surgeries
  | 'behavioral' // Training, behavioral changes, milestones
  | 'lifecycle' // Birth, adoption, death, breeding, pregnancy
  | 'grooming' // Grooming sessions, nail trims, dental care
  | 'nutrition' // Diet changes, feeding schedules
  | 'exercise' // Exercise routines, activities
  | 'general'; // General notes, observations, other events

export interface OwnerInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type AnimalSpecies = 
  | 'horse'
  | 'dog' 
  | 'cat'
  | 'pig'
  | 'goat'
  | 'llama'
  | 'alpaca'
  | 'ferret'
  | 'parrot'
  | 'bird-of-prey'
  | 'rabbit'
  | 'sheep'
  | 'cow'
  | 'chicken'
  | 'duck'
  | 'other';

export interface AnimalFormData {
  name: string;
  species: AnimalSpecies;
  breed: string;
  dateOfBirth: string;
  deathDate: string;
  sex: string;
  color: string;
  markings: string;
  initialWeight: string;
  weightUnit: 'lbs' | 'kg';
  initialHeight: string;
  heightUnit: 'inches' | 'cm' | 'hands';
  heightMeasurementType: 'shoulder' | 'withers' | 'total';
  medicalNotes: string;
  specialNeeds: string;
  microchipId: string;
  registrationNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
} 