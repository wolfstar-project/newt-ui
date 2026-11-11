"use client"

import * as React from "react"

import { Onboarding } from "@/registry/bases/newt/blocks/onboarding/onboarding"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/bases/newt/ui/alert"
import {
  CheckboxGroup,
  CheckboxOption,
} from "@/registry/bases/newt/ui/checkbox-group"
import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "@/registry/bases/newt/ui/form-fields"
import { Radio, RadioGroup } from "@/registry/bases/newt/ui/radio"

const STEPS = [
  { title: "Name your server", description: "You can change it later" },
  { title: "What is it for?", description: "Sets the defaults" },
  { title: "Starting channels", description: "Pick at least one" },
]

export default function OnboardingDemo() {
  const [name, setName] = React.useState("Build Club")
  const [purpose, setPurpose] = React.useState("community")
  const [channels, setChannels] = React.useState<readonly string[]>(["general"])
  const [step, setStep] = React.useState(0)
  const [done, setDone] = React.useState(false)

  const canContinue =
    step === 0 ? name.trim() !== "" : step === 2 ? channels.length > 0 : true

  if (done) {
    return (
      <Alert variant="success" className="max-w-xl">
        <AlertTitle>{name} is ready</AlertTitle>
        <AlertDescription>
          Created with {channels.length}{" "}
          {channels.length === 1 ? "channel" : "channels"}.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Onboarding
      className="max-w-xl"
      aria-label="Create a server"
      steps={STEPS}
      step={step}
      onStepChange={setStep}
      canContinue={canContinue}
      onComplete={() => setDone(true)}
    >
      {(current) =>
        current === 0 ? (
          <Field>
            <Label htmlFor="onboarding-name">Server name</Label>
            <Input
              id="onboarding-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <FieldHelp>
              Members see this at the top of the channel list.
            </FieldHelp>
          </Field>
        ) : current === 1 ? (
          <RadioGroup
            label="Purpose"
            value={purpose}
            onValueChange={setPurpose}
          >
            <Radio
              value="community"
              description="Open to anyone with the link."
            >
              A community
            </Radio>
            <Radio
              value="team"
              description="Invite only, for people you work with."
            >
              A team
            </Radio>
          </RadioGroup>
        ) : (
          <CheckboxGroup
            label="Starting channels"
            value={channels}
            onValueChange={setChannels}
          >
            <CheckboxOption value="general">#general</CheckboxOption>
            <CheckboxOption value="help" description="Questions and answers">
              #help
            </CheckboxOption>
            <CheckboxOption value="release-notes">
              #release-notes
            </CheckboxOption>
          </CheckboxGroup>
        )
      }
    </Onboarding>
  )
}
