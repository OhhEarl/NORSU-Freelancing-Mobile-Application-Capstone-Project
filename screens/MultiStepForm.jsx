import React, { useState } from "react";

import VerificationScreen1 from "./VerificationScreen1";
import VerificationScreen2 from "./VerificationScreen2";
import { View } from "react-native";

const MultiStepForm = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    areaOfExpertise: "",
    norsuIDnumber: "",
    course: "",
    yearLevel: "",
    mobile_number: "",
    skillTags: [],
  });
  const [selectedImageUriFront, setSelectedImageUriFront] = useState("");
  const [selectedImageUriBack, setSelectedImageUriBack] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {step === 1 && (
        <VerificationScreen1
          navigation={navigation}
          onNext={handleNext}
          values={formValues}
          setValues={setFormValues}
        />
      )}
      {step === 2 && (
        <VerificationScreen2
          onPrev={handlePrev}
          values={formValues}
          setValues={setFormValues}
          selectedImageUriFront={selectedImageUriFront}
          setSelectedImageUriFront={setSelectedImageUriFront}
          selectedImageUriBack={selectedImageUriBack}
          setSelectedImageUriBack={setSelectedImageUriBack}
        />
      )}
    </View>
  );
};

export default MultiStepForm;
