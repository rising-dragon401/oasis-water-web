import BlurredLineItem from '@/components/shared/blurred-line-item'

export default function WaterFilterMetadata({
  contaminantCategories,
}: {
  contaminantCategories: any
}) {
  return (
    <div className="flex md:flex-row flex-col gap-10 gap-y-1 w-full md:mt-2 mt-4">
      <div className="flex flex-col gap-y-1 w-full">
        <BlurredLineItem
          label="Heavy metals"
          value={contaminantCategories['Heavy Metals'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Heavy Metals'] > 70
              ? 'good'
              : contaminantCategories['Heavy Metals'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Fluoride"
          value={contaminantCategories['Fluoride'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Fluoride'] > 70
              ? 'good'
              : contaminantCategories['Fluoride'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Microplastics"
          value={contaminantCategories['Microplastics'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Microplastics'] > 70
              ? 'good'
              : contaminantCategories['Microplastics'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Perfluorinated Chemicals (PFAS)"
          value={contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 70
              ? 'good'
              : contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 30
                ? 'neutral'
                : 'bad'
          }
        />
      </div>

      <div className="flex flex-col gap-y-1 w-full">
        <BlurredLineItem
          label="Trihalomethanes"
          value={contaminantCategories['Trihalomethanes'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Trihalomethanes'] > 70
              ? 'good'
              : contaminantCategories['Trihalomethanes'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Haloacetic Acids"
          value={contaminantCategories['Haloacetic Acids'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Haloacetic Acids'] > 70
              ? 'good'
              : contaminantCategories['Haloacetic Acids'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Chemical Disinfectants"
          value={contaminantCategories['Chemical Disinfectants'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Chemical Disinfectants'] > 70
              ? 'good'
              : contaminantCategories['Chemical Disinfectants'] > 30
                ? 'neutral'
                : 'bad'
          }
        />

        <BlurredLineItem
          label="Radiological Elements"
          value={contaminantCategories['Radiological Elements'] > 70 ? 'Yes' : 'No'}
          isPaywalled={false}
          score={
            contaminantCategories['Radiological Elements'] > 70
              ? 'good'
              : contaminantCategories['Radiological Elements'] > 30
                ? 'neutral'
                : 'bad'
          }
        />
      </div>
    </div>
  )
}
