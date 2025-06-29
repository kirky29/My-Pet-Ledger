'use client'

import { useState } from 'react'
import { FieldOptions } from '@/types/settings'
import { Palette, Plus, X, Edit2 } from 'lucide-react'

interface FieldOptionsSettingsProps {
  settings: FieldOptions
  onChange: (updates: Partial<FieldOptions>) => void
}

export default function FieldOptionsSettings({ settings, onChange }: FieldOptionsSettingsProps) {
  const [newSpecies, setNewSpecies] = useState('')
  const [newColor, setNewColor] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('')
  const [newBreed, setNewBreed] = useState('')

  const handleAddSpecies = () => {
    if (newSpecies.trim() && !settings.species.includes(newSpecies.trim())) {
      onChange({
        species: [...settings.species, newSpecies.trim()]
      })
      setNewSpecies('')
    }
  }

  const handleRemoveSpecies = (species: string) => {
    onChange({
      species: settings.species.filter(s => s !== species),
      breeds: Object.fromEntries(
        Object.entries(settings.breeds).filter(([key]) => key !== species)
      )
    })
  }

  const handleAddBreed = () => {
    if (newBreed.trim() && selectedSpecies) {
      const existingBreeds = settings.breeds[selectedSpecies] || []
      if (!existingBreeds.includes(newBreed.trim())) {
        onChange({
          breeds: {
            ...settings.breeds,
            [selectedSpecies]: [...existingBreeds, newBreed.trim()]
          }
        })
        setNewBreed('')
      }
    }
  }

  const handleRemoveBreed = (species: string, breed: string) => {
    const updatedBreeds = settings.breeds[species]?.filter(b => b !== breed) || []
    onChange({
      breeds: {
        ...settings.breeds,
        [species]: updatedBreeds
      }
    })
  }

  const handleAddColor = () => {
    if (newColor.trim() && !settings.colors.includes(newColor.trim())) {
      onChange({
        colors: [...settings.colors, newColor.trim()]
      })
      setNewColor('')
    }
  }

  const handleRemoveColor = (color: string) => {
    onChange({
      colors: settings.colors.filter(c => c !== color)
    })
  }

  const handleAddWeightUnit = (unit: string) => {
    if (unit.trim() && !settings.measurementUnits.weight.includes(unit.trim())) {
      onChange({
        measurementUnits: {
          ...settings.measurementUnits,
          weight: [...settings.measurementUnits.weight, unit.trim()]
        }
      })
    }
  }

  const handleAddHeightUnit = (unit: string) => {
    if (unit.trim() && !settings.measurementUnits.height.includes(unit.trim())) {
      onChange({
        measurementUnits: {
          ...settings.measurementUnits,
          height: [...settings.measurementUnits.height, unit.trim()]
        }
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
          <Palette className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-earth-900">Field Options</h2>
          <p className="text-earth-600">Customize available options for animal data fields</p>
        </div>
      </div>

      {/* Species Management */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Species</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newSpecies}
            onChange={(e) => setNewSpecies(e.target.value)}
            placeholder="Add new species..."
            className="form-input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSpecies()}
          />
          <button onClick={handleAddSpecies} className="btn-primary px-3 py-2">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {settings.species.map(species => (
            <div key={species} className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
              <span className="text-sm">{species}</span>
              <button
                onClick={() => handleRemoveSpecies(species)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Breeds Management */}
      <div className="card bg-green-50 border-green-200">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Breeds</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="form-input"
          >
            <option value="">Select species...</option>
            {settings.species.map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newBreed}
              onChange={(e) => setNewBreed(e.target.value)}
              placeholder="Add breed..."
              className="form-input flex-1"
              disabled={!selectedSpecies}
              onKeyPress={(e) => e.key === 'Enter' && handleAddBreed()}
            />
            <button
              onClick={handleAddBreed}
              disabled={!selectedSpecies}
              className="btn-primary px-3 py-2 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {selectedSpecies && (
          <div>
            <h4 className="font-medium text-earth-800 mb-2">{selectedSpecies} Breeds:</h4>
            <div className="flex flex-wrap gap-2">
              {(settings.breeds[selectedSpecies] || []).map(breed => (
                <div key={breed} className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                  <span className="text-sm">{breed}</span>
                  <button
                    onClick={() => handleRemoveBreed(selectedSpecies, breed)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Colors Management */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Colors</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Add new color..."
            className="form-input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
          />
          <button onClick={handleAddColor} className="btn-primary px-3 py-2">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {settings.colors.map(color => (
            <div key={color} className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
              <span className="text-sm">{color}</span>
              <button
                onClick={() => handleRemoveColor(color)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight Units */}
        <div className="card bg-orange-50 border-orange-200">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">Weight Units</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {settings.measurementUnits.weight.map(unit => (
              <div key={unit} className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                <span className="text-sm">{unit}</span>
                <button
                  onClick={() => onChange({
                    measurementUnits: {
                      ...settings.measurementUnits,
                      weight: settings.measurementUnits.weight.filter(u => u !== unit)
                    }
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add weight unit..."
              className="form-input flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddWeightUnit((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>
        </div>

        {/* Height Units */}
        <div className="card bg-teal-50 border-teal-200">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">Height Units</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {settings.measurementUnits.height.map(unit => (
              <div key={unit} className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                <span className="text-sm">{unit}</span>
                <button
                  onClick={() => onChange({
                    measurementUnits: {
                      ...settings.measurementUnits,
                      height: settings.measurementUnits.height.filter(u => u !== unit)
                    }
                  })}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add height unit..."
              className="form-input flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddHeightUnit((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 