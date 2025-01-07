import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Motion versions of the UI components
export const MotionCard = motion(Card);  // Animate the Card component
export const MotionCardContent = motion(CardContent);  // Animate the CardContent
export const MotionInput = motion(Input);  // Animate the Input component
export const MotionNumberInput = motion((props) => <Input {...props} type="number" />); // Input with number type
export const MotionTextarea = motion(Textarea);  // Animate the Textarea component
export const MotionButton = motion(Button);  // Animate the Button component
