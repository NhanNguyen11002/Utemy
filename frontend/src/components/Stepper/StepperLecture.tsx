import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { QuestionMarkCircleIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

const StepperLecture = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <div className="w-full px-24 py-4">
            <Stepper
                className="bg-gray-400"
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
            >
                <Step>
                    <QuestionMarkCircleIcon
                        className={`h-5 w-5 ${activeStep === 0 ? "text-black" : "text-gray-400"}`}
                    />
                    <div className="absolute -bottom-[4.5rem] w-max text-center ">
                        <Typography variant="h6" className={`${activeStep === 0 ? "text-black" : "text-gray-400"}`}>
                            Bước 1
                        </Typography>
                        <Typography className={` font-normal ${activeStep === 0 ? "text-black" : "text-gray-400"}`}>
                            Details about yout account.
                        </Typography>
                    </div>
                </Step>
                <Step>
                    <DocumentCheckIcon className={`h-5 w-5 ${activeStep === 1 ? "text-black" : "text-gray-400"}`} />
                    <div className="absolute -bottom-[4.5rem] w-max text-center ">
                        <Typography variant="h6" className={`${activeStep === 1 ? "text-black" : "text-gray-400"}`}>
                            Bước 2
                        </Typography>
                        <Typography className={` font-normal ${activeStep === 1 ? "text-black" : "text-gray-400"}`}>
                            Details about yout account.
                        </Typography>
                    </div>
                </Step>
            </Stepper>
            <div className="mt-32 flex justify-between">
                <Button onClick={handlePrev} disabled={isFirstStep}>
                    Prev
                </Button>
                <Button onClick={handleNext} disabled={isLastStep}>
                    Next
                </Button>
            </div>
        </div>
    );
};
export default StepperLecture;
