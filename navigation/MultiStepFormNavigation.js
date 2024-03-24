import React, { useState } from 'react';
import { View } from 'react-native';
import Step1Screen from './MultiStepForm/Step1Screen';
import Step2Screen from './MultiStepForm/Step2Screen';
import Step3Screen from './MultiStepForm/Step3Screen';

const Form = () => {
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
    });

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    return (
        <View>
            {step === 1 && (
                <Step1Screen
                    onNext={handleNext}
                    values={formValues}
                    setValues={setFormValues}
                />
            )}
            {step === 2 && (
                <Step2Screen
                    onPrev={handlePrev}
                    onNext={handleNext}
                    values={formValues}
                    setValues={setFormValues}
                />
            )}
            {step === 3 && (
                <Step3Screen
                    onPrev={handlePrev}
                    values={formValues}
                />
            )}
        </View>
    );
};

export default Form;