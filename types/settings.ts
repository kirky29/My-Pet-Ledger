export interface AppSettings {
  id: string
  currency: CurrencySettings
  fieldOptions: FieldOptions
  display: DisplaySettings
  notifications: NotificationSettings
  createdAt: string
  updatedAt: string
}

export interface CurrencySettings {
  code: string // USD, EUR, GBP, CAD, AUD, etc.
  symbol: string // $, €, £, etc.
  position: 'before' | 'after' // $100 or 100$
  decimals: number // 0, 2, etc.
}

export interface FieldOptions {
  species: string[] // Custom species list
  breeds: Record<string, string[]> // breeds by species
  colors: string[] // Custom color options
  measurementUnits: {
    weight: string[] // kg, lbs, oz, g
    height: string[] // cm, inches, feet
  }
  customFields: CustomField[]
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'select' | 'date' | 'textarea'
  options?: string[] // for select type
  required: boolean
  category: 'basic' | 'medical' | 'physical' | 'other'
  enabled: boolean
}

export interface DisplaySettings {
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  language: string
  showDeceased: boolean
  defaultView: 'grid' | 'list'
  itemsPerPage: number
}

export interface NotificationSettings {
  emailReminders: boolean
  upcomingAppointments: boolean
  vaccinationReminders: boolean
  birthdayReminders: boolean
  emailAddress?: string
}

export interface SettingsFormData {
  currency: CurrencySettings
  fieldOptions: FieldOptions
  display: DisplaySettings
  notifications: NotificationSettings
}

// Default settings
export const defaultSettings: AppSettings = {
  id: 'default',
  currency: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimals: 2
  },
  fieldOptions: {
    species: [
      'Dog', 'Cat', 'Horse', 'Rabbit', 'Bird', 'Fish', 'Reptile', 
      'Rodent', 'Pig', 'Goat', 'Sheep', 'Cow', 'Chicken', 'Duck', 
      'Ferret', 'Hedgehog', 'Other'
    ],
    breeds: {
      'Dog': ['Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund'],
      'Cat': ['Domestic Shorthair', 'Domestic Longhair', 'Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'British Shorthair', 'Abyssinian', 'Russian Blue', 'Bengal'],
      'Horse': ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Paint Horse', 'Appaloosa', 'Mustang', 'Friesian', 'Clydesdale', 'Shire', 'Andalusian'],
      'Bird': ['Parakeet', 'Cockatiel', 'Canary', 'Finch', 'Lovebird', 'Conure', 'Macaw', 'Cockatoo', 'African Grey', 'Budgie']
    },
    colors: [
      'Black', 'White', 'Brown', 'Gray', 'Tan', 'Golden', 'Red', 'Blue', 
      'Silver', 'Cream', 'Chocolate', 'Brindle', 'Tricolor', 'Spotted', 
      'Striped', 'Piebald', 'Roan', 'Dappled', 'Merle', 'Sable'
    ],
    measurementUnits: {
      weight: ['lbs', 'kg', 'oz', 'g'],
      height: ['inches', 'cm', 'feet', 'hands']
    },
    customFields: []
  },
  display: {
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    showDeceased: false,
    defaultView: 'grid',
    itemsPerPage: 12
  },
  notifications: {
    emailReminders: false,
    upcomingAppointments: false,
    vaccinationReminders: false,
    birthdayReminders: false
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Currency options
export const availableCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' }
] 