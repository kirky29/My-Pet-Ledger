#!/usr/bin/env node

/**
 * Migration script to transfer data from local JSON files to Firestore
 * Run this script with: node scripts/migrate-to-firestore.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs').promises;
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbiJPaMIv6uVqfjmR00MsrwciVkRc3JQg",
  authDomain: "my-pet-ledger.firebaseapp.com",
  projectId: "my-pet-ledger",
  storageBucket: "my-pet-ledger.firebasestorage.app",
  messagingSenderId: "658885577617",
  appId: "1:658885577617:web:2eb0dc7af0292bb6182830"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to clean data for Firestore (remove undefined values)
function cleanForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

async function migrateAnimals() {
  console.log('🔄 Migrating animals data...');
  
  try {
    const animalsPath = path.join(process.cwd(), 'data', 'animals.json');
    const animalsData = await fs.readFile(animalsPath, 'utf-8');
    const animals = JSON.parse(animalsData);
    
    let migratedCount = 0;
    
    for (const animal of animals) {
      try {
        const cleanedAnimal = cleanForFirestore(animal);
        const docRef = doc(db, 'animals', animal.id);
        
        await setDoc(docRef, {
          ...cleanedAnimal,
          // Convert ISO strings to server timestamps for better querying
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        migratedCount++;
        console.log(`✅ Migrated animal: ${animal.name} (${animal.id})`);
      } catch (error) {
        console.error(`❌ Failed to migrate animal ${animal.name}:`, error.message);
      }
    }
    
    console.log(`🎉 Successfully migrated ${migratedCount}/${animals.length} animals`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️  No animals.json file found - skipping animals migration');
    } else {
      console.error('❌ Error reading animals data:', error.message);
    }
  }
}

async function migrateSettings() {
  console.log('🔄 Migrating settings data...');
  
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    const settingsData = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsData);
    
    const cleanedSettings = cleanForFirestore(settings);
    const docRef = doc(db, 'settings', 'app-settings');
    
    await setDoc(docRef, {
      ...cleanedSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Successfully migrated settings');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️  No settings.json file found - skipping settings migration');
    } else {
      console.error('❌ Error migrating settings:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting migration to Firestore...\n');
  
  try {
    await migrateAnimals();
    console.log('');
    await migrateSettings();
    console.log('\n🎊 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy your Firestore security rules');
    console.log('2. Test your app to ensure everything works');
    console.log('3. Optionally backup and remove the local data/ directory');
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
main().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});

module.exports = { main }; 