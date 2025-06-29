import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AnimalForm from '@/components/AnimalForm'
import { getAnimalById } from '@/lib/firestore-data'

interface EditAnimalPageProps {
  params: {
    id: string
  }
}

export default async function EditAnimalPage({ params }: EditAnimalPageProps) {
  const animal = await getAnimalById(params.id)

  if (!animal) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sanctuary-header">
        <Link 
          href={`/animals/${animal.id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {animal.name}'s Profile
        </Link>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent mb-2">
          Edit {animal.name}'s Profile
        </h1>
        <p className="text-earth-700 text-lg">
          Update the information for your beloved pet
        </p>
      </div>

      <AnimalForm animal={animal} isEdit={true} />
    </div>
  )
} 