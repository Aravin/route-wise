'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, ArrowLeft, Building2, Bus, Route, Users, Wrench } from 'lucide-react'
import { OrganizationSetup, BusinessSetup, OnboardingComplete } from './index'

interface OnboardingData {
  userId: string
  userEmail?: string
  organization: {
    name: string
    address: string
    regOffice?: string
    phone: string
    phone2: string
    email: string
    website?: string
    gstNumber?: string
    panNumber?: string
  }
  business: {
    busTypes: Array<{
      id: string
      name: string
      acType: 'AC' | 'NON_AC'
      seatingType: 'SEATER' | 'SLEEPER' | 'SEATER_SLEEPER'
      capacity: number
      amenities: ('WIFI' | 'WATER_BOTTLE' | 'BLANKETS' | 'CHARGING_POINT' | 'TOILET' | 'BED_SHEET' | 'TV' | 'USB_PORT' | 'TYPE_C_PORT')[]
      pricing: {
        lowerSeaterPrice: number
        upperSeaterPrice: number
        lowerSleeperPrice: number
        upperSleeperPrice: number
      }
    }>
    routes: Array<{
      id: string
      name: string
      from: string
      to: string
      distance: number
      duration: number
      stops: string[]
    }>
  }
  isComplete: boolean
}

const steps = [
  {
    id: 1,
    title: 'Business Setup',
    description: 'Set up your business details',
    icon: Building2,
    component: OrganizationSetup
  },
  {
    id: 2,
    title: 'Fleet Configuration',
    description: 'Configure bus types and routes',
    icon: Bus,
    component: BusinessSetup
  },
  {
    id: 3,
    title: 'Complete',
    description: 'Onboarding completed successfully',
    icon: CheckCircle,
    component: OnboardingComplete
  }
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/status')
      const data = await response.json()
      
      if (data.isComplete) {
        router.push('/dashboard')
        return
      }
      
      setOnboardingData(data.onboardingData || {
        userId: data.userId,
        userEmail: data.userEmail || 'admin@routewise.com',
        organization: {
          name: '',
          address: '',
          regOffice: '',
          phone: '',
          phone2: '',
          email: data.userEmail || 'admin@routewise.com'
        },
        business: {
          busTypes: [],
          routes: []
        },
        isComplete: false
      })
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => prev ? { ...prev, ...stepData } : null)
  }

  const saveOnboardingData = async (stepData: Partial<OnboardingData>) => {
    try {
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stepData),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      const updatedData = await response.json()
      setOnboardingData(updatedData)
      return updatedData
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      throw error
    }
  }

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    try {
      await saveOnboardingData(stepData)
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Mark onboarding as complete
        await saveOnboardingData({ isComplete: true })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error proceeding to next step:', error)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (!onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Onboarding</h2>
          <p className="text-muted-foreground mb-4">Unable to load onboarding data. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep - 1]
  const CurrentComponent = currentStepData.component
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to RouteWise Admin</h1>
          <p className="text-muted-foreground">Let's set up your business and configure your fleet</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isActive ? 'bg-primary text-primary-foreground' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <currentStepData.icon className="h-5 w-5" />
                <span>{currentStepData.title}</span>
              </CardTitle>
              <CardDescription>
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrentComponent
                data={onboardingData}
                onUpdate={updateOnboardingData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === steps.length - 1}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
