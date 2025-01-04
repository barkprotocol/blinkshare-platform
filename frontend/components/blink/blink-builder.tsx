"use client";

import { useState, useEffect } from "react";
import { useBlinkStore } from "@/lib/contexts/zustand/blink-store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaCreditCard, FaPaypal } from "react-icons/fa";

interface BlinkFormData {
  iconUrl: string;
  title: string;
  description: string;
  fields: { label: string; value: string }[];
}

const BlinkMock = () => {
  const { formData }: { formData: BlinkFormData } = useBlinkStore();
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [giftMessage, setGiftMessage] = useState<string>("");

  useEffect(() => {
    const initialValues = formData.fields.reduce((acc, field) => {
      acc[field.label] = ''; // default value
      return acc;
    }, {} as { [key: string]: string });
    setFormValues(initialValues);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldLabel: string) => {
    const value = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldLabel]: value,
    }));

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldLabel]: "",
    }));
  };

  const validateField = (field: { label: string; value: string }, value: string) => {
    if (field.value === "text" && !value) {
      return `${field.label} is required.`;
    }
    return "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    let formValid = true;
    const newFieldErrors: { [key: string]: string } = {};

    formData.fields.forEach((field) => {
      const value = formValues[field.label] || "";
      const validationError = validateField(field, value);
      if (validationError) {
        newFieldErrors[field.label] = validationError;
        formValid = false;
      }
    });

    if (!formValid) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setFormValues({});
        setDonationAmount(0);
        setPaymentMethod(null);
        setGiftMessage("");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Something went wrong!");
    }
  };

  const handleDonation = () => {
    if (donationAmount <= 0) {
      setError("Donation amount must be greater than 0.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setDonationAmount(0);
    }, 2000);
  };

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
  };

  const handleGiftMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGiftMessage(e.target.value);
  };

  const generateSolanaPayURI = (amount: number, recipientAddress: string) => {
    return `solana:${recipientAddress}?amount=${amount}`;
  };

  const handleSolanaPay = () => {
    if (donationAmount <= 0) {
      setError("Donation amount must be greater than 0.");
      return;
    }

    const recipientAddress = "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo";
    const solanaURI = generateSolanaPayURI(donationAmount, recipientAddress);

    window.open(solanaURI, "_blank");
  };

  return (
    <Card className="w-full h-auto text-white">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={formData.iconUrl || "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"}
            alt="Website icon"
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <h1 className="text-primary text-lg font-semibold block mb-1">
          {formData.title || "Your Blink Title"}
        </h1>
        <p className="text-sm text-gray-400 mb-4">{formData.description || "Your Blink Description"}</p>

        {/* Form Fields */}
        {formData.fields.map((field, index) => (
          <div key={index} className="mb-4">
            <Input
              type={field.value} // Using "value" here
              placeholder={field.label}
              value={formValues[field.label] || ""}
              onChange={(e) => handleInputChange(e, field.label)}
              className={`text-white ${fieldErrors[field.label] ? "border-red-500" : ""}`}
            />
            {fieldErrors[field.label] && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors[field.label]}</p>
            )}
          </div>
        ))}

        {/* Error or Success Messages */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Donation Successful!</div>}

        {/* Donation Amount */}
        <div className="mt-4">
          <Input
            type="number"
            placeholder="Enter donation amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="text-white"
          />
        </div>

        {/* Gift Message */}
        <div className="mt-4">
          <textarea
            value={giftMessage}
            onChange={handleGiftMessageChange}
            placeholder="Add a gift message (optional)"
            className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Donation Button */}
        <div className="mt-4">
          <Button
            variant="default"  // Changed "primary" to "default"
            className="w-full py-3 text-lg font-semibold"
            onClick={handleDonation}
            disabled={loading || donationAmount <= 0}
          >
            {loading ? "Processing..." : "Donate"}
          </Button>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-white">Select Payment Method</h2>
          <div className="flex justify-between mt-2">
            <Button
              className="flex-1 mr-2"
              onClick={() => handlePaymentSelection("credit_card")}
              disabled={loading}
            >
              <FaCreditCard className="mr-2" />
              Credit Card
            </Button>
            <Button
              className="flex-1"
              onClick={() => handlePaymentSelection("paypal")}
              disabled={loading}
            >
              <FaPaypal className="mr-2" />
              PayPal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlinkMock;
