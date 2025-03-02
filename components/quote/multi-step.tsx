"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Check, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { submitBusinessForm } from "@/actions/actions"

const steps = [
  "Company Information",
  "Contact Details",
  "Business Details",
  "Service Requirements",
  "Meeting Preferences",
]

const timeSlots = ["Morning (9AM - 12PM)", "Afternoon (1PM - 5PM)", "Evening (6PM - 9PM)"]

const industries = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Other"]

export function BusinessOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, formAction] = useActionState(submitBusinessForm, {
    success: false,
    message: "",
    errors: {},
  })

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (

    <div className="mx-auto max-w-3xl px-4 py-8 border border-slate-200 rounded-lg mt-16">
    <div className="mb-8">
      <h1 className="text-3xl font-bold border border-gray-200 rounded-md text-white/80 text-center p-2">Business Onboarding</h1>
      <p className="mt-2 text-white/80 text-center">
        Please provide your business information for a customized obligation quotation
      </p>
    </div>

    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${index <= currentStep ? "text-white/80" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="ml-2 hidden sm:inline">{step}</span>
              {index < steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            {/* Step 1: Company Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" name="companyName" placeholder="Enter your company name" required />
                  {state?.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" type="url" placeholder="https://example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select name="industry" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" name="contactName" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" placeholder="Your position in the company" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1234567890" required />
                </div>
              </div>
            )}

            {/* Step 3: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" placeholder="Enter your country" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select name="companySize" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} employees
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Select name="annualRevenue" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue range" />
                    </SelectTrigger>
                    <SelectContent>
                      {["<1M", "1M-10M", "10M-50M", "50M-100M", ">100M"].map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Service Requirements */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">service Description</Label>
                  <Textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    placeholder="Please describe your service and requirements"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Expected Timeline</Label>
                  <Select name="timeline" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1-3 months", "3-6 months", "6-12 months", "12+ months"].map((timeline) => (
                        <SelectItem key={timeline} value={timeline}>
                          {timeline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select name="budget" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {["<50K", "50K-100K", "100K-500K", "500K+"].map((budget) => (
                        <SelectItem key={budget} value={budget}>
                          {budget}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 5: Meeting Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Meeting Times</Label>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <label key={slot} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="preferredTime"
                          value={slot}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select name="timezone" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {["GMT-8 (PST)", "GMT-5 (EST)", "GMT+0 (UTC)", "GMT+1 (CET)", "GMT+8 (CST)"].map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="Any additional information you'd like to share"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {state?.message && (
        <div className="mt-4 text-center font-medium">
          <p className={state.errors ? "text-destructive" : "text-primary"}>{state.message}</p>
        </div>
      )}
    </div>
    </div>
  )
}

